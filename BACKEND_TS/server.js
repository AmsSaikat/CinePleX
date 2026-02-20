const fs = require("fs");
const fsp = require("fs/promises");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cookieParser = require("cookie-parser");
const { DB } = require("./db")
const crypto = require("crypto");
const { spawn } = require("child_process");

const DBS = {
    logins: new DB("./DB/logins.json"),
    theaters: new DB("./DB/theaters.json"),
    profiles: new DB("./DB/profiles.json", {}),
    videos: new DB("./DB/videos.json", {}),
    //invitations: new DB("./DB/invitations.json"),
}

const UPLOAD_STATUS = {
    
}
const PROCESSING_STATUS = {
    
}
const THEATER_PLAYBACK_TIME = {

}
const CLIENTS = {

}

// Map<TheaterID, Set<Username>> - Tracks who is currently in the Voice Mesh
const VOICE_SESSIONS = new Map(); 

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// app.use((req, res, next) => {
//     setTimeout(next, 50);
// });

//=========================================================

DBS.theaters.UpdateAll((key, value)=>{
    value.isPlaying = false;
    THEATER_PLAYBACK_TIME[key] = value.current_time;
    return value;
})

function timeToSeconds(t) {
  const [h, m, s] = t.split(":");
  return (+h) * 3600 + (+m) * 60 + parseFloat(s);
}

function ffprobeVideoInfo(filePath) {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v", "error",
      // Select only the first video stream
      "-select_streams", "v:0", 
      // Request width, height from streams and duration from format
      "-show_entries", "stream=width,height:format=duration", 
      "-of", "json",
      filePath
    ]);

    let output = "";

    ffprobe.stdout.on("data", data => {
      output += data.toString();
    });

    ffprobe.on("close", code => {
      if (code === 0) {
        try {
          const data = JSON.parse(output);
          
          // Use optional chaining (?.) to prevent crashes if a property is missing
          const duration = parseFloat(data.format?.duration);
          const stream = data.streams?.[0] || {};
          const height = stream.height;
          const width = stream.width;

          console.log({ width, height, duration });
          resolve({ duration, height, width });
        } catch (err) {
          reject(new Error("Failed to parse ffprobe JSON output"));
        }
      } else {
        reject(new Error(`ffprobe exited with code ${code}`));
      }
    });
  });
}

function remuxWithProgress(vid, theater_id, input, output) {
  const ffmpeg = spawn("ffmpeg", [
    "-y", 
    "-i", input,
    "-c", "copy",
    "-movflags", "+faststart",
    "-progress", "pipe:1",
    "-nostats",
    output
  ]);

  let duration = null;

  ffmpeg.stderr.on("data", data => {
    const str = data.toString();

    // extract duration once
    const durMatch = str.match(/Duration:\s(\d+:\d+:\d+\.\d+)/);
    if (durMatch && !duration) {
      duration = timeToSeconds(durMatch[1]);
    }
  });

  ffmpeg.stdout.on("data", data => {
    const str = data.toString();
    const timeMatch = str.match(/out_time=(\d+:\d+:\d+\.\d+)/);

    if (timeMatch && duration) {
      const current = timeToSeconds(timeMatch[1]);
      const percent = Math.min((current / duration) * 100, 100);
      PROCESSING_STATUS[vid] = percent;
      process.stdout.write(`Progress: ${percent.toFixed(2)}%\r`);
    }
  });

  ffmpeg.on("close", code => {
    console.log(`\nDone (exit code ${code})`);
    PROCESSING_STATUS[vid] = 100;
    const theater = DBS.theaters.Get(theater_id);
    theater["video_processing_done"] = true;
    DBS.theaters.Set(theater_id, theater);
    const filePath = "VIDEOS/"+vid;
    if(fs.existsSync(filePath)) fs.rmSync(filePath);
  });
}

async function DoVideoProcessing(vid, theater_id){
    console.log("PROCESSING INIT", {vid});    
    const input_path = "VIDEOS/" + vid;
    const output_path = "public/videos/" + vid + ".mp4";
    const {duration, height, width} = await ffprobeVideoInfo(input_path);
    const theater = DBS.theaters.Get(theater_id);
    theater["video_duration"] = duration;
    theater["video_resolution"] = width+"x"+height;
    DBS.theaters.Set(theater_id, theater);
    remuxWithProgress(vid, theater_id, input_path, output_path);
}


//====================================================
app.post("/upload", async (req, res)=>{
    const vid = req.query["video-id"];
    const byteIndex = parseInt(req.query["byteIndex"]);
    const filepath = "VIDEOS/"+vid;
    const totalSize = DBS.videos.Get(vid)["filesize"];
    const theater_id = DBS.videos.Get(vid)["id"];
    //console.log("/upload", {vid, byteIndex, filepath, totalSize});
    const fss = fs.createWriteStream(filepath, {
        flags: "r+",
        start: byteIndex,
        autoClose: true
    });
    let count = 0;
    req.on("data", chunk => {
        count += chunk.length;
    });
    fss.on("finish", _=>{
        //console.log(0, "FINISH", {vid, filepath, count, totalSize, byteIndex})
        UPLOAD_STATUS[vid][0] += count;
        if(UPLOAD_STATUS[vid][0] == UPLOAD_STATUS[vid][1]){
            console.log("FINISH UPLOAD");
            const theater = DBS.theaters.Get(theater_id);
            theater["video_upload_done"] = true;
            DBS.theaters.Set(theater_id, theater);
            DoVideoProcessing(vid, theater_id);
        }
        res.send("done");
    })
    req.pipe(fss);
})
//====================================================
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function CheckAuth(username, password){
    return username && DBS.logins.Get(username) && DBS.logins.Get(username) == password;
}

// This middleware runs for all requests
app.use((req, res, next) => {
    const { username, password } = req.cookies;
    req.isLoggedIn = CheckAuth(username, password);

    const protectedPaths = ["/dashboard", "/theater", "/invite", "/accept_invite"];
    
    if (protectedPaths.some(p => req.path.startsWith(p))) {   
        const next_url = req.url;   
        if (!req.isLoggedIn) {
            return res.redirect("/login?next=" + next_url);
        }
    }
    
    if(req.path == ("/theater/")){
        const theater_id = req.query["id"];
        if(!theater_id || !DBS.theaters.Get(theater_id)) return res.redirect("/no-theater");
        if(!DBS.theaters.Get(theater_id).members.includes(username)) return res.redirect("/not-theater-member");
    }
    
    if(req.path == ("/theater-settings/")){
        const theater_id = req.query["id"];
        if(!theater_id || !DBS.theaters.Get(theater_id)) return res.redirect("/no-theater");
        if(DBS.theaters.Get(theater_id).host != username) return res.redirect("/not-theater-host");
    }

    next();
});


// app.get("/", (req, res) => {
//     res.send("Express + WebSocket server running");
// });

app.get("/profile", (req, res) => {
    const username = req.query["username"]
    const profile = DBS.profiles.Get(username);
    res.send(JSON.stringify(profile));
});

app.get("/self_profile", (req, res) => {
    const username = req.cookies["username"];
    const profile = DBS.profiles.Get(username);
    res.send(JSON.stringify(profile));
});


app.get("/accept_invite", (req, res) => {
    const username = req.cookies["username"];
    const theater_id = req.query["id"];
    if(!DBS.theaters.Get(theater_id)){
        res.status(404).send("NO THEATER FOUND");
    }

    
    const profile = DBS.profiles.Get(username);
    const theater = DBS.theaters.Get(theater_id);
    if(theater.members.includes(username)) return res.redirect("/dashboard");

    theater.members.push(username);
    profile.joined.push(theater_id);
    DBS.profiles.Set(username, profile);
    DBS.theaters.Set(theater_id, theater);

    res.redirect("/dashboard");
});

app.get("/create_theater", (req, res) => {
    const username = req.cookies["username"];
    if(!req.isLoggedIn){
        return res.status(403).send("Not logged in");
    }

    const name = req.query["name"];
    const theater_uid = `th_${Date.now()}`;
    const theater_data = {
        uid: theater_uid,
        name,
        banner: "",
        members: [username],
        videos: [],
        currently_playing: "",
        roles: [],
        premier_time: 1,
        host: username,
        online_members: [],
        video_resolution: "0x0",
        video_duration: 0,
        video_control_host_mode: true,
        isPlaying: false,
        current_time: 0,
        random: 0

    }
    DBS.theaters.Set(theater_uid, theater_data);
    const profile = DBS.profiles.Get(username);
    profile.theaters.push(theater_uid);
    DBS.profiles.Set(username, profile);
    res.send(theater_data);
});

app.get("/theater_info", (req, res)=>{
    const uids = req.query["uids"].split(",");
    //console.log(uids);
    const out = {
        data: []
    }

    uids.forEach(uid=>{
        const dt = DBS.theaters.Get(uid);
        if(dt) out.data.push(dt);
    });
    res.send(JSON.stringify(out));
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const next_url = req.query["next"];

    if (DBS.logins.Get(username) && DBS.logins.Get(username) != password) {
        //console.log({username, password})
        let u = "/login?error=Wrong Username or Password";
        if(next_url && next_url != "") u += "&next="+next_url;
        return res.redirect(u)
    }

    if(!DBS.logins.Get(username)){
        DBS.logins.Set(username, password);
        DBS.profiles.Set(username, {
            name: "---",
            theaters: [],
            joined: []
        });
    }

    res.cookie("username", username);
    res.cookie("password", password);

    if(next_url && next_url != "") res.redirect(next_url);
    else res.redirect("/dashboard");
});

app.get("/initiate-upload", async (req, res)=>{
    const id = req.query['id'];
    const filename = req.query["filename"];
    const filesize = parseInt(req.query["filesize"]);
    const hash = crypto.createHash("md5").update(filename+filesize).digest("hex");
    const filepath = "VIDEOS/"+hash;

    console.log("/initiate-upload", {id, filename, filepath, filesize});

    const fh = await fsp.open(filepath, "w");
    await fh.truncate(filesize);
    await fh.close();

    UPLOAD_STATUS[hash] = [0, filesize];
    PROCESSING_STATUS[hash] = 0;
    DBS.videos.Set(hash, {
        filename,
        filesize,
        id
    })
    const theater = DBS.theaters.Get(id);
    theater["video_id"] = hash;
    theater["video_name"] = filename;
    theater["video_upload_done"] = false;
    theater["video_processing_done"] = false;
    DBS.theaters.Set(id, theater);

    res.send(hash);
});

app.get("/processing-state", (req, res)=>{
    const vid = req.query["vid"];
    res.send(PROCESSING_STATUS[vid]);
});
app.get("/remove-video", (req, res)=>{
    const id = req.query["id"];
    const theater = DBS.theaters.Get(id);
    const old_video_id = theater.video_id;
    theater["video_id"] = "";
    theater["video_name"] = "";
    theater["video_upload_done"] = false;
    theater["video_processing_done"] = false;
    DBS.theaters.Set(id, theater);

    const filePath = "public/videos/"+old_video_id+".mp4";
    if(fs.existsSync(filePath)) fs.rmSync(filePath);

    res.send("done");
});

wss.on("connection", (ws, req) => {
    const rawCookies = req.headers.cookie;
    const cookies = {};    
    if (rawCookies) {
        rawCookies.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            const name = parts.shift().trim();
            const value = decodeURI(parts.join('='));
            cookies[name] = value;
        });
    }
    const username = cookies["username"];
    const password = cookies["password"];
    const urlParams = new URLSearchParams(req.url.split('?')[1]); 
    const theater_id = urlParams.get("id");

    console.log("WebSocket client connected", {username, password, theater_id});

    if(!CheckAuth(username, password) || !DBS.theaters.Get(theater_id)){
        req.destroy();
        return;
    }

    // Initialize Voice Set for this theater if not exists
    if(!VOICE_SESSIONS.has(theater_id)) VOICE_SESSIONS.set(theater_id, new Set());

    SetOnline(theater_id, username);
    SendToAll(theater_id, "chat_message", {type:0, msg:username+" joined the theater!"});            
    SendToAll(theater_id, "theater_entry", "");
    CLIENTS[username] = ws;
    ws.send(JSON.stringify({action:"seek", data:THEATER_PLAYBACK_TIME[theater_id] | 0}))

    const WS_ACTIONS = {
        theater_info(){
            ws.send(JSON.stringify({action: "theater_info", data: DBS.theaters.Get(theater_id)}));
        },
        toggle_video_control_mode(){
            // const theater = DBS.theaters.Get(theater_id);
            // theater.video_control_host_mode = !theater.video_control_host_mode;
            // DBS.theaters.Set(theater_id, theater);
            DBS.theaters.Update(theater_id, t=>{
                t.video_control_host_mode = !t.video_control_host_mode;
                return t;
            });
        },
        play(){
            DBS.theaters.Update(theater_id, t=>{
                t.isPlaying = true;
                return t;
            })
            DBS.theaters.Update(theater_id, t=>{
                t.random = Date.now();
                return t;
            })
        },
        pause(){
            DBS.theaters.Update(theater_id, t=>{
                t.isPlaying = false;
                return t;
            })
            DBS.theaters.Update(theater_id, t=>{
                t.random = Date.now();
                return t;
            })
        },
        seek(data){
            THEATER_PLAYBACK_TIME[theater_id] = data;
            DBS.theaters.Update(theater_id, t=>{
                t.current_time = data;
                return t;
            })
            SendToAll(theater_id, "seek", data);
        },
        soft_seek(data){
            THEATER_PLAYBACK_TIME[theater_id] = data;
            DBS.theaters.Update(theater_id, t=>{
                t.current_time = data;
                return t;
            })
        },
        echo_seek(){
            ws.send(JSON.stringify({action:"seek", data:THEATER_PLAYBACK_TIME[theater_id]}))
        },
        chat_message(data){
            SendToAll(theater_id, "chat_message", data);            
        },
        quick_reaction(index){
            SendToAll(theater_id, "quick_reaction", index);
        },
        
        // --- WEBRTC SIGNALING ACTIONS ---
        join_voice(){
            // 1. Add user to voice set
            const vUsers = VOICE_SESSIONS.get(theater_id);
            
            // 2. Send the NEW user the list of EXISTING voice users
            const existing = Array.from(vUsers);
            ws.send(JSON.stringify({ action: "existing_voice_users", data: existing }));

            // 3. Notify EXISTING voice users that NEW user joined
            // We only send this to people currently in the voice session for this theater
            existing.forEach(existingUser => {
                if(CLIENTS[existingUser] && CLIENTS[existingUser].readyState === WebSocket.OPEN){
                    CLIENTS[existingUser].send(JSON.stringify({ action: "user_joined_voice", data: username }));
                }
            });

            vUsers.add(username);
        },
        voice_offer(payload){
            // Relay offer to target
            const targetWs = CLIENTS[payload.targetId];
            if(targetWs && targetWs.readyState === WebSocket.OPEN){
                targetWs.send(JSON.stringify({ 
                    action: "voice_offer", 
                    data: { senderId: username, sdp: payload.sdp } 
                }));
            }
        },
        voice_answer(payload){
            // Relay answer to target
            const targetWs = CLIENTS[payload.targetId];
            if(targetWs && targetWs.readyState === WebSocket.OPEN){
                targetWs.send(JSON.stringify({ 
                    action: "voice_answer", 
                    data: { senderId: username, sdp: payload.sdp } 
                }));
            }
        },
        voice_ice(payload){
            // Relay ICE candidate to target
            const targetWs = CLIENTS[payload.targetId];
            if(targetWs && targetWs.readyState === WebSocket.OPEN){
                targetWs.send(JSON.stringify({ 
                    action: "voice_ice", 
                    data: { senderId: username, candidate: payload.candidate } 
                }));
            }
        }
        // ------------------------------
    }
    
    ws.on("message", (_data) => {
        try {
            const parsed = JSON.parse(_data+"");
            const action = parsed.action;
            const data = parsed.data;
            if(!["theater_info", "soft_seek"].includes(action)) console.log({action, user: username});
            if(WS_ACTIONS[action]) WS_ACTIONS[action](data);
        } catch(e) {
            console.error("WS Error", e);
        }
    });
    
    ws.on("close", () => {
        console.log("Client disconnected");
        SetOffline(theater_id, username);
        SendToAll(theater_id, "theater_leave", "");
        SendToAll(theater_id, "chat_message", {type:0, msg:username+" has left"}); 
        
        // Cleanup Voice Session
        if(VOICE_SESSIONS.has(theater_id)){
            const vUsers = VOICE_SESSIONS.get(theater_id);
            if(vUsers.has(username)){
                vUsers.delete(username);
                // Notify others in voice to remove peer
                vUsers.forEach(otherUser => {
                    if(CLIENTS[otherUser]) {
                        CLIENTS[otherUser].send(JSON.stringify({ action: "voice_user_left", data: { id: username }}));
                    }
                });
            }
        }

        delete CLIENTS[username];
    });
});

function SendToAll(theater_id, action, data){
    const members = DBS.theaters.Get(theater_id).members;
    members.forEach(m=>{
        if(CLIENTS[m]) CLIENTS[m].send(JSON.stringify({action, data}));
    })
    console.log("SEND TO ALL", {action, data})
}

function SetOnline(theater_id, username){
    const theater = DBS.theaters.Get(theater_id);
    if(!theater.online_members.includes(username)) theater.online_members.push(username);
    DBS.theaters.Set(theater_id, theater);
}
function SetOffline(theater_id, username){
    const theater = DBS.theaters.Get(theater_id);
    theater.online_members = theater.online_members.filter(x => x !== username);
    DBS.theaters.Set(theater_id, theater);
}

app.use(express.static('public'))
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
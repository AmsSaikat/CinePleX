const username = getCookie("username");

function getCookie(name) {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
}

ShowHideBuffer(true);
ShowHideControlsLayer(false);

let ws;

const SFX = {
    chatMsg: new Audio('/sfx/chat-notification.wav'),
    theaterEntry: new Audio('/sfx/theater-entry.wav'),
    //theaterLeave: new Audio('/sfx/chat-notification.wav'),
    voiceEntry: new Audio('/sfx/voice-entry.wav'),
    //voiceLeave: new Audio('/sfx/chat-notification.wav'),
};
[...Object.values(SFX)].forEach(v=>v.preload = 'auto');

document.addEventListener('DOMContentLoaded', async () => {
    const theater_id = new URLSearchParams(window.location.search).get("id");

    console.log("STARTING WS");
    ws = new WebSocket("/?id="+theater_id);
    ws.onopen = (ev)=>{
        setInterval(()=>{
            ws.send(JSON.stringify({action:"theater_info", data:""}));
        }, 100);
        setInterval(() => {
            const time = document.getElementById("main-video").currentTime;
            WS_SEND("soft_seek", time);
        }, 1000);
    }
    
    let last_theater_info = "";
    ws.onmessage = (ev)=>{        
        const WS_ACTIONS = {
            theater_entry(){
                console.log("Theater entry");
                PlaySFX(SFX.theaterEntry);
            },
            theater_leave(){
                //console.log("Theater leave");
                //PlaySFX(SFX.theaterLeave);
            },
            theater_info(data){
                const jsd = JSON.stringify(data);
                if(last_theater_info == jsd) return;
                last_theater_info = jsd;
                //console.log(last_theater_info, jsd);
                //console.log(last_theater_info, data);
                console.log(data);
                EventTheaterInfo({username, theater_id, ...data});
            },
            seek(time){
                //const targetTime = Math.max(0, Math.min(time, video.duration));
                console.log("seek", time);
                video.currentTime = time;
            },
            chat_message({type, msg, sender}){
                if(type==0){
                    AddChatMessageInfoText(msg);
                }
                if(type==1){
                    if(!isChatOpen) PlaySFX(SFX.chatMsg);
                    AddChatMessageText(msg, sender, sender==username);
                }
                if(type==2){
                    if(!isChatOpen) PlaySFX(SFX.chatMsg);
                    AddChatMessageSticker(msg, sender, sender==username);
                }
                
                ShowHideNotificationIcon(true);
            },
            quick_reaction(index){
                SpawnQuickReactionBubble(index);
            }
        }
        const {action, data} = JSON.parse(ev.data+"");
        if(WS_ACTIONS[action]) {
            WS_ACTIONS[action](data);
        }
        if (['existing_voice_users', 'user_joined_voice', 'voice_offer', 'voice_answer', 'voice_ice', 'voice_user_left'].includes(action)) {
            HandleVoiceSignal(action, data);
        }
    }
});

let video_url = "";
let video_playing_state = false;
let members_cache = [];
function EventTheaterInfo({
    theater_id, username, banner, currently_playing, 
    members, name, premier_time, roles, uid, videos, host, video_id, video_name, 
    video_upload_done, video_processing_done, video_duration, video_resolution,
    video_control_host_mode, isPlaying, online_members})
{
    console.log(theater_id)
    isSelfHost = host == username;
    canInteractWithControl = isSelfHost || !video_control_host_mode;
    ShowHideBuffer(false);
    ShowHideControlsLayer(true);
    SetVideoControlButton(video_control_host_mode);
    SetControlsInteractable(canInteractWithControl);

    const tv_url = "/videos/" + video_id + ".mp4";
    if(video_url != tv_url) {
        video_url = tv_url;
        LoadVideo(video_url);
        WS_SEND("echo_seek", "");
    }

    if(isPlaying) PlayVideo();
    else PauseVideo();

    if(online_members != members_cache){
        RemoveAllMemberCards();
        online_members.forEach(m=>{
            if(!members_cache[m]) AddMemberCard(m);
        });
        members_cache = [...online_members];
    }
}

//PlaySFX(SFX.theaterEntry);

function WS_SEND(action, data){
    ws.send(JSON.stringify({action, data}));
}

function ToggleVideoControlMode(){
    WS_SEND("toggle_video_control_mode", "");
}

function PlaySFX(sound) {
  sound.currentTime = 0;
  sound.play();
}

function ShowHideNotificationIcon(show){
    document.getElementById("notification-icon").style.display = show ? "block" : "none";
}

function AddMemberCard(_user){
    document.getElementById("members-panel").innerHTML += `<div class="members-card" id="member_card_${_user}"><i class="fa-solid fa-user"></i> ${_user}</div>`
}

function RemoveAllMemberCards(_user){
    const ele = document.getElementById("members-panel");
    ele.innerHTML = "";
}
/* ==========================================
   STATE VARIABLES
   ========================================== */
let isPlaying = false;
let isChatOpen = false;
let isControlsInteractive = true;
let idleTimer = null;
let currentSubtitle = null;

let isNowImHostModeState = false;
let isSelfHost = false;
let canInteractWithControl = false;
let micOnStatus = false;

// --- WEBRTC STATE ---
let isVoiceConnected = false;
let localStream = null;
const peers = {}; // Key: Username, Value: RTCPeerConnection
const rtcConfig = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" }
    ]
};
let myUsername = getCookie("username"); // Helper to identify self in mesh
// --------------------

const REACTION_STICKERS = [
    ["/stickers/0.png", "/sfx/love.mp3"],
    ["/stickers/1.png", "/sfx/laugh.mp3"],
    ["/stickers/2.png", "/sfx/wow.mp3"],
    ["/stickers/sad.png", "/sfx/sad.mp3"],
    ["/stickers/angry.png", "/sfx/angry.mp3"],
    ["/stickers/clap.png", "/sfx/clap.mp3"],
    ["/stickers/fire.png", "/sfx/fire.mp3"], // Extra stickers for the panel
    ["/stickers/100.png", "/sfx/pop.mp3"],
    ["/stickers/ghost.png", "/sfx/boo.mp3"]
];

// Track which 5 stickers are currently in the quick bar (Store Indices)
let quickStickerIndices = [0, 1, 2, 3, 4]; 

const video = document.getElementById('main-video');
const controlsLayer = document.getElementById('controls-layer');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = playPauseBtn.querySelector('i');
const timelineContainer = document.getElementById('timeline-container');
const timelineFill = document.getElementById('timeline-fill');
const timelineThumb = document.getElementById('timeline-thumb');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const subtitleDisplay = document.getElementById('subtitle-display');
const bufferOverlay = document.getElementById('buffer-overlay');
const reactionVisualLayer = document.getElementById('reaction-visual-layer');

/* ==========================================
   PUBLIC API FUNCTIONS
   ========================================== */

function LoadVideo(url) {
    console.log("LoadVideo()")
    video.src = url;
    video.load();
    console.log(`Loading video: ${url}`);
    PauseVideo();
}

function PlayVideo() {
    console.log("PlayVideo()");
    video.play().then(() => {
        isPlaying = true;
        updatePlayPauseIcon();
    }).catch(err => console.error("Play failed", err));
}

function PauseVideo() {
    console.log("PauseVIdeo()");
    video.pause();
    isPlaying = false;
    updatePlayPauseIcon();
}

function OnPlayClick() {
    console.log("API: OnPlayClick");
    if(!canInteractWithControl) return;
    const time = document.getElementById("main-video").currentTime;
    WS_SEND("play", time);
}

function OnPauseClick() {
    console.log("API: OnPauseClick");
    if(!canInteractWithControl) return;    
    const time = document.getElementById("main-video").currentTime;
    WS_SEND("pause", time);
}

function OnSeek(timeSec) {
    console.log(`API: OnSeek to ${timeSec}s`);
    if (video.duration && !isNaN(timeSec)) {
        WS_SEND("seek", timeSec);
    }
}

function SetControlsInteractable(isInteractive) {
    isControlsInteractive = isInteractive;
    console.log(`API: Controls Interaction set to ${isInteractive}`);

    if (isInteractive) {
        playPauseBtn.classList.remove('disabled-interaction');
        timelineContainer.classList.remove('disabled-interaction');
        playPauseBtn.title = "Play/Pause";
    } else {
        playPauseBtn.classList.add('disabled-interaction');
        timelineContainer.classList.add('disabled-interaction');
        playPauseBtn.title = "Controls disabled by Host";
    }
}

function ShowHideBuffer(doShow) {
    if (doShow) bufferOverlay.classList.remove('hidden');
    else bufferOverlay.classList.add('hidden');
}

function ShowHideSubtitles(doShow) {
    if (doShow) subtitleDisplay.classList.remove('hidden');
    else subtitleDisplay.classList.add('hidden');
}

function OnChatOpen() {
    console.log("API: OnChatOpen");
    isChatOpen = true;
    ShowHideNotificationIcon(false);
    document.getElementById('chat-panel').classList.add('open');
    document.getElementById('chat-btn').classList.add('active');
    setTimeout(ScrollChatToBottom, 300); // Ensure scroll is correct after transition
}

function OnChatClose() {
    console.log("API: OnChatClose");
    isChatOpen = false;
    ShowHideNotificationIcon(false);
    document.getElementById('chat-panel').classList.remove('open');
    document.getElementById('chat-btn').classList.remove('active');
}

function OnChatMessageSendClick(text){
    const username = getCookie("username");
    WS_SEND("chat_message", {type:1, msg:text, sender:username})
}

// --- MODIFIED MIC BUTTON LOGIC ---
async function OnMicButtonClick(){
    const btn = document.getElementById("mic-btn");
    const onIcon = document.getElementById("mic-icon-on");
    const offIcon = document.getElementById("mic-icon-off");

    // Case 1: First time clicking (Not connected to voice mesh yet)
    if (!isVoiceConnected) {
        try {
            console.log("API: Requesting Mic Access...");
            // Request permissions
            localStream = await navigator.mediaDevices.getUserMedia({ 
                audio: { echoCancellation: true, noiseSuppression: true },
                video: false
            });
            document.getElementById("join-call-btn").style.display = "none";
            document.getElementById("mic-btn").style.display = "block";

            // If successful, set state
            isVoiceConnected = true;
            micOnStatus = true; // Initially ON after connecting
            
            // Join the signaling mesh
            WS_SEND("join_voice", {});

            console.log("API: Joined Voice Mesh");

        } catch (e) {
            console.error("Mic access denied or error:", e);
            alert("Could not access microphone. Please check permissions.");
            return;
        }
    } 
    // Case 2: Already connected, just toggle mute
    else {
        micOnStatus = !micOnStatus;
        if(localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = micOnStatus);
        }
    }

    // Update UI based on new status
    onIcon.style.display = micOnStatus ? "block" : "none";
    offIcon.style.display = micOnStatus ? "none" : "block";
    btn.style.backgroundColor = micOnStatus ? "rgba(1, 255, 56, 0.64)" : "rgba(56, 56, 56, 0.47)";
}
// ---------------------------------

function OnTheaterSettingsClick() {
    const theater_id = new URLSearchParams(window.location.search).get("id");
    window.open("/theater-settings?id=" + theater_id, "_blank");
}

function ToggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
}

function SetSubtitleListItems(items) {
    const list = document.getElementById('subtitle-list');
    list.innerHTML = '';
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item.text;
        li.onclick = () => {
            Array.from(list.children).forEach(c => c.classList.remove('selected'));
            li.classList.add('selected');
            OnSubtitleSelected(index);
        };
        list.appendChild(li);
    });
}

function SetAudioTrackListItems(items) {
    const list = document.getElementById('audio-list');
    list.innerHTML = '';
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item.text;
        li.onclick = () => {
            Array.from(list.children).forEach(c => c.classList.remove('selected'));
            li.classList.add('selected');
            OnAudioTrackSelected(index);
        };
        list.appendChild(li);
    });
}

function OnSubtitleSelected(index) {
    console.log(`API: Subtitle index ${index} selected`);
    if(index === 0) ShowHideSubtitles(false);
    else {
        ShowHideSubtitles(true);
        subtitleDisplay.innerText = "Sample Subtitle Text"; 
    }
    closeModal();
}

function OnAudioTrackSelected(index) {
    console.log(`API: Audio track index ${index} selected`);
    closeModal();
}

/* ==========================================
   QUICK REACTION API
   ========================================== */

function OnQuickReactionClick(index) {
    if (index < 0 || index >= REACTION_STICKERS.length) return;
    
    // Note: 'index' here is the index in the MASTER REACTION_STICKERS array
    console.log(`API: Quick Sticker Clicked Index: ${index}`);
    
    // WS_SEND sends the master index so others spawn the correct image
    WS_SEND("quick_reaction", index);
}

function SpawnQuickReactionBubble(index) {
    if (index < 0 || index >= REACTION_STICKERS.length) return;
    
    const [imgUrl, audioUrl] = REACTION_STICKERS[index];
    
    // 1. Play Audio (New instance every time)
    if(audioUrl) {
        const audio = new Audio(audioUrl);
        audio.volume = 0.5; // Adjust volume as needed
        audio.play().catch(e => console.log("Audio autoplay blocked", e));
        audio.onended = () => {
            audio.remove(); // Cleanup
        };
    }

    // 2. Spawn Visual Bubble
    const bubble = document.createElement('div');
    bubble.classList.add('reaction-bubble');
    // Inject Image instead of text
    bubble.innerHTML = `<img src="${imgUrl}" alt="sticker">`;
    
    const randomX = (Math.random() - 0.5) * 60; 
    bubble.style.setProperty('--rnd-x', `${randomX}px`);
    
    const startLeft = 40 + (Math.random() * 40);
    bubble.style.left = `${startLeft}px`;

    const duration = 1.5 + Math.random() * 1.0;
    bubble.style.animationDuration = `${duration}s`;

    reactionVisualLayer.appendChild(bubble);

    setTimeout(() => {
        if(bubble && bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    }, duration * 1000);
}

function InitQuickReactions() {
    const bar = document.getElementById('quick-reaction-bar');
    if(!bar) return;
    
    bar.innerHTML = '';
    
    // Render the 5 stickers currently in the quick list
    quickStickerIndices.forEach((masterIndex) => {
        const [imgUrl] = REACTION_STICKERS[masterIndex];
        
        const btn = document.createElement('button');
        btn.classList.add('sticker-btn');
        btn.innerHTML = `<img src="${imgUrl}" draggable="false">`;
        btn.onclick = (e) => {
            e.stopPropagation(); 
            // Clicked from quick bar: Just play, don't reorder
            OnQuickReactionClick(masterIndex);
        };
        bar.appendChild(btn);
    });

    // Render the Plus Button at the 6th position
    const plusBtn = document.createElement('button');
    plusBtn.classList.add('sticker-plus-btn');
    plusBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
    plusBtn.onclick = (e) => {
        e.stopPropagation();
        ToggleStickerPanel();
    };
    bar.appendChild(plusBtn);

    RenderStickerPanel(); // Ensure panel is ready
}

function ToggleStickerPanel() {
    const panel = document.getElementById('sticker-panel');
    panel.classList.toggle('hidden');
}

function RenderStickerPanel() {
    const grid = document.getElementById('sticker-grid');
    grid.innerHTML = '';

    REACTION_STICKERS.forEach((sticker, index) => {
        const [imgUrl] = sticker;
        const btn = document.createElement('button');
        btn.classList.add('sticker-btn'); // Reuse style
        btn.innerHTML = `<img src="${imgUrl}" draggable="false">`;
        btn.onclick = (e) => {
            e.stopPropagation();
            OnPanelStickerClick(index);
        };
        grid.appendChild(btn);
    });
}

function OnPanelStickerClick(index) {
    // 1. Play the reaction
    OnQuickReactionClick(index);

    // 2. Logic: Update Quick List
    // If it's NOT already in the top 5, add to front, remove last.
    if (!quickStickerIndices.includes(index)) {
        quickStickerIndices.unshift(index); // Add to front
        quickStickerIndices.pop(); // Remove the last one (keep size 5)
        
        // Re-render the quick bar to show change
        InitQuickReactions();
    }
    
    // Optional: Close panel after selection?
    // ToggleStickerPanel(); 
}
/* ==========================================
   CHAT API FUNCTIONS
   ========================================== */

function AddChatMessageText(text, sender_name, isSelf) {
    if (!text) return;
    const chatBody = document.getElementById('chat-body');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${isSelf ? 'self' : 'other'}`;
    
    // If it's another person, show their name. If self, CSS hides it mostly, but HTML structure is cleaner without it for self.
    const nameHtml = isSelf ? '' : `<span class="sender-name">${escapeHtml(sender_name)}</span>`;
    
    msgDiv.innerHTML = `
        ${nameHtml}
        <div class="message-bubble">${escapeHtml(text)}</div>
    `;
    chatBody.appendChild(msgDiv);
    ScrollChatToBottom();
}

function AddChatMessageSticker(sticker_url, sender_name, isSelf) {
    const chatBody = document.getElementById('chat-body');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${isSelf ? 'self' : 'other'}`;
    
    const nameHtml = isSelf ? '' : `<span class="sender-name">${escapeHtml(sender_name)}</span>`;
    
    msgDiv.innerHTML = `
        ${nameHtml}
        <img src="${sticker_url}" class="sticker-img" alt="sticker" />
    `;
    
    chatBody.appendChild(msgDiv);
    
    // Image loading might affect scroll height, ensure we scroll after load
    const img = msgDiv.querySelector('img');
    if(img) {
        img.onload = ScrollChatToBottom;
    }
    ScrollChatToBottom();
}

function AddChatMessageInfoText(text) {
    const chatBody = document.getElementById('chat-body');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'info-message';
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    ScrollChatToBottom();
}

function ScrollChatToBottom() {
    const chatBody = document.getElementById('chat-body');
    chatBody.scrollTop = chatBody.scrollHeight;
}

function escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================
   WEBRTC LOGIC & SIGNALING HANDLING
   ========================================== */

function CreatePeer(targetUsername, isInitiator) {
    console.log(`WebRTC: Creating peer for ${targetUsername} (Initiator: ${isInitiator})`);
    
    const pc = new RTCPeerConnection(rtcConfig);
    peers[targetUsername] = pc;

    // Add local mic tracks to the connection
    if (localStream) {
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    // Handle ICE Candidates
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            WS_SEND("voice_ice", { targetId: targetUsername, candidate: event.candidate });
        }
    };

    // Handle incoming audio stream from remote user
    pc.ontrack = (event) => {
        console.log(`WebRTC: Received track from ${targetUsername}`);
        const remoteStream = new MediaStream([event.track]);
        
        // Create an audio element to play the sound
        // Speaker is always ON as per requirement
        const audioEl = new Audio();
        audioEl.srcObject = remoteStream;
        audioEl.autoplay = true;
        audioEl.controls = false;
        audioEl.id = `audio_${targetUsername}`;
        document.body.appendChild(audioEl); // Append to DOM to ensure playback
        
        audioEl.play().catch(e => console.log("Audio play error (likely autoplay policy):", e));
    };

    // Create Offer logic
    if (isInitiator) {
        pc.onnegotiationneeded = async () => {
            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                WS_SEND("voice_offer", { targetId: targetUsername, sdp: offer });
            } catch (err) {
                console.error("WebRTC Offer Error:", err);
            }
        };
    }

    return pc;
}

// THIS FUNCTION MUST BE CALLED BY YOUR WEBSOCKET ONMESSAGE HANDLER
function HandleVoiceSignal(action, data) {
    if (!isVoiceConnected) return; // Ignore if not joined voice yet

    switch (action) {
        case 'existing_voice_users':
            // data contains list of usernames currently in voice
            console.log("WebRTC: Joining existing mesh:", data);            
            PlaySFX(SFX.voiceEntry);
            data.forEach(user => {
                if(user !== myUsername) CreatePeer(user, true); // I am the new one, I initiate
            });
            break;

        case 'user_joined_voice':
            // A new user joined, I wait for their offer, but I prep state if needed
            console.log(`WebRTC: User ${data} joined voice.`);
            PlaySFX(SFX.voiceEntry);
            // Note: We don't create peer here immediately, the initiator (newcomer) will send offer.
            // But we can create it upon receiving offer.
            break;

        case 'voice_offer':
            (async () => {
                console.log(`WebRTC: Got Offer from ${data.senderId}`);
                const pc = CreatePeer(data.senderId, false); // Passive
                await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                WS_SEND("voice_answer", { targetId: data.senderId, sdp: answer });
            })();
            break;

        case 'voice_answer':
            (async () => {
                console.log(`WebRTC: Got Answer from ${data.senderId}`);
                const pc = peers[data.senderId];
                if (pc) await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
            })();
            break;

        case 'voice_ice':
            (async () => {
                const pc = peers[data.senderId];
                if (pc && data.candidate) {
                    try { await pc.addIceCandidate(new RTCIceCandidate(data.candidate)); } 
                    catch (e) { console.error("ICE Error", e); }
                }
            })();
            break;

        case 'voice_user_left':
            console.log(`WebRTC: User ${data.id} left voice.`);
            if (peers[data.id]) {
                peers[data.id].close();
                delete peers[data.id];
            }
            // Remove audio element
            const audioEl = document.getElementById(`audio_${data.id}`);
            if (audioEl) audioEl.remove();
            break;
    }
}

// Helper function to extract cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return "";
}


/* ==========================================
   INTERNAL LOGIC & EVENT LISTENERS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Play/Pause Toggle Logic
    playPauseBtn.addEventListener('click', () => {
        if (!isControlsInteractive) return;
        if (video.paused) OnPlayClick(); 
        else OnPauseClick(); 
    });

    video.addEventListener('play', () => {
        isPlaying = true;
        updatePlayPauseIcon();
    });
    
    video.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayPauseIcon();
    });

    // 2. Chat Toggle
    const chatBtn = document.getElementById('chat-btn');
    chatBtn.addEventListener('click', () => {
        if (isChatOpen) OnChatClose();
        else OnChatOpen();
    });
    document.getElementById('close-chat-btn').addEventListener('click', OnChatClose);

    // 3. Chat Input Logic
    const chatInput = document.getElementById('chat-input-field');
    const chatSendBtn = document.getElementById('chat-send-btn');

    const handleSendMessage = () => {
        const text = chatInput.value.trim();
        if (text) {
            chatInput.value = ''; // Clear input
            
            // Send logic via WebSocket would go here:
            // WS_SEND("chat_message", text);
            //console.log("Sending chat:", text);
            
            OnChatMessageSendClick(text);

            // For UI feedback immediately:
            // In a real app, you might wait for server echo
            // AddChatMessageText(text, "Me", true);
        }
    };

    chatSendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    // 4. Audio/Sub Modal
    const modal = document.getElementById('track-modal');
    const audioSubBtn = document.getElementById('audio-sub-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');

    audioSubBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', closeModal);

    // 5. Settings
    document.getElementById('theater-settings-btn').addEventListener('click', OnTheaterSettingsClick);

    // 6. Fullscreen
    document.getElementById('fullscreen-btn').addEventListener('click', ToggleFullscreen);

    // 7. Controls Fade / Idle Logic
    const resetIdleTimer = () => {
        controlsLayer.classList.remove('idle');
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            if (isPlaying && !modal.classList.contains('hidden') === false) { 
                controlsLayer.classList.add('idle');
            }
        }, 3000);
    };

    document.getElementById('player-container').addEventListener('mousemove', resetIdleTimer);
    document.getElementById('player-container').addEventListener('click', resetIdleTimer);
    resetIdleTimer();

    // 8. Timeline / Seek Logic
    let isDragging = false;
    
    video.addEventListener('timeupdate', () => {
        if (!isDragging) {
            const percent = (video.currentTime / video.duration) * 100;
            if (!isNaN(percent)) {
                timelineFill.style.width = `${percent}%`;
                timelineThumb.style.left = `${percent}%`;
                currentTimeEl.innerText = formatTime(video.currentTime);
                totalTimeEl.innerText = formatTime(video.duration);
            }
        }
    });

    const handleSeek = (e) => {
        if (!isControlsInteractive) return;
        const rect = timelineContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const clampedPercent = Math.max(0, Math.min(1, pos));
        
        timelineFill.style.width = `${clampedPercent * 100}%`;
        timelineThumb.style.left = `${clampedPercent * 100}%`;

        const seekToTime = clampedPercent * video.duration;
        OnSeek(seekToTime);
    };

    timelineContainer.addEventListener('mousedown', (e) => {
        if (!isControlsInteractive) return;
        isDragging = true;
        handleSeek(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            if (!isControlsInteractive) {
                isDragging = false;
                return;
            }
            handleSeek(e);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // 9. Buffering Detection
    video.addEventListener('waiting', () => ShowHideBuffer(true));
    video.addEventListener('playing', () => ShowHideBuffer(false));

    // 10. Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;

        switch(e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                if (isControlsInteractive) {
                   if (isPlaying) OnPauseClick();
                   else OnPlayClick();
                }
                resetIdleTimer();
                break;
            case 'c': 
                if (isChatOpen) OnChatClose();
                else OnChatOpen();
                break;
            case 'f': 
                ToggleFullscreen();
                break;
        }
    });

    // --- DEMO INITIALIZATION ---
    SetSubtitleListItems([
        { text: "Off", id: "none" },
        { text: "English", id: "en" },
        { text: "Spanish", id: "es" }
    ]);
    
    SetAudioTrackListItems([
        { text: "Original (AAC)", id: "aac" },
        { text: "Director Commentary", id: "comm" }
    ]);

    InitQuickReactions();

    // Demo Chat Message
    setTimeout(() => {
        AddChatMessageInfoText("Welcome to the theater room!");
    }, 1000);
});

// Helper: Format Time
function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

// Helper: Update UI Icon
function updatePlayPauseIcon() {
    if (isPlaying) {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }
}

function closeModal() {
    document.getElementById('track-modal').classList.add('hidden');
}

function ShowHideErrNoVideo(show){
    document.getElementById("error-no-video").style.display = show ? "flex" : "none";
}

function SetVideoControlButton(isHost){
    const btn = document.getElementById("control-mode-btn");
    btn.style.border = (isHost && isSelfHost) ? "1px solid yellow" : "1px solid white";
    btn.innerHTML = isHost ? "Video control: Host only⭐" : "Video control: Anyone";
}

function ShowHideControlsLayer(show){
    document.getElementById("controls-layer").style.display = show ? "flex" : "none";
}

function OnVideoControlModeSwitch(){
    if(isSelfHost){
        ToggleVideoControlMode();
    }else{
        alert("Only Host can change this")
    }
}

// -------------------------------------------------------------------
// INTEGRATION HELPER:
// The code below assumes you have a WebSocket onmessage listener elsewhere 
// that parses the JSON and calls logic.
// You must update that listener to call HandleVoiceSignal for voice actions.
//
// Example integration:
// ws.onmessage = (msg) => {
//     const { action, data } = JSON.parse(msg.data);
//     // ... existing logic ...
//     
//     // Add this:
//     if (['existing_voice_users', 'user_joined_voice', 'voice_offer', 'voice_answer', 'voice_ice', 'voice_user_left'].includes(action)) {
//         HandleVoiceSignal(action, data);
//     }
// }
// -------------------------------------------------------------------
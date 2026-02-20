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

const REACTION_EMOJIS = ["❤️", "😂", "🤬", "🙀", "🍿", "🔥"];

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

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let bubbleBuffer = null;

// 2. Load the file from /sfx/bubble.mp3 and save to memory
async function loadSFX() {
    try {
        const response = await fetch('/sfx/bubble.mp3');
        const arrayBuffer = await response.arrayBuffer();
        // Decode the audio data into a buffer we can reuse
        bubbleBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        console.log("Bubble SFX loaded to memory.");
    } catch (err) {
        console.error("Failed to load bubble SFX:", err);
    }
}

// 3. Play the sound and cleanup
function PlayBubbleSFX() {
    if (!bubbleBuffer) return;

    // Create a new temporary source instance
    const source = audioCtx.createBufferSource();
    source.buffer = bubbleBuffer;
    source.connect(audioCtx.destination);
    
    // Play immediately
    source.start(0);

    // Cleanup: Disconnect when finished to help Garbage Collection
    source.onended = () => {
        source.disconnect();
    };
}

// Initial load
loadSFX();

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
async function OnMicButtonClick(keypress_mode){
    console.log("OnMicButtonClick()");
    if(keypress_mode && !isVoiceConnected) return;
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
    if (index < 0 || index >= REACTION_EMOJIS.length) return;
    
    console.log(`API: Quick Reaction Clicked: ${REACTION_EMOJIS[index]}`);
    
    // In a real scenario, send this via WebSocket:
    // WS_SEND("quick_reaction", index);
    
    // For local visual feedback immediately:
    WS_SEND("quick_reaction", index);
}

function SpawnQuickReactionBubble(index) {
    if (index < 0 || index >= REACTION_EMOJIS.length) return;
    
    const emojiChar = REACTION_EMOJIS[index];
    
    // Create element
    const bubble = document.createElement('div');
    bubble.classList.add('reaction-bubble');
    bubble.innerText = emojiChar;

    PlayBubbleSFX();
    
    // Randomize horizontal float slightly
    const randomX = (Math.random() - 0.5) * 60; // +/- 30px
    bubble.style.setProperty('--rnd-x', `${randomX}px`);
    
    // Randomize start position slightly (Left relative to the visual layer)
    // We want it roughly above the button location. 
    // Since visual layer is 100% width, we approximate the left side.
    // Base 50px + random variation
    const startLeft = 40 + (Math.random() * 40) + Math.abs(Math.random()) * 300;
    bubble.style.left = `${startLeft}px`;

    // Vary animation speed slightly
    const duration = 1.5 + Math.random() * 1.0;
    bubble.style.animationDuration = `${duration}s`;

    reactionVisualLayer.appendChild(bubble);

    // Cleanup after animation
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
    REACTION_EMOJIS.forEach((emoji, index) => {
        const btn = document.createElement('button');
        btn.classList.add('reaction-btn');
        btn.innerText = emoji;
        btn.onclick = (e) => {
            // Stop propagation so we don't trigger play/pause or idle timer immediately
            e.stopPropagation(); 
            OnQuickReactionClick(index);
        };
        bar.appendChild(btn);
    });
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

// document.addEventListener('DOMContentLoaded', () => {

//     // 1. Play/Pause Toggle Logic
    
// });

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
    // Prevent shortcuts if user is typing in chat/input
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

        case 'arrowleft':
            e.preventDefault(); // Prevent page scroll
            if (isControlsInteractive && video.duration) {
                // Seek back 10 seconds, clamp to 0
                const newTime = Math.max(0, video.currentTime - 10);
                OnSeek(newTime);
                resetIdleTimer();
            }
            break;

        case 'arrowright':
            e.preventDefault(); // Prevent page scroll
            if (isControlsInteractive && video.duration) {
                // Seek forward 10 seconds, clamp to duration
                const newTime = Math.min(video.duration, video.currentTime + 10);
                OnSeek(newTime);
                resetIdleTimer();
            }
            break;

        case 'c': 
            if (isChatOpen) OnChatClose();
            else OnChatOpen();
            break;

        case 'f': 
            ToggleFullscreen();
            break;
        case 'm': 
            OnMicButtonClick(true);
            break;
        case '1': OnQuickReactionClick(0); break;
        case '2': OnQuickReactionClick(1); break;
        case '3': OnQuickReactionClick(2); break;
        case '4': OnQuickReactionClick(3); break;
        case '5': OnQuickReactionClick(4); break;
        case '6': OnQuickReactionClick(5); break;
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
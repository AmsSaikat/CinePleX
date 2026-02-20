/* ==========================================
   STATE VARIABLES
   ========================================== */
let currentUploadState = 0; // 0: None, 1: Uploading, 2: Processing, 3: Done
let selectedFileToUpload = null; // Stores the file object before uploading

function formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    let result = "";
    if (hours > 0) result += hours + "h ";
    if (minutes > 0 || hours === 0) result += minutes + "min";

    return result.trim();
}

/* ==========================================
   PUBLIC API FUNCTIONS
   ========================================== */

/**
 * Switch the Video Tab UI to specific state
 * @param {number} index - 0: Pre-upload, 1: Uploading, 2: Processing, 3: Uploaded
 */
function ShowUploadUI(index) {
    // Hide all main states
    for (let i = 0; i <= 3; i++) {
        const el = document.getElementById(`upload-state-${i}`);
        if(el) el.classList.add('hidden');
    }

    // Show target state
    const target = document.getElementById(`upload-state-${index}`);
    if(target) target.classList.remove('hidden');

    // Special Reset for State 0 (Go back to "Select File" view)
    if(index === 0) {
        document.getElementById('view-select-file').classList.remove('hidden');
        document.getElementById('view-file-ready').classList.add('hidden');
        selectedFileToUpload = null;
        document.getElementById('file-input').value = ""; // Reset input
    }

    currentUploadState = index;
    // console.log(`UI State changed to: ${index}`);
}

function PollProcessingState(vid){
    fetch("/processing-state?vid=" + vid).then(r=>r.text()).then(t=>{
        const percent = parseFloat(t) / 100.0;
        SetProcessingProgress(percent);
        if(percent != 1) setTimeout(()=>{PollProcessingState(vid)}, 100);
        else UpdateVideoState();
    });
}

/**
 * Helper: Get 'id' parameter from current URL
 */
function getTheaterIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'unknown'; // Default to 'unknown' if missing
}

/**
 * Triggered by the "Start Upload" button
 */
function OnUploadButtonClick() {
    console.log("API: Start Upload Clicked");
    
    if (!selectedFileToUpload) {
        alert("No file selected!");
        return;
    }

    const theaterId = getTheaterIdFromUrl();
    const fileName = selectedFileToUpload.name;
    const fileSize = selectedFileToUpload.size;

    // 1. Initiate Upload
    const initUrl = `/initiate-upload?id=${encodeURIComponent(theaterId)}&filename=${encodeURIComponent(fileName)}&filesize=${encodeURIComponent(fileSize)}`;

    console.log(`Initiating upload: ${initUrl}`);

    // Switch UI to Uploading state immediately (0%)
    ShowUploadUI(1);
    SetUploadProgress(0);

    fetch(initUrl)
        .then(response => {
            if (!response.ok) throw new Error("Initialization failed");
            return response.text(); // Expecting plain text video-id
        })
        .then(videoId => {
            console.log("Received Video ID:", videoId);
            startChunkedUpload(selectedFileToUpload, videoId.trim());
        })
        .catch(err => {
            console.error(err);
            alert("Error initiating upload. Please try again.");
            ShowUploadUI(0); // Reset on failure
        });
}

/**
 * Handles the 20-chunk parallel upload logic
 */
function startChunkedUpload(file, videoId) {
    const TOTAL_CHUNKS = 20;
    const chunkSize = Math.ceil(file.size / TOTAL_CHUNKS);
    
    // Array to track bytes uploaded for each chunk index (to calculate total %)
    let bytesUploadedPerChunk = new Array(TOTAL_CHUNKS).fill(0);
    let count = 0;
    
    const uploadPromises = [];

    for (let i = 0; i < TOTAL_CHUNKS; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        // Create a Promise for this specific chunk upload
        const chunkPromise = new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const uploadUrl = `/upload?byteIndex=${start}&video-id=${encodeURIComponent(videoId)}`;

            xhr.open("POST", uploadUrl, true);

            // Track progress for this specific chunk
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    // Update the global tracker array
                    bytesUploadedPerChunk[i] = e.loaded;
                    count += e.loaded;
                    console.log(count);
                    
                    // Calculate Total Progress across all chunks
                    const totalUploaded = bytesUploadedPerChunk.reduce((acc, val) => acc + val, 0);
                    const totalProgress = totalUploaded / file.size;
                    
                    SetUploadProgress(totalProgress);
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // Ensure this chunk counts as 100% done in our tracker
                    bytesUploadedPerChunk[i] = chunk.size; 
                    resolve();
                } else {
                    reject(`Chunk ${i} failed with status ${xhr.status}`);
                }
            };

            xhr.onerror = () => reject(`Network error on Chunk ${i}`);

            // Send binary data
            xhr.send(chunk);
        });

        uploadPromises.push(chunkPromise);
    }

    // Wait for all chunks to finish
    Promise.all(uploadPromises)
        .then(() => {
            console.log("All chunks uploaded successfully.");
            
            // 2. Upload Complete: Show Processing UI
            ShowUploadUI(2);
            PollProcessingState(videoId);
            
            // Note: Per instructions, we do nothing else here.
            // The UI stays in "Processing..." state indefinitely/until page reload
            // or if you implement a polling mechanism later.
        })
        .catch(err => {
            console.error("Upload failed:", err);
            alert("Upload failed. Please check console.");
            // Optional: reset UI or show error state
        });
}

/**
 * Set progress bar for uploading state
 * @param {number} val - 0.0 to 1.0
 */
function SetUploadProgress(val) {
    // Clamp value between 0 and 1
    if(val < 0) val = 0;
    if(val > 1) val = 1;

    const percent = Math.round(val * 100);
    const fill = document.getElementById('upload-progress-fill');
    const text = document.getElementById('upload-percent-text');
    
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.innerText = `${percent}%`;
}

/**
 * Set progress bar for processing state
 * @param {number} val - 0.0 to 1.0
 */
function SetProcessingProgress(val) {
    const percent = Math.round(val * 100);
    const fill = document.getElementById('process-progress-fill');
    const text = document.getElementById('process-percent-text');
    
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.innerText = `${percent}%`;
}

/**
 * Populate file info card
 */
function SetVideoFileInfo(filename, duration, resolution) {
    document.getElementById('file-name').innerText = filename;
    document.getElementById('file-duration').innerText = duration;
    document.getElementById('file-res').innerText = resolution;
}

/**
 * Hides the full screen loading gif
 */
function CloseLoadingUI() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

/**
 * Callback when trash icon is clicked
 */
function OnRemoveVideoClick() {
    if(confirm("Are you sure you want to remove this video?")) {
        const theater_id = new URLSearchParams(window.location.search).get("id");
        fetch("/remove-video?id=" + theater_id).then(r=>r.text()).then(t=>{
            ShowUploadUI(0);
        })

    }
}


/* ==========================================
   INTERNAL UI LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Tab Switching ---
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Basic Info: Save Button ---
    const saveBtn = document.getElementById('save-changes-btn');
    saveBtn.addEventListener('click', () => {
        document.getElementById('loading-overlay').classList.remove('hidden');
        setTimeout(() => { CloseLoadingUI(); }, 2000);
    });

    // --- Video Tab: File Selection ---
    const selectBtn = document.getElementById('select-file-btn');
    const fileInput = document.getElementById('file-input');

    selectBtn.addEventListener('click', () => fileInput.click());

    // When file is selected from browser dialog
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            // 1. Store the file
            selectedFileToUpload = e.target.files[0];
            
            // 2. Update Ready UI Text
            const nameEl = document.getElementById('ready-file-name');
            if(nameEl) nameEl.innerText = selectedFileToUpload.name;

            // 3. Switch Internal Views (Hide Select, Show Ready)
            document.getElementById('view-select-file').classList.add('hidden');
            document.getElementById('view-file-ready').classList.remove('hidden');
        }
    });

    // --- Video Tab: Start Upload Button ---
    const startUploadBtn = document.getElementById('start-upload-btn');
    startUploadBtn.addEventListener('click', OnUploadButtonClick);

    // --- Video Tab: Cancel Selection Button ---
    const cancelSelBtn = document.getElementById('cancel-selection-btn');
    cancelSelBtn.addEventListener('click', () => {
        ShowUploadUI(0); // Resets state
    });

    // --- Video Tab: Remove Button (Trash Icon) ---
    const removeBtn = document.getElementById('remove-video-btn');
    removeBtn.addEventListener('click', OnRemoveVideoClick);
    
    UpdateVideoState();
});

function UpdateVideoState(){
    const theater_id = new URLSearchParams(window.location.search).get("id");
    fetch("/theater_info?uids=" + theater_id).then(r=>r.json()).then(j=>{
        const {banner, currently_playing, members, name, premier_time, roles, uid, videos, host, video_id, video_name, video_upload_done, video_processing_done, video_duration, video_resolution} = j["data"][0];
        //console.log(name);
        document.getElementById("theater-name").value = name;
        
        if(video_upload_done && !video_processing_done){
            ShowUploadUI(2);
            PollProcessingState(video_id);
        }
        
        if(video_upload_done && video_processing_done){
            ShowUploadUI(3);
            SetVideoFileInfo(video_name, formatSeconds(parseFloat(video_duration)), video_resolution);
        }

    })
}

// --- Browser Reload Protection ---
window.addEventListener('beforeunload', (e) => {
    if (currentUploadState === 1) {
        e.preventDefault();
        e.returnValue = '';
    }
});
/* ==========================================
   CALLBACK FUNCTION (Modify this)
   ========================================== */

function getCookie(name) {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
}

function OnJoinClick() {
    console.log("Action: User clicked 'Join Theater'");
    // Your logic here (e.g., API call to join, then redirect to dashboard)
    
    // UI Feedback example
    const btn = document.getElementById('join-btn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Joining...';
    btn.style.opacity = "0.7";
    
    const theater_id = new URLSearchParams(window.location.search).get("id");
    window.location.href = "/accept_invite?id=" + theater_id;
}


/* ==========================================
   API FUNCTION (Call this to load data)
   ========================================== */

/**
 * Sets the invitation details on the page.
 * @param {string} inviterUsername - Name of user who sent invite
 * @param {string} theaterName - Name of the theater
 * @param {string} theaterImageUrl - URL for background image
 */
function SetInvitationData(inviterUsername, theaterName, theaterImageUrl) {
    theaterImageUrl = "/theater_banner.jpg"
    // 1. Set Inviter Name
    const inviterEl = document.getElementById('inviter-name');
    if (inviterEl) inviterEl.textContent = inviterUsername;

    // 2. Set Theater Name (In text)
    // Note: The HTML structure relies on specific text flow, 
    // so we only update the name span inside the h1 if needed, 
    // but here we just update the inviter name and the card title.

    // 3. Set Theater Card Title
    const theaterTitleEl = document.getElementById('theater-name-display');
    if (theaterTitleEl) theaterTitleEl.textContent = theaterName;

    // 4. Set Background Image
    const cardEl = document.getElementById('theater-card');
    if (cardEl) {
        cardEl.style.backgroundImage = `url('${theaterImageUrl}')`;
    }
}


/* ==========================================
   INTERNAL LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Wire up button
    const joinBtn = document.getElementById('join-btn');
    if(joinBtn) {
        joinBtn.addEventListener('click', OnJoinClick);
    }

    /* 
       DEMO DATA INITIALIZATION
       Remove this block when integrating with real backend/URL parameters 
    */
    
    // Simulating data arrival
    const theater_id = new URLSearchParams(window.location.search).get("id");
    const username = getCookie("username");
    
    if(!theater_id | theater_id == "") ShowNoInvite();
    else fetch("/theater_info?uids=" + theater_id).then(r=>r.json()).then(j=>{
        const data = j["data"];
        console.log(data);
        if(data.length == 0){
            ShowNoInvite();
        }else{
            const {banner, currently_playing, members, name, premier_time, roles, uid, videos, host} = data[0];
            if(members.includes(username)){
                ShowAlready();
                return;
            }
            ShowNormal();
            SetInvitationData(
                host, 
                name, 
                banner
            );
        }
    })
});

function ShowNoInvite(){
    [...document.getElementsByClassName("class-no-theater")].forEach(ele=>ele.style.display="block");
    [...document.getElementsByClassName("class-loading")].forEach(ele=>ele.style.display="none");
    [...document.getElementsByClassName("class-normal")].forEach(ele=>ele.style.display="none");
    [...document.getElementsByClassName("class-already")].forEach(ele=>ele.style.display="none");
}

function ShowNormal(){
    [...document.getElementsByClassName("class-no-theater")].forEach(ele=>ele.style.display="none");
    [...document.getElementsByClassName("class-loading")].forEach(ele=>ele.style.display="none");
    [...document.getElementsByClassName("class-normal")].forEach(ele=>ele.style.display="block");
    [...document.getElementsByClassName("class-already")].forEach(ele=>ele.style.display="none");
}

function ShowLoading(){
    [...document.getElementsByClassName("class-no-theater")].forEach(ele=>ele.style.display="none");
    [...document.getElementsByClassName("class-loading")].forEach(ele=>ele.style.display="block");
    [...document.getElementsByClassName("class-normal")].forEach(ele=>ele.style.display="none");
    [...document.getElementsByClassName("class-already")].forEach(ele=>ele.style.display="none");
}

function ShowAlready(){
    [...document.getElementsByClassName("class-no-theater")].forEach(ele=>ele.style.display="none");
    [...document.getElementsByClassName("class-loading")].forEach(ele=>ele.style.display="none");
    [...document.getElementsByClassName("class-normal")].forEach(ele=>ele.style.display="none");
    [...document.getElementsByClassName("class-already")].forEach(ele=>ele.style.display="block");
}
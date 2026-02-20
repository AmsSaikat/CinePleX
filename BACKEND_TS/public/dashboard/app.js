/* ==========================================
   CALLBACK FUNCTIONS (Modify these)
   ========================================== */

function OnThreeDotClick(id) {
    console.log(`Callback: Three dots clicked for Card ID: ${id}`);
    CopyTheaterLink(id);
}

function OnCardClick(id) {
    console.log(`Callback: Main card clicked for Card ID: ${id}`);
    window.location.href = "/theater?id=" + id;
}

function OnCreateCardClick() {
    let theater_name = prompt("Enter name for the Theater");
    if(theater_name && theater_name.length > 0){
        console.log({theater_name : theater_name.length});
        SetLoadingState(true);
        fetch("/create_theater?name=" + theater_name).then(r=>{
            if(r.status != 200){
                alert("Something went wrong!");
                return;
            }
            r.json().then(j=>{
                window.location.reload();
            })
        });
    }
}

function OnLogoutClick() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
}

function OnTabChange(tab_index) {
    console.log(`Callback: Tab changed to index: ${tab_index}`);
    // Your logic here (e.g., load specific data for this tab)
}


/* ==========================================
   API FUNCTIONS (Call these from your code)
   ========================================== */

/**
 * Adds a theater card to the UI.
 * @param {string} id - Unique ID for the theater card
 * @param {string} title - Main title of the theater
 * @param {string} subtitle - Subtitle text
 * @param {string} banner_img - URL for background image
 * @param {string} [type='my'] - Optional: 'my' for My Theaters, 'joined' for Joined Theaters
 */
function AddCard(id, title, subtitle, banner_img, type = 'my') {
    banner_img = "/theater_banner.jpg"
    // 1. Determine Container
    const containerId = type === 'joined' ? 'joined-theaters-list' : 'my-theaters-list';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error("Container not found for type:", type);
        return;
    }

    // 2. Create Card Element
    const card = document.createElement('div');
    card.className = 'theater-card';
    card.id = `card-${id}`;
    card.style.backgroundImage = `url('${banner_img}')`;

    // 3. Create Inner HTML Structure
    // Note: We attach onclick handlers directly to use our logic below
    card.innerHTML = `
        <div class="card-overlay"></div>
        <div class="card-menu" id="menu-${id}">
            <i class="fa-solid fa-link"></i>
        </div>
        <div class="card-info">
            <h3>${title}</h3>
        </div>
    `;
    //            <p>${subtitle}</p>

    // 4. Append to container
    container.appendChild(card);

    // 5. Attach Event Listeners
    
    // 3-dot menu click
    const menuBtn = card.querySelector(`#menu-${id}`);
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop bubbling so CardClick doesn't trigger
        OnThreeDotClick(id);
    });

    // Main card click
    card.addEventListener('click', () => {
        OnCardClick(id);
    });
}

/**
 * Removes a card by ID.
 * @param {string} id - The unique ID used when adding the card
 */
function RemoveCard(id) {
    const card = document.getElementById(`card-${id}`);
    if (card) {
        card.remove();
        console.log(`Removed card: ${id}`);
    } else {
        console.warn(`Card with ID ${id} not found.`);
    }
}

/**
 * Sets the account display name in top bar.
 * @param {string} name 
 */
function SetAccountName(name) {
    const el = document.getElementById('user-name');
    if (el) el.innerText = name;
}

function CopyTheaterLink(id){
    const url = window.location.origin + "/invite?id=" + id;
    navigator.clipboard.writeText(url);
    alert("Invitation link has been copied");
}

/**
 * Sets the account profile picture.
 * @param {string} img_src 
 */
function SetAccountDP(img_src) {
    const el = document.getElementById('user-dp');
    if (el) el.src = img_src;
}


/* ==========================================
   INTERNAL APP LOGIC (Wiring)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Tab Switching Logic ---
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // UI Toggle
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            // Trigger Callback
            const index = parseInt(tab.getAttribute('data-index'));
            OnTabChange(index);
        });
    });

    // --- Static Button Wiring ---
    
    // Create Button
    const createBtn = document.getElementById('create-btn');
    if(createBtn) {
        createBtn.addEventListener('click', OnCreateCardClick);
    }

    // Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', OnLogoutClick);
    }


    /* ========================================================
       DEMONSTRATION (Remove this block in production)
       This just populates the UI so you can see it working.
       ======================================================== */
    
    
});
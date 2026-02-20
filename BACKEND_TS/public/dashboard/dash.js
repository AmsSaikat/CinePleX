function SetLoadingState(doLoad){
    document.getElementById("loading").style.display = doLoad ? "flex" : "none";
}

function getCookie(name) {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
}

SetLoadingState(true);

fetch("/self_profile").then(r=>r.json()).then(j=>{
    console.log(j);
    const {name, theaters, joined} = j;
    const username = getCookie("username");
    const all_theaters = [...theaters, ...joined];
    SetAccountName(username);

    if(all_theaters.length == 0){
        SetLoadingState(false);
        return;
    }
    fetch("/theater_info?uids=" + all_theaters.join(",")).then(r=>r.json()).then(j=>{
        const data = j.data;
        console.log(data);
        data.forEach(({banner, currently_playing, members, name, premier_time, roles, uid, videos}) => {
            AddCard(uid, name, "---", banner, (theaters.includes(uid) ? "my" : "joined"));
            SetLoadingState(false);
        });
    })
});

// SetAccountName("Jane Architect");
// SetAccountDP("https://ui-avatars.com/api/?name=Jane+Doe&background=bb86fc&color=fff");

// // Adding "My Theaters"
// AddCard("t1", "Grand Rex", "Admin • 4 Screens", "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000", "my");
// AddCard("t2", "Starlight Cinema", "Owner • Main Hall", "https://images.unsplash.com/photo-1517604931442-710536443c15?q=80&w=1000", "my");

// // Adding "Joined Theaters"
// AddCard("t3", "Downtown IMAX", "Staff • 2 Screens", "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1000", "joined");
// AddCard("t4", "The Odeon", "Guest • Private Room", "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=1000", "joined");

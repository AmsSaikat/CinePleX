document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Auth Logic ---
    CheckAuthStatus();

    // --- 2. Interactive Effects ---
    InitParallax();
    InitScrollAnimations();
});

/**
 * Checks for login cookies and updates UI (Buttons/Links)
 */
function CheckAuthStatus() {
    const isLoggedIn = checkCookie("username"); 

    const navBtn = document.getElementById("nav-cta-btn");
    const heroBtn = document.getElementById("hero-main-btn");
    const heroBtnText = heroBtn.querySelector(".btn-text");

    if (isLoggedIn) {
        // User is logged in
        console.log("User logged in. Setting dashboard links.");
        
        // Update Nav Button
        navBtn.innerText = "Dashboard";
        navBtn.href = "/dashboard";
        navBtn.classList.add("primary");
        
        // Update Hero Button
        heroBtnText.innerText = "Go to Dashboard";
        heroBtn.onclick = () => window.location.href = "/dashboard";

    } else {
        // User is guest
        console.log("User is guest. Setting login links.");
        
        // Update Nav Button
        navBtn.innerText = "Log In";
        navBtn.href = "/login";
        navBtn.classList.remove("primary"); // Keep it subtle in nav
        navBtn.classList.add("secondary");

        // Update Hero Button
        heroBtnText.innerText = "Get Started";
        heroBtn.onclick = () => window.location.href = "/login";
    }
}

/**
 * Helper to retrieve cookie by name
 */
function checkCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
}

/**
 * Mouse parallax effect for the visual container in hero section
 */
function InitParallax() {
    const container = document.querySelector('.hero-section');
    const visual = document.querySelector('.visual-container');

    if(!container || !visual) return;

    container.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        // Subtle rotation based on mouse position
        // Initial state is roughly rotateY(-15deg) rotateX(10deg)
        // We add the mouse offset to that
        visual.style.transform = `rotateY(${-15 + x}deg) rotateX(${10 + y}deg)`;
    });

    // Reset on mouse leave
    container.addEventListener('mouseleave', () => {
        visual.style.transform = `rotateY(-15deg) rotateX(10deg)`;
    });
}

/**
 * Intersection Observer for scroll animations (Features fading in)
 */
function InitScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-on-scroll');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));
}
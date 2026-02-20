/* ==========================================
   CALLBACK FUNCTION (Modify this)
   ========================================== */

/**
 * Triggered when validation passes and button is clicked.
 * @param {string} username 
 * @param {string} password 
 */
function OnLoginSignupClick(username, password) {
    const form = document.getElementById("login-form");
    form.submit();
}


/* ==========================================
   UI LOGIC & VALIDATION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('error-msg');

    // Helper: Show/Hide Error
    const showError = (msg) => {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
        // Shake animation effect on card
        const card = document.querySelector('.login-card');
        card.style.animation = 'shake 0.4s ease';
        setTimeout(() => card.style.animation = '', 400);
    };

    const clearError = () => {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    };

    const err = new URLSearchParams(window.location.search).get("error");
    const err_ele_top = document.getElementById("error-msg-top")
    err_ele_top.innerHTML = err;
    err_ele_top.style.display = err ? "block" : "none";

    // Helper: Validation Logic
    const validateAndSubmit = () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value; // Don't trim password, spaces might be intentional

        clearError();

        // 1. Validate Username
        if (!username) {
            showError("Username is required.");
            return;
        }

        // Regex: Letters (small/big), numbers, underscore, dot, hyphen
        const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
        if (!usernameRegex.test(username)) {
            showError("Username can only contain letters, numbers, _, . and -");
            return;
        }

        // 2. Validate Password
        if (!password) {
            showError("Password is required.");
            return;
        }

        // 3. Success -> Call Callback
        OnLoginSignupClick(username, password);
    };

    // Event Listener: Click
    loginBtn.addEventListener('click', validateAndSubmit);

    // Event Listener: Enter Key on Inputs
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validateAndSubmit();
    });
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validateAndSubmit();
    });

    // Clear error when user starts typing again
    usernameInput.addEventListener('input', clearError);
    passwordInput.addEventListener('input', clearError);

});

// Add shake animation style dynamically
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}`;
document.head.appendChild(styleSheet);
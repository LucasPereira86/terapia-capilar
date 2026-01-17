/**
 * Adriele Tratamento Capilar
 * Authentication System
 */

// Configuration
const AUTH_CONFIG = {
    username: 'Adriele',
    password: 'capilar',
    sessionKey: 'adriele_session',
    userKey: 'adriele_user'
};

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem(AUTH_CONFIG.sessionKey) === 'true';
}

// Get current user
function getCurrentUser() {
    return localStorage.getItem(AUTH_CONFIG.userKey) || 'Usuário';
}

// Login function
function login(username, password) {
    return new Promise((resolve, reject) => {
        // Simulate network delay for better UX
        setTimeout(() => {
            if (username === AUTH_CONFIG.username && password === AUTH_CONFIG.password) {
                localStorage.setItem(AUTH_CONFIG.sessionKey, 'true');
                localStorage.setItem(AUTH_CONFIG.userKey, username);
                resolve({ success: true, user: username });
            } else {
                reject({ success: false, message: 'Credenciais inválidas' });
            }
        }, 800);
    });
}

// Logout function
function logout() {
    localStorage.removeItem(AUTH_CONFIG.sessionKey);
    localStorage.removeItem(AUTH_CONFIG.userKey);
    window.location.href = 'index.html';
}

// Protect page - redirect to login if not authenticated
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Redirect to dashboard if already logged in
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }
}

// Initialize login page
function initLoginPage() {
    // Redirect if already logged in
    redirectIfLoggedIn();

    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const loginError = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginSpinner = document.getElementById('loginSpinner');

    if (!form) return;

    // Clear errors on input
    usernameInput.addEventListener('input', () => {
        usernameInput.classList.remove('error');
        usernameError.classList.remove('show');
        loginError.classList.remove('show');
    });

    passwordInput.addEventListener('input', () => {
        passwordInput.classList.remove('error');
        passwordError.classList.remove('show');
        loginError.classList.remove('show');
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Validate
        let isValid = true;

        if (!username) {
            usernameInput.classList.add('error');
            usernameError.classList.add('show');
            isValid = false;
        }

        if (!password) {
            passwordInput.classList.add('error');
            passwordError.classList.add('show');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        loginBtn.disabled = true;
        loginBtnText.textContent = 'Entrando...';
        loginSpinner.classList.remove('hidden');

        try {
            await login(username, password);
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            // Show error
            loginError.classList.add('show');
            usernameInput.classList.add('error');
            passwordInput.classList.add('error');

            // Reset button
            loginBtn.disabled = false;
            loginBtnText.textContent = 'Entrar';
            loginSpinner.classList.add('hidden');

            // Focus username
            usernameInput.focus();
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the login page
    if (document.getElementById('loginForm')) {
        initLoginPage();
    }
});

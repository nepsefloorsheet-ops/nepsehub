/**
 * auth-service.js
 * Handles user authentication via Backend API (Proxy to Supabase)
 */

// API Base URL
const API_BASE = `${window.appConfig.api.baseUrl}/api/auth`;

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const togglePasswordBtn = document.querySelector('.toggle-password');

/**
 * Handle User Signup
 */
async function handleSignup(e) {
    e.preventDefault();
    console.log("Auth: Signup attempt started...");

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = signupForm.querySelector('button[type="submit"]');

    try {
        setLoading(submitBtn, true);
        
        const response = await fetch(`${API_BASE}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, full_name: name })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.detail || 'Signup failed');

        showMessage(signupForm, 'Registration successful! Please check your email for confirmation.', 'success');
        
    } catch (error) {
        showMessage(signupForm, error.message, 'error');
    } finally {
        setLoading(submitBtn, false);
    }
}

/**
 * Handle User Login
 */
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    try {
        setLoading(submitBtn, true);

        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.detail || 'Login failed');

        // Store Session Token
        if (data.session) {
            localStorage.setItem('sb-access-token', data.session.access_token);
            localStorage.setItem('sb-refresh-token', data.session.refresh_token);
            localStorage.setItem('sb-user', JSON.stringify(data.user));
        }

        console.log("Login successful:", data.user);
        
        // Redirect to dashboard
        window.location.href = '../index.html';

    } catch (error) {
        showMessage(loginForm, error.message, 'error');
    } finally {
        setLoading(submitBtn, false);
    }
}

/**
 * Helper: Show Feedback Message
 */
function showMessage(form, text, type) {
    const existing = form.querySelector('.auth-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = `auth-message ${type}`;
    msg.textContent = text;
    form.prepend(msg);
}

/**
 * Helper: Toggle Loading State
 */
function setLoading(btn, isLoading) {
    if (isLoading) {
        btn.disabled = true;
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.originalText;
    }
}

/**
 * Helper: Logout
 */
async function logout() {
    try {
        await fetch(`${API_BASE}/logout`, { method: 'POST' });
    } catch (e) {
        console.warn("Logout error", e);
    } finally {
        localStorage.removeItem('sb-access-token');
        localStorage.removeItem('sb-refresh-token');
        localStorage.removeItem('sb-user');
        window.location.href = window.location.origin + '/pages/login.html';
    }
}

// Event Listeners
if (loginForm) loginForm.addEventListener('submit', handleLogin);
if (signupForm) signupForm.addEventListener('submit', handleSignup);

if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
        const input = document.getElementById('password');
        const icon = togglePasswordBtn.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
}

// Check session on dashboard pages
async function checkAuthStatus() {
    const token = localStorage.getItem('sb-access-token');
    const userStr = localStorage.getItem('sb-user');
    
    if (!token || !userStr) return null;
    
    return { 
        access_token: token, 
        user: JSON.parse(userStr) 
    };
}

// Expose to window
window.authService = {
    logout,
    checkAuthStatus
};

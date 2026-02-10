/**
 * auth-service.js
 * Handles user authentication via Supabase
 */

// --- CONFIGURATION ---
// IMPORTANT: Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://ywdaixuumhbuecfsgsni.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3ZGFpeHV1bWhidWVjZnNnc25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxOTA4OTksImV4cCI6MjA4NTc2Njg5OX0.gVHa17vlDlvQ8Wz8hXf1Ctgcx2LZOUxC9EG52vreG5U';

// Initialize Supabase client with verification
let supabaseClient = null;
try {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        window.supabaseClient = supabaseClient; // Make it globally accessible
    } else {
        console.error("Auth: Supabase library not found on window. Check script tags in your HTML.");
    }
} catch (e) {
    console.error("Auth: Failed to initialize Supabase. Check your URL and Key consistency.", e);
}

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

    if (!supabaseClient) {
        showMessage(signupForm, "Authentication error: Connection to Supabase failed. Check your API settings.", "error");
        return;
    }

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = signupForm.querySelector('button[type="submit"]');

    try {
        setLoading(submitBtn, true);
        
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name }
            }
        });

        if (error) throw error;

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
    if (!supabaseClient) return alert("Supabase not initialized. Check your credentials.");

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked;
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    try {
        setLoading(submitBtn, true);

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Save session locally if needed (Supabase handles this automatically in LocalStorage)
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
    // Remove existing messages
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
    if (!supabaseClient) {
        // Fallback for missing client
        localStorage.clear(); 
        window.location.href = window.location.origin + '/pages/login.html';
        return;
    }
    const { error } = await supabaseClient.auth.signOut();
    
    // Use origin to ensure we go to the correct absolute path
    const loginPath = window.location.origin + '/pages/login.html';
    window.location.href = loginPath;
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
    if (!supabaseClient) return;
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}

// Expose to window
window.authService = {
    logout,
    checkAuthStatus
};

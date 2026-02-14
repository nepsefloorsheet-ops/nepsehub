/**
 * auth-guard.js
 * Include this at the TOP of any protected page's <head>
 */

(function() {
    const STORAGE_KEY = 'supabase.auth.token'; // Standard Supabase storage key
    
    // Quick check: Does a session exist in LocalStorage?
    // Quick check: Does a session exist in LocalStorage?
    // We now use 'sb-access-token' set by auth-service.js
    const session = localStorage.getItem('sb-access-token'); 

    // List of pages that are PUBLIC (anyone can see)
    const publicPages = ['login.html', 'signup.html', 'index.html', 'features.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // If NOT on a public page and NO session found, redirect to login
    if (!publicPages.includes(currentPage) && !session) {
        console.warn("Auth Guard: No session found. Redirecting to login...");
        window.location.href = window.location.origin + '/pages/login.html';
    }
})();

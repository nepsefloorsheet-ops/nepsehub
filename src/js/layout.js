const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' || window.location.protocol === 'file:';
const currentPath = window.location.pathname.toLowerCase();
const isSubPage = currentPath.includes('/pages/') || (currentPath !== '/' && currentPath !== '/index.html' && !currentPath.endsWith('/'));

// In clean URLs, everything is relative to root. In local, we might need '../'
const basePath = (isLocal && (currentPath.includes('/pages/') || isSubPage)) ? '../' : '';

fetch(basePath + "src/layout.html")
    .then(res => res.text())
    .then(html => {
        const layoutEl = document.getElementById("layout");
        layoutEl.innerHTML = html;

        // 🔹 Add Mobile Overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        layoutEl.appendChild(overlay);

        // 🔹 Path fixing & Local development compatibility
        document.querySelectorAll("#layout a").forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/')) {
                if (isLocal) {
                    // Convert clean URL back to local file path for dev
                    let newHref = href.substring(1); // remove leading slash
                    if (newHref === '') newHref = 'index.html';
                    else if (!newHref.endsWith('.html')) {
                       // Check if it's already a full path or needs mapping
                       if (!newHref.includes('pages/')) {
                           newHref = 'pages/' + newHref + '.html';
                       } else {
                           newHref = newHref + '.html';
                       }
                    }
                    
                    // If we are in a subpage (e.g. inside /pages/), we need to go up one level first
                    // BUT basePath handles the '../' prefix. 
                    // The issue is if basePath is '../', and we want to go to 'pages/portfolio.html', 
                    // the result is '../pages/portfolio.html' which is correct from inside /pages/.
                    // However, if we want to go to index.html, '../index.html' is correct.
                    
                    link.setAttribute('href', basePath + newHref);
                }
                // In production, keep "/" root-relative as defined in layout.html
            }
        });

        // 🔹 Dynamic header title
        const h1 = document.getElementById("page-title");
        if (h1) h1.textContent = document.title;

        // 🔹 Active link detection
        document.querySelectorAll("aside a").forEach(link => {
            try {
                const linkUrl = new URL(link.href, window.location.origin);
                const linkPath = linkUrl.pathname.toLowerCase();
                
                const normalize = (path) => {
                    return path
                        .replace(/^\/pages\//, "/") // Treat /pages/x as /x
                        .replace(/\.html$/, "")     // Remove extension
                        .replace(/\/index$/, "/")   // Remove index
                        .replace(/\/$/, "")         // Remove trailing slash
                        || "/";                     // Root
                };

                if (normalize(currentPath) === normalize(linkPath)) {
                    link.classList.add("active");
                }
            } catch (e) {}
        });

        // 🔹 Inject Mobile Header Burger
        const header = document.querySelector('header .header-items') || document.querySelector('header');
        if (header && !document.querySelector('.mobile-burger-btn')) {
            const mobileBtn = document.createElement('button');
            mobileBtn.className = 'mobile-burger-btn';
            mobileBtn.innerHTML = '<span></span><span></span><span></span>';
            mobileBtn.setAttribute('aria-label', 'Toggle Mobile Menu');
            header.prepend(mobileBtn); 
        }

        // 🔹 Navigation Toggle Logic (Burger Menu)
        const btn = document.querySelector('.btn');
        const sidebar = document.querySelector('.sidebar');
        const main = document.querySelector('main');

        if (sidebar && main) {
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (isCollapsed) {
                sidebar.classList.remove('active');
                sidebar.classList.add('inactive');
                main.classList.remove('active');
                main.classList.add('inactive');
            }
        }

        if (btn && sidebar && main) {
            const sidebarOverlay = document.querySelector('.sidebar-overlay');
            const mobileBurger = document.querySelector('.mobile-burger-btn');

            const toggleSidebar = () => {
                const nowActive = sidebar.classList.contains('active');
                const isMobile = window.innerWidth <= 1024;

                if (nowActive) {
                    sidebar.classList.replace('active', 'inactive');
                    main.classList.replace('active', 'inactive');
                    if (isMobile && sidebarOverlay) sidebarOverlay.classList.remove('active');
                    if (isMobile && mobileBurger) mobileBurger.classList.remove('active');
                    localStorage.setItem('sidebarCollapsed', 'true');
                } else {
                    sidebar.classList.replace('inactive', 'active');
                    main.classList.replace('inactive', 'active');
                    if (isMobile && sidebarOverlay) sidebarOverlay.classList.add('active');
                    if (isMobile && mobileBurger) mobileBurger.classList.add('active');
                    localStorage.setItem('sidebarCollapsed', 'false');
                }
            };

            btn.addEventListener('click', toggleSidebar);
            if (mobileBurger) mobileBurger.addEventListener('click', toggleSidebar);
            if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

            // 🔹 Auto-close on mobile selection
            sidebar.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 1024 && !link.classList.contains('dropdown-toggle')) {
                        toggleSidebar();
                    }
                });
            });
        }

        // 🔹 AUTH SIDEBAR LOGIC
        const authLoggedOut = document.getElementById('auth-logged-out');
        const authLoggedIn = document.getElementById('auth-logged-in');
        const userDisplayName = document.getElementById('user-display-name');
        const userAvatar = document.querySelector('.user-avatar');

        async function initSidebarAuth() {
            const sessionStr = localStorage.getItem('sb-ywdaixuumhbuecfsgsni-auth-token');
            if (sessionStr) {
                try {
                    const session = JSON.parse(sessionStr);
                    const user = session.user;
                    if (user) {
                        if (authLoggedOut) authLoggedOut.style.display = 'none';
                        if (authLoggedIn) authLoggedIn.style.display = 'block';
                        const fullName = user.user_metadata?.full_name || user.email.split('@')[0];
                        if (userDisplayName) userDisplayName.textContent = fullName;
                        if (userAvatar) userAvatar.textContent = fullName.charAt(0).toUpperCase();
                    }
                } catch (e) {
                    console.error("Auth: Error parsing sidebar session", e);
                }
            }
        }
        initSidebarAuth();
    });

// Create and inject CSS for initial styling
const style = document.createElement('style');
style.textContent = `
    .datetime-loading {
        visibility: initial;
    }
    .datetime-loaded {
        visibility: visible;
        animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Function to update time
function updateDateTime() {
    const now = new Date();

    let datetimeInterval = null;

    window.addEventListener('load', function () {
        updateDisplay();
        datetimeInterval = setInterval(updateDisplay, 1000);
    });

    // Then in the beforeunload event:
    if (datetimeInterval) clearInterval(datetimeInterval);

    // Format date
    const day = String(now.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    // Format time
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, '0');

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = weekdays[now.getDay()];

    return {
        date: `${day} ${month}, ${year}`,
        weekday: weekday,
        time: `${hours}:${minutes}:${seconds} ${ampm}`
    };
}

// Function to update display
function updateDisplay() {
    const dateTime = updateDateTime();

    // Update elements with fade effect
    const elements = {
        'currentDate': dateTime.date,
        'currentTime': dateTime.time
    };

    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            element.classList.remove('datetime-loading');
            element.classList.add('datetime-loaded');
        }
    }
}

// Initialize immediately
window.addEventListener('load', function () {
    // Update immediately
    updateDisplay();

    // Set interval for updates
    setInterval(updateDisplay, 1000);

    // Remove loading state from body
    document.body.classList.remove('datetime-loading');
});

// Fallback: Update immediately if DOM is already ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    updateDisplay();
    setInterval(updateDisplay, 1000);
}

// HEADER METRICS MANAGER (NEPSE, Turnover, Volume)
const HeaderManager = (() => {
    let intervalId = null;

    function formatNumber(num) {
        if (num === undefined || num === null || isNaN(num) || num === 0) {
            // Keep existing text if we get a 0 or invalid during a refresh 
            // unless it's the very first load
            return null; 
        }
        return Number(num).toLocaleString("en-IN");
    }

    function updateElements(data) {
        if (!data) return;

        // 1. Update Turnover and Volume
        const turnoverEl = document.querySelector(".turnover");
        const volumeEl = document.querySelector(".volume");

        // Try to find turnover/volume in different structures
        const turnover = data.totalTurnover?.totalTradedValue || data.stockSummary?.turnover || data.turnover;
        const volume = data.totalTurnover?.totalTradedQuantity || data.stockSummary?.volume || data.volume;

        if (turnoverEl && turnover) {
            turnoverEl.textContent = Number(turnover).toLocaleString("en-IN");
            turnoverEl.classList.remove('shimmer');
        }

        if (volumeEl && volume) {
            volumeEl.textContent = Number(volume).toLocaleString("en-IN");
            volumeEl.classList.remove('shimmer');
        }

        // 2. Update NEPSE Index
        updateNEPSEIndex(data);

        // 3. Trigger Pulse Dot
        triggerPulse();
    }

    function triggerPulse() {
        const pulse = document.getElementById('headerPulse');
        if (!pulse) return;
        
        // Toggle color based on market status
        if (isMarketOpenNow()) {
            pulse.classList.remove('market-closed');
        } else {
            pulse.classList.add('market-closed');
        }

        pulse.classList.remove('pulsing');
        void pulse.offsetWidth; // Trigger reflow
        pulse.classList.add('pulsing');
    }

    async function refresh() {
        try {
            const data = await apiService.getMarketTurnover();
            updateElements(data);
        } catch (err) {
            console.error("Header Refresh Error:", err);
        }
    }

    function start(interval = 5000) {
        if (intervalId) clearInterval(intervalId);
        refresh(); 
        intervalId = setInterval(refresh, interval);
    }

    function stop() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    return { start, stop, update: updateElements, refresh };
})();

// Initialize Global Header Update
document.addEventListener("DOMContentLoaded", () => {
    HeaderManager.start(1000);
});


// Theme switching
// Theme switching logic
document.addEventListener('DOMContentLoaded', () => {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const STORAGE_KEY = 'selectedTheme';

    // Read saved theme or fallback to dark
    const savedTheme = localStorage.getItem(STORAGE_KEY) || 'dark';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
        });

        localStorage.setItem(STORAGE_KEY, theme);
    }

    // Apply theme on load
    applyTheme(savedTheme);

    // Button click handlers
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            applyTheme(btn.getAttribute('data-theme'));
        });
    });
});


// END OF THEME SWITCHER

/* =========================================================
   NEPSE HEADER DATA FETCH & RENDER
   Uses apiService for routing
========================================================= */

/* -------------------------------
   Fetch NEPSE Homepage Data
-------------------------------- */
async function fetchNEPSEHeaderData() {
    try {
        if (!window.apiService) return;
        const data = await apiService.getMarketData();
        updateNEPSEIndex(data);
    } catch (error) {
        console.error("❌ NEPSE Header Fetch Failed:", error);
    }
}

/* -------------------------------
   Update NEPSE Index
-------------------------------- */
function updateNEPSEIndex(data) {
    const displayElement = document.getElementById("nepseData");
    if (!data || !displayElement) return;

    const nepseIndex = data?.indices?.find(
        i => i.symbol === "NEPSE" || i.name === "NEPSE"
    );

    if (!nepseIndex) return;

    const nepseData = {
        indexValue: nepseIndex.currentValue ?? 0,
        difference: nepseIndex.change ?? 0,
        percentChange: nepseIndex.changePercent ?? 0
    };

    displayIndexData(nepseData, displayElement);
}

/* -------------------------------
   Render Index Data
-------------------------------- */
function displayIndexData(indexData, displayElement) {
    if (!displayElement) return;

    const indexValue = indexData.indexValue ?? 0;
    const difference = indexData.difference ?? 0;
    const percentChange = indexData.percentChange ?? 0;

    const isPositive = difference >= 0;
    const changeClass = isPositive ? "positivee" : "negativee";

    // Apply color class
    displayElement.classList.remove("positivee", "negativee");
    displayElement.classList.add(changeClass);

    // Format values
    const formattedValue = Number(indexValue).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const formattedDifference = Math.abs(difference).toFixed(2);
    const formattedPercent = Math.abs(percentChange).toFixed(2);

    // DOM elements
    const valueEl = displayElement.querySelector(".index-value");
    const diffEl = displayElement.querySelector(".difference");
    const percentEl = displayElement.querySelector(".percent-ch");

    // Remove shimmer placeholders
    [valueEl, diffEl, percentEl].forEach(el => {
        if (!el) return;
        el.classList.remove("shimmer");
        el.style.width = "auto";
        el.style.height = "auto";
    });

    // Update text
    if (valueEl) valueEl.textContent = formattedValue;

    if (diffEl) {
        diffEl.textContent = `${isPositive ? "+" : "-"}${formattedDifference}`;
        diffEl.className = `difference ${changeClass}`;
    }

    if (percentEl) {
        percentEl.textContent = `(${isPositive ? "+" : "-"}${formattedPercent}%)`;
        percentEl.className = `percent-ch ${changeClass}`;
    }
}

/* -------------------------------
   Init on DOM Ready
-------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("nepseData")) {
        fetchNEPSEHeaderData();
    }
});

/* -------------------------------
   Optional: Auto Refresh
   (Enable only if needed)
-------------------------------- */
    setInterval(fetchNEPSEHeaderData, 30000);

/* -------------------------------
   Expose if needed globally
-------------------------------- */
window.updateNEPSEIndex = updateNEPSEIndex;


// ---------------------------------------------
const globalController = new AbortController();
// ---------------------------------------------------------
// 4. NEPSE Market Status Pill
// ---------------------------------------------------------
function getKathmanduTime() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 5.75 * 60 * 60000);
}

const HOLIDAYS = [
    "2026-01-15", "2026-01-19", "2026-01-30", "2026-02-15",
    "2026-02-18", "2026-02-19", "2026-03-02", "2026-03-08",
    "2026-03-18", "2026-03-27"
];

function getNepseMarketState() {
    const now = getKathmanduTime();
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const today = now.toISOString().split('T')[0];

    if (day === 5 || day === 6 || HOLIDAYS.includes(today)) {
        return { text: 'Holiday', class: 'pill-holiday' };
    }

    if (minutes >= 630 && minutes < 645) {
        return { text: 'Pre-Open', class: 'pill-preopen' };
    }

    if (minutes >= 645 && minutes < 660) {
        return { text: 'Matching', class: 'pill-matching' };
    }

    if (minutes >= 660 && minutes < 900) {
        return { text: 'Market Open', class: 'pill-open' };
    }

    return { text: 'Market Closed', class: 'pill-closed' };
}

function isMarketOpenNow() {
    const state = getNepseMarketState();
    return state.text === 'Market Open';
}

function updateMarketPill() {
    const pill = document.getElementById('market-status');
    if (!pill) return;

    const state = getNepseMarketState();
    pill.textContent = state.text;
    pill.className = `market-pill ${state.class}`;
}

function updateMarketStatusDisplay() {
    const statusElement = document.getElementById('market-status');
    if (!statusElement) return;
    
    const state = getNepseMarketState();
    statusElement.textContent = state.text;
    statusElement.className = `market-pill ${state.class}`;
    
    // Add ARIA label for screen readers
    statusElement.setAttribute('aria-label', `Market status: ${state.text}`);
    
    // Add title for tooltip
    statusElement.title = `Current market status: ${state.text}`;
    
    // Add live region for screen readers when status changes
    if (state.text !== statusElement.dataset.lastStatus) {
        statusElement.setAttribute('aria-live', 'polite');
        statusElement.dataset.lastStatus = state.text;
        
        // Announce only during important status changes
        if (state.text === 'Market Open' || state.text === 'Market Closed') {
            const announcement = document.createElement('div');
            announcement.className = 'sr-only';
            announcement.setAttribute('aria-live', 'assertive');
            announcement.textContent = `Market is now ${state.text}`;
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 1000);
        }
    }
}

// Update initialization
updateMarketStatusDisplay();
cleanupManager.setInterval(updateMarketPill, 60000);

updateMarketPill();
globalController.signal.addEventListener('abort', () =>
    clearInterval(marketPillInterval)
);

// ---------------------------------------------------------
// SMART REFRESH MANAGER
// Auto-pauses all data refreshes when market is closed
// ---------------------------------------------------------
const SmartRefreshManager = (() => {
    const intervals = new Map();
    let isMarketOpen = false;
    let checkInterval = null;

    function init() {
        updateMarketStatus();
        checkInterval = setInterval(updateMarketStatus, 60000); // Check every minute
    }

    function updateMarketStatus() {
        const wasOpen = isMarketOpen;
        isMarketOpen = checkIfMarketOpen();
        
        if (wasOpen !== isMarketOpen) {
            intervals.forEach((config, key) => {
                if (isMarketOpen) {
                    startInterval(key, config);
                } else {
                    pauseInterval(key);
                }
            });
        }
    }

    function checkIfMarketOpen() {
        const now = getKathmanduTime();
        const day = now.getDay();
        const minutes = now.getHours() * 60 + now.getMinutes();
        const today = now.toISOString().split('T')[0];

        const HOLIDAYS = [
            "2026-01-15", "2026-01-19", "2026-01-30", "2026-02-15",
            "2026-02-18", "2026-02-19", "2026-03-02", "2026-03-08",
            "2026-03-18", "2026-03-27"
        ];

        // Weekend or Holiday
        if (day === 5 || day === 6 || HOLIDAYS.includes(today)) {
            return false;
        }

        // Market hours: 11:00 AM - 3:00 PM (660 - 900 minutes)
        return minutes >= 660 && minutes < 900;
    }

    function startInterval(key, config) {
        if (config.intervalId) {
            clearInterval(config.intervalId);
        }
        config.intervalId = setInterval(config.callback, config.interval);
        config.isPaused = false;
        console.log(`  ✓ '${key}' started (${config.interval}ms)`);
    }

    function pauseInterval(key) {
        const config = intervals.get(key);
        if (config && config.intervalId) {
            clearInterval(config.intervalId);
            config.intervalId = null;
            config.isPaused = true;
            console.log(`  ⏸ '${key}' paused`);
        }
    }

    function register(key, callback, interval, runImmediately = true) {
        intervals.set(key, {
            callback,
            interval,
            intervalId: null,
            isPaused: false
        });

        // Always run immediately if requested, even if market is closed
        // This ensures data is visible on initial page load/refresh
        if (runImmediately) {
            console.log(`  ⚡ '${key}' performing initial fetch...`);
            callback();
        }

        if (isMarketOpen) {
            startInterval(key, intervals.get(key));
        } else {
            console.log(`  ⏸ '${key}' register complete. Auto-refresh paused (market closed)`);
        }
    }

    function unregister(key) {
        const config = intervals.get(key);
        if (config && config.intervalId) {
            clearInterval(config.intervalId);
        }
        intervals.delete(key);
        console.log(`  ✗ '${key}' unregistered`);
    }

    function trigger(key) {
        const config = intervals.get(key);
        if (config) {
            config.callback();
        }
    }

    function destroy() {
        if (checkInterval) {
            clearInterval(checkInterval);
        }
        intervals.forEach((config, key) => {
            if (config.intervalId) {
                clearInterval(config.intervalId);
            }
        });
        intervals.clear();
    }

    function getStatus() {
        return {
            isMarketOpen,
            registeredRefreshes: Array.from(intervals.keys()),
            activeRefreshes: Array.from(intervals.entries())
                .filter(([_, config]) => !config.isPaused)
                .map(([key, _]) => key)
        };
    }

    // Initialize on load
    init();

    return { register, unregister, trigger, destroy, getStatus };
})();

// Expose globally
window.smartRefresh = SmartRefreshManager;

// ---------------------------------------------------------
// GLOBAL AUTH HELPERS
// ---------------------------------------------------------
document.addEventListener('click', async (e) => {
    // Handle Sidebar Logout
    const logoutBtn = e.target.closest('#sidebar-logout-btn');
    if (logoutBtn) {
        e.preventDefault();
        console.log("Auth: Logout requested via Sidebar...");
        
        if (window.authService && window.authService.logout) {
            await window.authService.logout();
        } else {
            // Fallback: Manually clear Supabase tokens if authService isn't ready
            const projectRef = 'ywdaixuumhbuecfsgsni';
            localStorage.removeItem(`sb-${projectRef}-auth-token`);
            console.log("Auth: Manual token clearance performed.");
            window.location.reload();
        }
    }

    // Handle Sidebar Dropdowns
    const dropdownToggle = e.target.closest('.dropdown-toggle');
    if (dropdownToggle) {
        e.preventDefault();
        const parent = dropdownToggle.parentElement;
        const isActive = parent.classList.contains('active');
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        
        // Toggle current one
        if (!isActive) {
            parent.classList.add('active');
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    SmartRefreshManager.destroy();
});

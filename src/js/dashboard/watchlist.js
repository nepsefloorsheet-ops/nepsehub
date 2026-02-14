/**
 * watchlist.js
 * Handles data fetching, rendering, sorting, and D3 Heatmap for Multi-Watchlist sets
 */

const STORAGE_KEY = 'nepse_multi_watchlist_v1';
const DEFAULT_LIST_NAME = 'My Watchlist';

// Initial State Skeleton
const initialState = {
    activeList: DEFAULT_LIST_NAME,
    lists: {
        [DEFAULT_LIST_NAME]: []
    },
    currentView: 'table', 
    sort: {
        column: 'symbol',
        direction: 'asc' 
    }
};

// State
let watchlistState = JSON.parse(JSON.stringify(initialState));

let currentWatchlistData = []; 
let allStocks = []; // Cache for all available stocks
let updateInterval = null;

// DOM Elements
const inputEl = document.getElementById('symbol-input');
const addSymbolBtn = document.getElementById('add-btn');
const tableBody = document.getElementById('watchlist-body');
const tabsContainer = document.getElementById('watchlist-tabs-list');
const addListBtn = document.getElementById('add-list-btn');
const exportBtn = document.getElementById('export-csv-btn');
const heatmapGrid = document.getElementById('heatmap-grid');
const tableView = document.getElementById('table-view');
const heatmapView = document.getElementById('heatmap-view');
const viewTableBtn = document.getElementById('view-table-btn');
const viewHeatmapBtn = document.getElementById('view-heatmap-btn');
const autocompleteList = document.getElementById('autocomplete-list');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    registerEventListeners();
    refreshUI();
    
    // Auto-refresh using Smart Refresh if available, otherwise fallback to manual
    if (window.smartRefresh) {
        window.smartRefresh.register('watchlist-refresh', fetchAndRenderWatchlist, 60000, false);
        console.log('Watchlist: Using Smart Refresh (market-hours only)');
    } else {
        updateInterval = setInterval(fetchAndRenderWatchlist, 60000);
        console.log('Watchlist: Using manual refresh (always on)');
    }
});

function registerEventListeners() {
    addSymbolBtn.addEventListener('click', handleAddSymbol);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddSymbol();
    });

    addListBtn.addEventListener('click', handleAddNewList);

    if (exportBtn) {
        exportBtn.addEventListener('click', exportWatchlistToCSV);
    }

    viewTableBtn.addEventListener('click', () => switchView('table'));
    viewHeatmapBtn.addEventListener('click', () => switchView('heatmap'));

    document.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.dataset.sort;
            handleSort(column);
        });
    });

    // Autocomplete events
    inputEl.addEventListener('input', handleAutocompleteInput);
    document.addEventListener('click', (e) => {
        if (e.target !== inputEl && e.target !== autocompleteList) {
            hideAutocomplete();
        }
    });
}

/**
 * Save state to LocalStorage and Cloud
 * We save the entire state object to maintain consistency across sessions.
 */
async function saveState() {
    try {
        // Save to LocalStorage (Immediate feedback)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlistState));
        console.log("Watchlist: State saved to disk.");

        // Save to Supabase Cloud via Backend
        const token = localStorage.getItem('sb-access-token');
        const API_URL = window.appConfig?.api?.baseUrl || '';
        
        if (token) {
            fetch(`${API_URL}/api/watchlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(watchlistState)
            })
            .then(res => {
                if (res.ok) console.log("Watchlist: Cloud sync successful.");
                else console.warn("Watchlist: Cloud save failed", res.status);
            })
            .catch(e => console.error("Watchlist: Backend save error", e));
        }
    } catch (e) {
        console.error("Watchlist: Failed to save state", e);
    }
}

/**
 * Load state from LocalStorage and then Cloud refresh
 * Designed to be defensive and ensure a valid state object always exists.
 */
async function loadState() {
    try {
        // 1. Initial load from LocalStorage for speed
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (stored) {
            applyParsedState(JSON.parse(stored));
        }

        // 2. If logged in, fetch latest from Cloud
        const token = localStorage.getItem('sb-access-token');
        const API_URL = window.appConfig?.api?.baseUrl || '';

        if (token) {
            console.log("Watchlist: Fetching cloud data...");
            try {
                const res = await fetch(`${API_URL}/api/watchlist`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.watchlist_data) {
                        console.log("Watchlist: Cloud data found, updating local state.");
                        applyParsedState(data.watchlist_data);
                        // Update LocalStorage with fresh cloud data
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlistState));
                        refreshUI();
                    }
                }
            } catch (err) {
                console.warn("Watchlist: Backend fetch error", err);
            }
        }

        // Guarantees: Ensure at least one list exists
        if (!watchlistState.lists || Object.keys(watchlistState.lists).length === 0) {
            watchlistState.lists = { [DEFAULT_LIST_NAME]: [] };
        }
        // Guarantee: Active list must exist in lists
        if (!watchlistState.lists[watchlistState.activeList]) {
            watchlistState.activeList = Object.keys(watchlistState.lists)[0];
        }

        console.log("Watchlist: State ready. Symbols count:", watchlistState.lists[watchlistState.activeList]?.length || 0);
    } catch (e) {
        console.error('Watchlist: Critical state loading error', e);
    }
}

function applyParsedState(parsed) {
    if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed)) {
            watchlistState.lists = { [DEFAULT_LIST_NAME]: parsed };
        } else {
            if (parsed.lists) watchlistState.lists = parsed.lists;
            if (parsed.activeList) watchlistState.activeList = parsed.activeList;
            if (parsed.currentView) watchlistState.currentView = parsed.currentView;
            if (parsed.sort) watchlistState.sort = parsed.sort;
        }
    }
}

// Cross-Tab Synchronization and Unload Persistence
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        console.log("Watchlist: Live update from another tab.");
        loadState();
        refreshUI();
    }
});

// Extra safety: save when tab is hidden or closed
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveState();
});
window.addEventListener('beforeunload', saveState);

function refreshUI() {
    renderTabs();
    updateViewButtons();
    fetchAndRenderWatchlist();
}

/**
 * View Logic
 */
function switchView(view) {
    watchlistState.currentView = view;
    saveState();
    updateViewButtons();
    renderContent();
}

function updateViewButtons() {
    if (watchlistState.currentView === 'table') {
        viewTableBtn.classList.add('active');
        viewHeatmapBtn.classList.remove('active');
        tableView.style.display = 'block';
        heatmapView.style.display = 'none';
        // Clear SVG on switch
        if (heatmapGrid) heatmapGrid.innerHTML = '';
    } else {
        viewTableBtn.classList.remove('active');
        viewHeatmapBtn.classList.add('active');
        tableView.style.display = 'none';
        heatmapView.style.display = 'block';
        // Trigger render
        setTimeout(renderHeatmap, 50); 
    }
}

/**
 * Sorting Logic
 */
function handleSort(column) {
    if (watchlistState.sort.column === column) {
        watchlistState.sort.direction = watchlistState.sort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        watchlistState.sort.column = column;
        watchlistState.sort.direction = 'desc'; 
        if (column === 'symbol') watchlistState.sort.direction = 'asc';
    }
    
    saveState();
    applySortAndRender();
}

function applySortAndRender() {
    const { column, direction } = watchlistState.sort;
    
    currentWatchlistData.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
        if (valA === null) return 1;
        if (valB === null) return -1;
        if (column === 'symbol') {
            return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
            return direction === 'asc' ? valA - valB : valB - valA;
        }
    });

    renderContent();
}

/**
 * Render Content
 */
function renderContent() {
    updateSortIcons();
    if (watchlistState.currentView === 'table') {
        renderTable(currentWatchlistData);
    } else {
        renderHeatmap();
    }
}

function updateSortIcons() {
    document.querySelectorAll('th.sortable').forEach(th => {
        th.classList.remove('active');
        const icon = th.querySelector('i');
        icon.className = 'fas fa-sort';
        if (th.dataset.sort === watchlistState.sort.column) {
            th.classList.add('active');
            icon.className = watchlistState.sort.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        }
    });
}

function renderTabs() {
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';
    const listNames = Object.keys(watchlistState.lists);
    listNames.forEach(name => {
        const isActive = name === watchlistState.activeList;
        const tab = document.createElement('div');
        tab.className = `watchlist-tab ${isActive ? 'active' : ''}`;
        tab.innerHTML = `
            <span onclick="switchList('${name}')">${name}</span>
            ${listNames.length > 1 ? `<i class="fas fa-times delete-list-btn" onclick="deleteList('${name}')" title="Delete List"></i>` : ''}
        `;
        tabsContainer.appendChild(tab);
    });
}

window.switchList = (name) => {
    watchlistState.activeList = name;
    saveState();
    refreshUI();
};

function handleAddNewList() {
    const name = prompt("Enter Watchlist Name (e.g., Banking, Hydro):");
    if (!name || name.trim() === '') return;
    const trimmedName = name.trim();
    if (watchlistState.lists[trimmedName]) {
        alert("A list with this name already exists.");
        return;
    }
    watchlistState.lists[trimmedName] = [];
    watchlistState.activeList = trimmedName;
    saveState();
    refreshUI();
}

window.deleteList = (name) => {
    if (!confirm(`Are you sure you want to delete the watchlist "${name}"?`)) return;
    delete watchlistState.lists[name];
    if (watchlistState.activeList === name) {
        watchlistState.activeList = Object.keys(watchlistState.lists)[0];
    }
    saveState();
    refreshUI();
}

function handleAddSymbol() {
    const val = inputEl.value.trim().toUpperCase();
    if (!val) return;
    const currentList = watchlistState.lists[watchlistState.activeList];
    if (currentList.includes(val)) {
        alert('Symbol already in this watchlist');
        inputEl.value = '';
        return;
    }
    currentList.push(val);
    saveState();
    inputEl.value = '';
    fetchAndRenderWatchlist();
}

window.removeSymbol = (symbol) => {
    watchlistState.lists[watchlistState.activeList] = watchlistState.lists[watchlistState.activeList].filter(s => s !== symbol);
    saveState();
    fetchAndRenderWatchlist();
};

/**
 * Fetch Data
 */
async function fetchAndRenderWatchlist() {
    const activeSymbols = watchlistState.lists[watchlistState.activeList];
    if (!activeSymbols || activeSymbols.length === 0) {
        currentWatchlistData = [];
        renderContent();
        return;
    }

    try {
        if (!window.apiService) return;
        const response = await window.apiService.getLiveNepseData();
        const liveData = response.data || [];

        currentWatchlistData = activeSymbols.map(symbol => {
            const match = liveData.find(d => d.symbol && d.symbol.toUpperCase() === symbol);
            if (match) return match;
            return {
                symbol: symbol,
                lastTradedPrice: 0,
                previousClose: 0,
                change: 0,
                percentageChange: 0,
                highPrice: 0,
                lowPrice: 0,
                totalTradeQuantity: 0,
                missing: true
            };
        });

        applySortAndRender();
        
        // Cache all stocks for autocomplete if not already done
        if (allStocks.length === 0) {
            allStocks = liveData.map(s => ({
                symbol: s.symbol,
                name: s.securityName || s.symbol
            }));
        }
    } catch (error) {
        console.error("Error fetching watchlist data:", error);
    }
}

/**
 * Autocomplete Logic
 */
function handleAutocompleteInput() {
    const val = inputEl.value.trim().toUpperCase();
    if (!val || val.length < 1) {
        hideAutocomplete();
        return;
    }

    const matches = allStocks.filter(s => 
        (s.symbol && s.symbol.toUpperCase().includes(val)) || 
        (s.name && s.name.toUpperCase().includes(val))
    ).slice(0, 10); // Limit to 10 suggestions

    if (matches.length > 0) {
        renderAutocomplete(matches);
    } else {
        hideAutocomplete();
    }
}

function renderAutocomplete(matches) {
    if (!autocompleteList) return;
    autocompleteList.innerHTML = '';
    autocompleteList.style.display = 'block';

    matches.forEach(match => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.innerHTML = `
            <span class="symbol">${match.symbol}</span>
            <span class="name">${match.name}</span>
        `;
        item.onclick = () => {
            inputEl.value = match.symbol;
            hideAutocomplete();
            handleAddSymbol();
        };
        autocompleteList.appendChild(item);
    });
}

function hideAutocomplete() {
    if (autocompleteList) autocompleteList.style.display = 'none';
}

/**
 * Render Heatmap (D3 Treemap)
 */
function renderHeatmap() {
    if (!heatmapGrid || watchlistState.currentView !== 'heatmap') return;
    
    const container = d3.select(heatmapGrid);
    container.selectAll("*").remove();

    if (currentWatchlistData.length === 0) {
        container.append("div").attr("class", "empty-watchlist").html("<p>No stocks to display.</p>");
        return;
    }

    const width = heatmapGrid.clientWidth;
    const height = 450;

    // Build hierarchy for D3 Treemap
    // We use Turnover/Volume for sizing. If not available, use equal sizing.
    const data = {
        name: "watchlist",
        children: currentWatchlistData.map(d => ({
            ...d,
            value: Math.max(d.totalTradeQuantity || 1, 1) // Weight for size
        }))
    };

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([width, height])
        .padding(2)
        (root);

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border-radius", "8px");

    const nodes = svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`)
        .attr("class", "treemap-node");

    // Color Logic (Same as heatmap.html)
    const getColor = (pct) => {
        if (pct >= 5) return "var(--heatmap-strong-pos)";
        if (pct >= 1.5) return "var(--heatmap-mild-pos)";
        if (pct > -1.5) return "var(--heatmap-neutral)";
        if (pct > -5) return "var(--heatmap-mild-neg)";
        return "var(--heatmap-strong-neg)";
    };

    nodes.append("rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => getColor(d.data.percentageChange))
        .attr("rx", 4)
        .on("click", (event, d) => {
            window.location.href = `market-depth.html?symbol=${d.data.symbol}`;
        })
        .on("mouseenter", (event, d) => showTooltip(event, d.data))
        .on("mousemove", (event) => moveTooltip(event))
        .on("mouseleave", hideTooltip);

    // Add Symbol Text
    nodes.append("text")
        .attr("x", 5)
        .attr("y", 18)
        .text(d => d.data.symbol)
        .attr("class", "symbol-text")
        .style("display", d => (d.x1 - d.x0 > 40 && d.y1 - d.y0 > 25) ? "block" : "none");

    // Add % Change Text
    nodes.append("text")
        .attr("x", 5)
        .attr("y", 34)
        .text(d => (d.data.percentageChange || 0).toFixed(2) + "%")
        .attr("class", "change-text")
        .style("display", d => (d.x1 - d.x0 > 40 && d.y1 - d.y0 > 45) ? "block" : "none");
}

/**
 * Tooltip Helpers
 */
let tooltip = d3.select("body").append("div")
    .attr("class", "heatmap-tooltip");

function showTooltip(event, d) {
    tooltip.style("display", "block")
        .html(`
            <div style="font-weight: 700; margin-bottom: 5px; border-bottom: 1px solid #444;">${d.symbol}</div>
            <div class="flex space-between"><span>Price:</span> <span>${d.lastTradedPrice}</span></div>
            <div class="flex space-between"><span>Change:</span> <span style="color: ${d.change >= 0 ? '#10b981' : '#ef4444'}">${d.change} (${d.percentageChange}%)</span></div>
            <div class="flex space-between"><span>Volume:</span> <span>${d.totalTradeQuantity || 0}</span></div>
        `);
}

function moveTooltip(event) {
    tooltip.style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY + 15) + "px");
}

function hideTooltip() {
    tooltip.style("display", "none");
}

/**
 * Render Table
 */
function renderTable(data) {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-watchlist">
                    <i class="fas fa-binoculars"></i>
                    <p>Watchlist is empty. Add symbols above.</p>
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(item => {
        const tr = document.createElement('tr');
        let changeClass = '';
        const pChange = item.change || 0;
        if (pChange > 0) changeClass = 'positive';
        else if (pChange < 0) changeClass = 'negative';
        tr.className = changeClass;
        const fmtNum = (n) => n != null ? n.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 2}) : '---';
        const fmtPct = (n) => n != null ? n.toFixed(2) + '%' : '---';
        const fmtInt = (n) => (n != null && n !== 0) ? n.toLocaleString() : '---';
        tr.innerHTML = `
            <td class="symbol-cell" style="font-weight: 700; color: var(--accent-primary); cursor: pointer;" onclick="window.location.href='market-depth.html?symbol=${item.symbol}'">${item.symbol}</td>
            <td class="right" style="font-weight: 700; font-family: 'Roboto Mono', monospace;">${fmtNum(item.lastTradedPrice)}</td>
            <td class="right" style="font-family: 'Roboto Mono', monospace;">${fmtNum(item.previousClose)}</td>
            <td class="right ${changeClass}" style="font-weight: 600;">${fmtNum(item.change)}</td>
            <td class="right ${changeClass}" style="font-weight: 600;">${fmtPct(item.percentageChange)}</td>
            <td class="right" style="color: var(--text-secondary);">${fmtNum(item.highPrice)}</td>
            <td class="right" style="color: var(--text-secondary);">${fmtNum(item.lowPrice)}</td>
            <td class="right" style="font-family: 'Roboto Mono', monospace;">${fmtInt(item.totalTradeQuantity || item.lastTradedVolume)}</td> 
            <td class="middle sparkline-cell" id="sparkline-${item.symbol}">
                <div class="shimmer" style="width: 80px; height: 20px; margin: 0 auto; border-radius: 4px;"></div>
            </td>
            <td class="right">
                <div class="flex justify-end">
                    <button class="action-btn delete" onclick="removeSymbol('${item.symbol}')" title="Remove Symbol">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // Render Sparklines after a short delay
    setTimeout(renderAllSparklines, 100);
}

/**
 * Render Sparklines for all items in the current data
 */
async function renderAllSparklines() {
    for (const item of currentWatchlistData) {
        if (!item.missing) {
            await fetchAndDrawSparkline(item.symbol);
        }
    }
}

async function fetchAndDrawSparkline(symbol) {
    const container = document.getElementById(`sparkline-${symbol}`);
    if (!container) return;

    try {
        const response = await apiService.getScripChartData(symbol, '1W');
        if (!response.success || !response.data || response.data.length === 0) {
            container.innerHTML = '<span class="text-muted" style="font-size: 10px;">N/A</span>';
            return;
        }

        const dataPoints = response.data.map(d => d.value).reverse(); // Oldest to newest
        drawSparkline(container, dataPoints);
    } catch (err) {
        console.error(`Sparkline error for ${symbol}:`, err);
        container.innerHTML = '<span class="text-muted" style="font-size: 10px;">Error</span>';
    }
}

function drawSparkline(container, data) {
    container.innerHTML = '';
    
    const width = 80;
    const height = 25;
    const padding = 2;

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "sparkline-svg");

    const x = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([padding, width - padding]);

    const y = d3.scaleLinear()
        .domain([d3.min(data), d3.max(data)])
        .range([height - padding, padding]);

    const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d))
        .curve(d3.curveBasis); 

    // Determine color
    const isUp = data[data.length - 1] >= data[0];
    const color = isUp ? "#22c55e" : "#ef4444";

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", line);
}

function exportWatchlistToCSV() {
    if (currentWatchlistData.length === 0) {
        alert("Watchlist is empty.");
        return;
    }
    const headers = ["Symbol", "LTP", "Prev. Close", "Change", "% Change", "High", "Low", "Volume"];
    const csvRows = currentWatchlistData.map(item => [
        item.symbol,
        item.lastTradedPrice || 0,
        item.previousClose || 0,
        item.change || 0,
        (item.percentageChange || 0).toFixed(2) + "%",
        item.highPrice || 0,
        item.lowPrice || 0,
        item.totalTradeQuantity || item.lastTradedVolume || 0
    ].join(","));
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${watchlistState.activeList}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

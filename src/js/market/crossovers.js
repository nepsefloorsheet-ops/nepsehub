/**
 * MA Crossovers Screener Module
 * Handles Golden Cross (50 > 200) and Death Cross (50 < 200) signals.
 */

// State
let crossoverSourceData = [];
let filteredData = [];

// DOM Elements
const crossoverTableBody = document.getElementById('crossover-data');
const symbolSearch = document.getElementById('symbol-search');
const signalFilter = document.getElementById('signal-filter');
const refreshBtn = document.getElementById('refresh-technical-btn');
const resetBtn = document.getElementById('reset-btn');
const noResults = document.getElementById('no-results');
const retryAll = document.getElementById('retry-all');
const lastUpdatedText = document.getElementById('lastUpdatedText');
const refreshIndicator = document.getElementById('refreshIndicator');
const countBadge = document.getElementById('crossover-count-badge');

/**
 * Initialize
 */
async function init() {
    loadShimmer();
    await fetchCrossovers();
    setupEventListeners();
}

/**
 * Fetch Crossover data
 */
async function fetchCrossovers() {
    try {
        showRefreshing();
        const response = await apiService.getAllCrossovers();
        
        let data = [];
        if (Array.isArray(response)) {
            data = response;
        } else if (response && response.data) {
            data = Array.isArray(response.data) ? response.data : [response.data];
        }
        
        if (data && data.length > 0) {
            crossoverSourceData = data;
            applyFilters();
            updateTimestamp();
        } else {
            renderTable([]);
        }
    } catch (error) {
        ErrorHandler.handleApiError(error, 'fetching crossover data');
        showErrorState();
    } finally {
        hideRefreshing();
    }
}

/**
 * Filter Logic
 */
function applyFilters() {
    const searchTerm = symbolSearch.value.trim().toUpperCase();
    const signalType = signalFilter.value;

    filteredData = crossoverSourceData.filter(item => {
        const matchesSymbol = item.symbol.toUpperCase().includes(searchTerm);
        
        const isGolden = item.sma50 > item.sma200;
        const isNewCross = item.is_cross === true;
        
        let matchesSignal = true;
        if (signalType === 'cross-only') {
            matchesSignal = isNewCross;
        } else if (signalType === 'golden') {
            matchesSignal = isGolden;
        } else if (signalType === 'death') {
            matchesSignal = !isGolden;
        }

        return matchesSymbol && matchesSignal;
    });

    // Sort by crosses first, then symbol
    filteredData.sort((a, b) => {
        if (a.is_cross !== b.is_cross) return b.is_cross - a.is_cross;
        return a.symbol.localeCompare(b.symbol);
    });

    updateCountBadge(filteredData.length);
    renderTable(filteredData);
}

/**
 * Render the table
 */
function renderTable(data) {
    crossoverTableBody.innerHTML = '';
    
    if (!data || data.length === 0) {
        noResults.classList.remove('u-hidden');
        return;
    }
    
    noResults.classList.add('u-hidden');
    
    const fragment = document.createDocumentFragment();
    
    const formatValue = (val) => Number(val || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    data.forEach(item => {
        const ltp = parseFloat(item.close || 0);
        const sma50 = parseFloat(item.sma50 || 0);
        const sma200 = parseFloat(item.sma200 || 0);
        const symbol = item.symbol || 'N/A';
        const isBullish = sma50 > sma200;
        const isNew = item.is_cross === true;
        
        const type = isBullish ? 'bullish' : 'bearish';
        const tr = document.createElement('tr');
        tr.className = `status-${type}`;
        if (isNew) tr.classList.add('is-new-cross');
        
        tr.innerHTML = `
            <td>
                <div style="font-weight: 700; color: var(--accent-primary)">${symbol}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted)">NEPSE Listing</div>
            </td>
            <td class="right">${formatValue(ltp)}</td>
            <td class="right">${formatValue(sma50)}</td>
            <td class="right">${formatValue(sma200)}</td>
            <td class="middle">
                <span class="trend-badge ${type}">${type === 'bullish' ? 'Golden Cross' : 'Death Cross'}</span>
            </td>
        `;
        fragment.appendChild(tr);
    });
    
    crossoverTableBody.appendChild(fragment);
}

/**
 * Shimmer
 */
function loadShimmer() {
    crossoverTableBody.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><div class="shimmer" style="width: 80px; height: 18px; border-radius: 4px;"></div></td>
            <td class="right"><div class="shimmer" style="width: 60px; height: 18px; border-radius: 4px; float: right;"></div></td>
            <td class="right"><div class="shimmer" style="width: 60px; height: 18px; border-radius: 4px; float: right;"></div></td>
            <td class="right"><div class="shimmer" style="width: 60px; height: 18px; border-radius: 4px; float: right;"></div></td>
            <td class="middle"><div class="shimmer" style="width: 120px; height: 18px; border-radius: 20px; margin: 0 auto;"></div></td>
        `;
        crossoverTableBody.appendChild(tr);
    }
}

/**
 * Event Listeners
 */
function setupEventListeners() {
    symbolSearch.addEventListener('input', applyFilters);
    signalFilter.addEventListener('change', applyFilters);
    
    resetBtn.addEventListener('click', () => {
        symbolSearch.value = '';
        signalFilter.value = 'all';
        applyFilters();
    });

    retryAll.addEventListener('click', () => {
        symbolSearch.value = '';
        signalFilter.value = 'all';
        fetchCrossovers();
    });

    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.classList.add('loading');
            refreshBtn.disabled = true;
            try {
                await apiService.refreshTechnical();
                await fetchCrossovers();
                alert('MA Crossovers refreshed from Google Sheets!');
            } catch (e) {
                console.error(e);
            } finally {
                refreshBtn.classList.remove('loading');
                refreshBtn.disabled = false;
            }
        });
    }
}

function updateCountBadge(count) {
    if (countBadge) {
        countBadge.textContent = `${count} Symbols`;
        countBadge.classList.remove('u-hidden');
    }
}

function updateTimestamp() {
    const now = new Date();
    if (lastUpdatedText) {
        lastUpdatedText.textContent = `As of: ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
}

function showRefreshing() {
    if (refreshIndicator) refreshIndicator.classList.remove('u-hidden');
}

function hideRefreshing() {
    if (refreshIndicator) refreshIndicator.classList.add('u-hidden');
}

function showErrorState() {
    crossoverTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load crossover data. Please retry.</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            </td>
        </tr>
    `;
}

document.addEventListener('DOMContentLoaded', init);

/**
 * Moving Average (MA) Screener Module
 * Handles fetching, filtering, and displaying SMA(20) technical data.
 */

// State
let maSourceData = [];
let filteredData = [];
let searchTimeout = null;

// DOM Elements
const maTableBody = document.getElementById('ma-data');
const symbolSearch = document.getElementById('symbol-search');
const trendFilter = document.getElementById('trend-filter');
const resetBtn = document.getElementById('reset-btn');
const noResults = document.getElementById('no-results');
const retryAll = document.getElementById('retry-all');
const lastUpdatedText = document.getElementById('lastUpdatedText');
const refreshIndicator = document.getElementById('refreshIndicator');
const refreshBtn = document.getElementById('refresh-technical-btn');

/**
 * Initialize the MA module
 */
async function init() {
    loadShimmer();
    await fetchAllMa();
    setupEventListeners();
}

/**
 * Fetch all MA data
 */
async function fetchAllMa() {
    try {
        showRefreshing();
        const response = await apiService.getAllMa();
        
        let data = [];
        if (Array.isArray(response)) {
            data = response;
        } else if (response && response.data) {
            data = Array.isArray(response.data) ? response.data : [response.data];
        } else if (response && response.symbol) {
            data = [response];
        }
        
        if (data && data.length > 0) {
            maSourceData = data;
            applyFilters();
            updateTimestamp();
        } else {
            renderTable([]);
        }
    } catch (error) {
        ErrorHandler.handleApiError(error, 'fetching all MA data');
        showErrorState();
    } finally {
        hideRefreshing();
    }
}

/**
 * Apply all active filters
 */
function applyFilters() {
    const searchTerm = symbolSearch.value.trim().toUpperCase();
    const trendType = trendFilter.value;

    filteredData = maSourceData.filter(stock => {
        // 1. Symbol Search
        const matchesSymbol = stock.symbol.toUpperCase().includes(searchTerm);
        
        // 2. Trend Signal
        const isBullish = (stock.close > stock.ma);
        const matchesTrend = (trendType === 'all') || 
                            (trendType === 'bullish' && isBullish) || 
                            (trendType === 'bearish' && !isBullish);

        return matchesSymbol && matchesTrend;
    });

    // Update count badge
    const countBadge = document.getElementById('stock-count-badge');
    if (countBadge) {
        countBadge.textContent = `${filteredData.length} Stocks`;
        countBadge.classList.remove('u-hidden');
    }

    renderTable(filteredData);
}

/**
 * Render data into the table
 */
function renderTable(data) {
    maTableBody.innerHTML = '';
    
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
        const maValue = parseFloat(item.ma || 0);
        const distPercent = parseFloat(item.percent_diff || 0);
        const symbol = item.symbol || 'N/A';
        
        const isBullish = ltp > maValue;
        const trendClass = isBullish ? 'trend-bullish' : 'trend-bearish';
        const trendLabel = isBullish ? 'Bullish' : 'Bearish';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="font-weight: 700; color: var(--accent-primary)">${symbol}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted)">NEPSE Listing</div>
            </td>
            <td class="right">${formatValue(ltp)}</td>
            <td class="right">${formatValue(maValue)}</td>
            <td class="right" style="font-weight: 700; color: ${distPercent >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'}">
                ${distPercent >= 0 ? '+' : ''}${distPercent.toFixed(2)}%
            </td>
            <td class="middle">
                <span class="trend-badge ${trendLabel.toLowerCase()}">${trendLabel}</span>
            </td>
        `;
        fragment.appendChild(tr);
    });
    
    maTableBody.appendChild(fragment);
}

/**
 * Load shimmer rows
 */
function loadShimmer() {
    maTableBody.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><div class="shimmer" style="width: 80px; height: 18px; border-radius: 4px;"></div></td>
            <td class="right"><div class="shimmer" style="width: 60px; height: 18px; border-radius: 4px; float: right;"></div></td>
            <td class="right"><div class="shimmer" style="width: 60px; height: 18px; border-radius: 4px; float: right;"></div></td>
            <td class="right"><div class="shimmer" style="width: 50px; height: 18px; border-radius: 4px; float: right;"></div></td>
            <td class="middle"><div class="shimmer" style="width: 90px; height: 18px; border-radius: 20px; margin: 0 auto;"></div></td>
        `;
        maTableBody.appendChild(tr);
    }
}

/**
 * Event Listeners
 */
function setupEventListeners() {
    // Instant Search
    symbolSearch.addEventListener('input', applyFilters);

    // Trend Change
    trendFilter.addEventListener('change', applyFilters);

    // Reset
    resetBtn.addEventListener('click', () => {
        symbolSearch.value = '';
        trendFilter.value = 'all';
        applyFilters();
    });

    retryAll.addEventListener('click', () => {
        symbolSearch.value = '';
        trendFilter.value = 'all';
        fetchAllMa();
    });

    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.classList.add('loading');
            refreshBtn.disabled = true;
            try {
                await apiService.refreshTechnical();
                await fetchAllMa();
                alert('Moving Average data refreshed from Google Sheets!');
            } catch (e) {
                console.error(e);
            } finally {
                refreshBtn.classList.remove('loading');
                refreshBtn.disabled = false;
            }
        });
    }
}

/**
 * UI Helpers
 */
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
    maTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load Moving Average data. Please check your connection.</p>
                <button onclick="location.reload()" class="retry-btn">Retry Connection</button>
            </td>
        </tr>
    `;
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', init);

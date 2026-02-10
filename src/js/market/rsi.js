/**
 * RSI Screener Module
 * Handles fetching, filtering, and displaying RSI technical data.
 */

// State
let rsiSourceData = [];
let searchTimeout = null;

// DOM Elements
const rsiTableBody = document.getElementById('rsi-data');
const symbolSearch = document.getElementById('symbol-search');
const minRsiInput = document.getElementById('min-rsi');
const maxRsiInput = document.getElementById('max-rsi');
const applyBtn = document.getElementById('apply-filter');
const resetBtn = document.getElementById('reset-btn');
const noResults = document.getElementById('no-results');
const retryAll = document.getElementById('retry-all');
const lastUpdatedText = document.getElementById('lastUpdatedText');
const refreshIndicator = document.getElementById('refreshIndicator');
const refreshBtn = document.getElementById('refresh-technical-btn');

/**
 * Initialize the RSI module
 */
async function init() {
    loadShimmer();
    await fetchAllRsi();
    setupEventListeners();
}

/**
 * Fetch all RSI data from the primary endpoint
 */
async function fetchAllRsi() {
    try {
        showRefreshing();
        const response = await apiService.getAllRsi();
        
        let data = [];
        if (Array.isArray(response)) {
            data = response;
        } else if (response && response.data) {
            data = Array.isArray(response.data) ? response.data : [response.data];
        } else if (response && response.symbol) {
            data = [response];
        }
        
        if (data && data.length > 0) {
            rsiSourceData = data;
            renderTable(rsiSourceData);
            updateTimestamp();
        } else {
            console.warn('No data returned from /rsi/all');
            renderTable([]);
        }
    } catch (error) {
        ErrorHandler.handleApiError(error, 'fetching all RSI data');
        showErrorState();
    } finally {
        hideRefreshing();
    }
}

/**
 * Fetch rsi by symbol (Remote Fallback)
 */
async function fetchBySymbolRemote(symbol) {
    try {
        const response = await apiService.getRsiBySymbol(symbol);
        
        let data = [];
        if (Array.isArray(response)) {
            data = response;
        } else if (response && response.data) {
            data = Array.isArray(response.data) ? response.data : [response.data];
        } else if (response && response.symbol) {
            data = [response];
        }
        
        return data;
    } catch (error) {
        console.error('Remote symbol search error:', error);
        return [];
    }
}

/**
 * Fetch by range filter
 */
async function fetchByRange(min, max) {
    try {
        showRefreshing();
        loadShimmer();
        const response = await apiService.getRsiByFilter(min, max);
        
        let data = [];
        if (Array.isArray(response)) {
            data = response;
        } else if (response && response.data) {
            data = Array.isArray(response.data) ? response.data : [response.data];
        } else if (response && response.symbol) {
            data = [response];
        }
        
        renderTable(data);
    } catch (error) {
        ErrorHandler.handleApiError(error, 'filtering RSI range');
        renderTable([]);
    } finally {
        hideRefreshing();
    }
}

/**
 * Render data into the table
 */
function renderTable(data) {
    rsiTableBody.innerHTML = '';
    
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
        const rsiValue = parseFloat(item.rsi ?? item.rsi_value ?? 0);
        const ltp = parseFloat(item.close ?? item.ltp ?? 0);
        const symbol = item.symbol || 'N/A';
        
        let zoneClass = 'zone-neutral';
        let zoneLabel = 'Neutral';
        
        if (rsiValue < 30) {
            zoneClass = 'zone-red';
            zoneLabel = 'Oversold';
        } else if (rsiValue > 70) {
            zoneClass = 'zone-green';
            zoneLabel = 'Overbought';
        }
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="font-weight: 700; color: var(--accent-primary)">${symbol}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted)">NEPSE Listing</div>
            </td>
            <td class="right">${formatValue(ltp)}</td>
            <td class="right rsi-value" style="font-weight: 700; color: ${rsiValue < 30 ? 'var(--accent-success)' : rsiValue > 70 ? 'var(--accent-danger)' : 'inherit'}">
                ${rsiValue.toFixed(2)}
            </td>
            <td class="middle">
                <span class="trend-badge ${zoneLabel.toLowerCase()}">${zoneLabel}</span>
            </td>
        `;
        fragment.appendChild(tr);
    });
    
    rsiTableBody.appendChild(fragment);
}

/**
 * Load shimmer rows
 */
function loadShimmer() {
    rsiTableBody.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><div class="shimmer" style="width: 80px; height: 18px; border-radius: 4px;"></div></td>
            <td class="right"><div class="shimmer" style="width: 60px; height: 18px; border-radius: 4px; float: right;"></div></td>
            <td class="right"><div class="shimmer" style="width: 50px; height: 18px; border-radius: 4px; float: right;"></div></td>
            <td class="middle"><div class="shimmer" style="width: 90px; height: 18px; border-radius: 20px; margin: 0 auto;"></div></td>
        `;
        rsiTableBody.appendChild(tr);
    }
}

/**
 * Event Listeners
 */
function setupEventListeners() {
    // 🔹 Instant Local Search + Debounced Remote Fallback
    symbolSearch.addEventListener('input', (e) => {
        const val = e.target.value.trim().toUpperCase();
        
        if (searchTimeout) clearTimeout(searchTimeout);
        
        if (!val) {
            renderTable(rsiSourceData);
            return;
        }

        // 1. Instant local search in currently loaded data (Partial Match)
        const localResults = rsiSourceData.filter(stock => 
            stock.symbol.toUpperCase().includes(val)
        );

        if (localResults.length > 0) {
            renderTable(localResults);
        } else {
            // 2. If nothing found locally, show shimmer and try the API
            loadShimmer();
            searchTimeout = setTimeout(async () => {
                showRefreshing();
                const remoteResults = await fetchBySymbolRemote(val);
                renderTable(remoteResults);
                hideRefreshing();
            }, 500);
        }
    });

    // Apply Filter
    applyBtn.addEventListener('click', () => {
        const min = parseFloat(minRsiInput.value);
        const max = parseFloat(maxRsiInput.value);
        
        if (isNaN(min) || isNaN(max) || min > max || min < 0 || max > 100) {
            alert('Please enter a valid RSI range (0-100) where Min <= Max.');
            return;
        }
        
        symbolSearch.value = '';
        fetchByRange(min, max);
    });

    // Reset
    resetBtn.addEventListener('click', () => {
        resetControls();
        renderTable(rsiSourceData);
    });

    retryAll.addEventListener('click', () => {
        resetControls();
        fetchAllRsi();
    });

    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.classList.add('loading');
            refreshBtn.disabled = true;
            try {
                await apiService.refreshTechnical();
                await fetchAllRsi();
                alert('RSI data refreshed from Google Sheets!');
            } catch (e) {
                console.error(e);
            } finally {
                refreshBtn.classList.remove('loading');
                refreshBtn.disabled = false;
            }
        });
    }
}

function resetControls() {
    symbolSearch.value = '';
    minRsiInput.value = '0';
    maxRsiInput.value = '100';
    noResults.classList.add('u-hidden');
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
    rsiTableBody.innerHTML = `
        <tr>
            <td colspan="4" class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load RSI data. Please check your connection.</p>
                <button onclick="location.reload()" class="retry-btn">Retry Connection</button>
            </td>
        </tr>
    `;
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', init);

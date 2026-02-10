// State
let marketData = [];
let filteredData = [];
let currentFilter = null;
let currentSector = '';
let currentSearch = '';

// DOM Elements
const advancesCount = document.getElementById('advances-count');
const declinesCount = document.getElementById('declines-count');
const neutralCount = document.getElementById('neutral-count');
const lastUpdatedText = document.getElementById('lastUpdatedText');
const refreshIndicator = document.getElementById('refreshIndicator');
const symbolSearch = document.getElementById('symbol-search');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const sectorFilter = document.getElementById('sectorFilter');
const marketDataTable = document.getElementById('market-data');
const filterPositive = document.getElementById('filterPositive');
const filterNegative = document.getElementById('filterNegative');
const filterUnchanged = document.getElementById('filterUnchanged');
const scrollLeftIndicator = document.getElementById('scrollLeftIndicator');
const scrollRightIndicator = document.getElementById('scrollRightIndicator');
const tableContainer = document.getElementById('tableContainer');

// Fetch market data using apiService
async function fetchMarketData() {
    try {
        showRefreshing();

        const result = await apiService.getLiveNepseData();

        // Check if API call was successful and handle structure
        if (result && result.data) {
            const liveData = Object.values(result.data);
            processMarketData(liveData);
            
            // Note: overviewSummary (advances/declines) might not be in the new API
            // we will calculate them from liveData in applyFilters -> updateOverviewMetrics
        } else {
            throw new Error('Invalid API response format');
        }
        hideRefreshing();
    } catch (error) {
        hideRefreshing();
        ErrorHandler.handleApiError(error, 'fetch live market data');
    }
}

function updateOverviewSummary(summary) {
    const elements = {
        'advances-count': summary.advanced ?? 0,
        'declines-count': summary.declined ?? 0,
        'neutral-count': summary.unchanged ?? 0
    };

    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            el.classList.remove('shimmer');
            el.style.width = 'auto';
            el.style.height = 'auto';
        }
    }
}


// Process and display market data
function processMarketData(data) {

    // Map API data to our format
    marketData = data.map(item => {
        const ltp = parseFloat(item.lastTradedPrice || 0);
        const prevClose = parseFloat(item.previousClose || 0);
        const pointChange = parseFloat(item.change || 0);
        const percentageChange = parseFloat(item.percentageChange || 0);
        const lastTradedTime = new Date(item.lastUpdatedDateTime);

        return {
            symbol: item.symbol || 'N/A',
            securityName: item.securityName || item.symbol || '',
            ltp: ltp,
            pointChange: pointChange,
            percentageChange: percentageChange,
            open: parseFloat(item.openPrice || item.open || 0),
            high: parseFloat(item.highPrice || item.high || 0),
            low: parseFloat(item.lowPrice || item.low || 0),
            prevClose: prevClose,
            volume: parseInt(item.totalTradeQuantity || item.volume || 0),
            turnover: parseFloat(item.totalTradeValue || item.turnover || 0),
            ltv: parseFloat(item.lastTradedVolume || item.lastTradedVolume || 0),
            sector: item.sector || '',
            lastTradedTime: lastTradedTime,
            totalTransactions: parseInt(item.totalTransactions || 0)
        };
    });

    // Sort by last traded time (most recent first)
    marketData.sort((a, b) => b.lastTradedTime - a.lastTradedTime);

    // Apply any active filters
    applyFilters();

    // Update last updated time
    updateLastUpdatedTime();

    // Update heading blinking status
    updateHeadingStatus();
}

/**
 * Update the Live Market heading color and blinking based on status
 */
function updateHeadingStatus() {
    const heading = document.getElementById('live-market');
    if (!heading) return;

    if (typeof isMarketOpenNow === 'function') {
        if (isMarketOpenNow()) {
            heading.classList.add('blink-open');
            heading.classList.remove('blink-closed');
        } else {
            heading.classList.add('blink-closed');
            heading.classList.remove('blink-open');
        }
    }
}

// Apply all filters
function applyFilters() {
    filteredData = [...marketData];

    // Sector filter
    if (currentSector) {
        filteredData = filteredData.filter(stock =>
            stock.sector.toUpperCase() === currentSector.toUpperCase()
        );
    }

    // Search filter
    if (currentSearch) {
        filteredData = filteredData.filter(stock =>
            stock.symbol.toLowerCase().includes(currentSearch.toLowerCase()) ||
            stock.securityName.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }

    // Gain/loss filter
    if (currentFilter === 'positive') {
        filteredData = filteredData.filter(stock => stock.percentageChange > 0);
    } else if (currentFilter === 'negative') {
        filteredData = filteredData.filter(stock => stock.percentageChange < 0);
    } else if (currentFilter === 'unchanged') {
        filteredData = filteredData.filter(stock => stock.percentageChange === 0);
    }

    // Update counts
    updateOverviewMetrics();

    // Render table
    renderMarketData();
}

// Update overview metrics
function updateOverviewMetrics() {
    let advances = 0, declines = 0, neutral = 0;

    marketData.forEach(stock => {
        const change = stock.percentageChange || 0;

        if (change > 0) advances++;
        else if (change < 0) declines++;
        else neutral++;
    });

    // Update counters
    advancesCount.textContent = advances;
    declinesCount.textContent = declines;
    neutralCount.textContent = neutral;
}

// Update last updated time
function updateLastUpdatedTime() {
    if (marketData.length > 0) {
        // Get the most recent trade time
        const latestTime = marketData[0].lastTradedTime;
        const now = new Date();

        if (latestTime) {
            const timeStr = latestTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = latestTime.toLocaleDateString();
            lastUpdatedText.textContent = `As of: ${dateStr} ${timeStr}`;
        } else {
            lastUpdatedText.textContent = `As of: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
    } else {
        const now = new Date();
        lastUpdatedText.textContent = `As of: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
}

// Render market data table
function renderMarketData() {
    if (filteredData.length === 0) {
        marketDataTable.innerHTML = `
                <tr>
                    <td colspan="11" class="data-loading">
                        No matching stocks found. Try different filters.
                    </td>
                </tr>
            `;
        return;
    }

    // Build table rows - already sorted by last traded time
    let tableHTML = '';

    filteredData.forEach(stock => {
        const changeClass = getChangeClass(stock.percentageChange);

        const formatNumber = value =>
        Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        tableHTML += `
                <tr class="${changeClass}">
                    <td class="symbol-cell" title="${stock.securityName}"><strong>${stock.symbol}</strong></td>
                    <td class="right">${formatNumber(stock.ltp)}</td>
                    <td class="right">${formatNumber(stock.ltv, 2)}</td>
                    <td class="right">${(stock.pointChange || 0).toLocaleString("en-IN", {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                    <td class="right">${(stock.percentageChange >= 0 ? '+' : '')}${stock.percentageChange.toFixed(2)}%</td>
                    <td class="right">${formatNumber(stock.open)}</td>
                    <td class="right">${formatNumber(stock.high)}</td>
                    <td class="right">${formatNumber(stock.low)}</td>
                    <td class="right">${formatNumber(stock.prevClose)}</td>
                    <td class="right">${(stock.volume || 0).toLocaleString("en-IN")}</td>
                    <td class="right">${formatNumber(stock.turnover)}</td>
                </tr>
            `;
    });

    marketDataTable.innerHTML = tableHTML;
}

// Use demo data as initial fallback
function useDemoData() {

    // Shimmer logic: Show shimmer loading effect
    const tbody = document.getElementById("market-data");
    if (!tbody) return;

    // Clear the table body
    tbody.innerHTML = '';
    
    // Create shimmer rows
    for (let i = 0; i < 23; i++) {
        const tr = document.createElement('tr');
        
        // Create 11 cells (matching your table structure)
        for (let idx = 0; idx < 11; idx++) {
            const td = document.createElement('td');
            
            // Apply column alignment classes
            td.className = idx === 0 ? 'middle' : 'right';
            
            // Create shimmer skeleton element
            const skeletonDiv = document.createElement('div');
            skeletonDiv.className = 'skeleton sk-cell';
            
            // Set appropriate widths for different columns
            let width;
            if (idx === 0) { // Symbol column
                width = '60px';
            } else if (idx === 3 || idx === 4) { // Point Change & %Change columns
                width = '70px';
            } else { // Other numeric columns
                width = `${80 + Math.random() * 30}px`; // Random width between 80-110px
            }
            
            skeletonDiv.style.width = width;
            skeletonDiv.style.height = '20px';
            skeletonDiv.style.borderRadius = '4px';
            skeletonDiv.style.backgroundColor = 'var(--text-secondary)';
            skeletonDiv.style.opacity = '0.3';
            skeletonDiv.style.margin = '0 auto';
            
            td.appendChild(skeletonDiv);
            tr.appendChild(td);
        }
        
        tbody.appendChild(tr);
    }
    
    // Add pulse animation style if not already added
    if (!document.getElementById('skeleton-styles')) {
        const style = document.createElement('style');
        style.id = 'skeleton-styles';
        style.textContent = `
            @keyframes shimmer-pulse {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.6; }
            }
            .sk-cell {
                animation: shimmer-pulse 1.5s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update last updated text to show loading
    const lastUpdatedText = document.getElementById('lastUpdatedText');
    if (lastUpdatedText) {
        lastUpdatedText.textContent = 'Loading data...';
    }
    
    // Reset counters to show loading state
    const advancesCount = document.getElementById('advances-count');
    const declinesCount = document.getElementById('declines-count');
    const neutralCount = document.getElementById('neutral-count');
    
    if (advancesCount) advancesCount.textContent = '--';
    if (declinesCount) declinesCount.textContent = '--';
    if (neutralCount) neutralCount.textContent = '--';
}



// Get CSS class for change
function getChangeClass(change) {
    // Handle null/undefined
    if (change === undefined || change === null || isNaN(change)) {
        return 'unchanged';
    }
    
    const classes = [];
    
    // Determine positive/negative/unchanged
    if (change > 0) {
        classes.push('positive');
    } else if (change < 0) {
        classes.push('negative');
    } else {
        classes.push('unchanged');
    }
    
    // Add significant-change class for changes >= 8%
    if (Math.abs(change) >= 9) {
        classes.push('significant-change');
    }
    
    // Return space-separated classes
    return classes.join(' ');
}


// Show refreshing indicator
function showRefreshing() {
    refreshIndicator.classList.remove('u-hidden');
}

// Hide refreshing indicator
function hideRefreshing() {
    refreshIndicator.classList.add('u-hidden');
}

// Clear filters
function clearFilters() {
    currentFilter = null;
    currentSector = '';
    currentSearch = '';
    symbolSearch.value = '';
    sectorFilter.value = '';

    filterPositive.classList.remove('active');
    filterNegative.classList.remove('active');
    filterUnchanged.classList.remove('active');

    applyFilters();
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    currentSearch = symbolSearch.value.trim();
    applyFilters();
});

symbolSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentSearch = symbolSearch.value.trim();
        applyFilters();
    }
});

clearBtn.addEventListener('click', clearFilters);

sectorFilter.addEventListener('change', () => {
    currentSector = sectorFilter.value;
    applyFilters();
});

// Filter buttons
filterPositive.addEventListener('click', () => {
    if (currentFilter === 'positive') {
        currentFilter = null;
        filterPositive.classList.remove('active-filter');
    } else {
        currentFilter = 'positive';
        filterPositive.classList.add('active-filter');
        filterNegative.classList.remove('active-filter');
        filterUnchanged.classList.remove('active-filter');
    }
    applyFilters();
});

filterNegative.addEventListener('click', () => {
    if (currentFilter === 'negative') {
        currentFilter = null;
        filterNegative.classList.remove('active-filter');
    } else {
        currentFilter = 'negative';
        filterNegative.classList.add('active-filter');
        filterPositive.classList.remove('active-filter');
        filterUnchanged.classList.remove('active-filter');
    }
    applyFilters();
});

filterUnchanged.addEventListener('click', () => {
    if (currentFilter === 'unchanged') {
        currentFilter = null;
        filterUnchanged.classList.remove('active-filter');
    } else {
        currentFilter = 'unchanged';
        filterUnchanged.classList.add('active-filter');
        filterPositive.classList.remove('active-filter');
        filterNegative.classList.remove('active-filter');
    }
    applyFilters();
});

// Table scrolling
scrollLeftIndicator.addEventListener('click', () => {
    tableContainer.scrollBy({ left: -200, behavior: 'smooth' });
});

scrollRightIndicator.addEventListener('click', () => {
    tableContainer.scrollBy({ left: 200, behavior: 'smooth' });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set theme
    if (!document.body.hasAttribute('data-theme')) {
        document.body.setAttribute('data-theme', 'dark');
    }

    // Load demo/shimmer data immediately
    useDemoData();

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sectorParam = urlParams.get('sector');
    if (sectorParam) {
        currentSector = sectorParam;
        if (sectorFilter) sectorFilter.value = sectorParam;
    }

    // Check if apiService is available (it should be via global script)
    if (typeof apiService !== 'undefined') {
        // Use Smart Refresh Manager if available, otherwise fall back to manual interval
        if (window.smartRefresh) {
            // Register with Smart Refresh Manager (auto-pauses when market closed)
            window.smartRefresh.register('live-market', fetchMarketData, 2500, true);
            window.smartRefresh.register('last-updated', updateLastUpdatedTime, 2500, false);
            
            console.log('Live Market: Using Smart Refresh (market-hours only)');
        } else {
            // Fallback: Manual refresh (old behavior)
            fetchMarketData();
            const refreshInterval = setInterval(fetchMarketData, 2500);
            setInterval(updateLastUpdatedTime, 2500);
            
            if (typeof cleanupManager !== 'undefined') {
                cleanupManager.registerController({ abort: () => clearInterval(refreshInterval) });
            }
            
            console.log('Live Market: Using manual refresh (always on)');
        }
    } else {
        console.error('apiService not found. Make sure api-service.js is loaded.');
    }
});
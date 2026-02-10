/**
 * Sector Rotation Dashboard Logic
 * Built for NEPSE Dashboard - Professional Money Flow Analysis
 */

// State
let rawData = [];
let sectorData = {};
let currentMode = 'strength'; // 'strength' or 'flow'
let refreshInterval = null;
let countdown = 30;

// DOM Elements
const gridContainer = document.getElementById('rotation-grid-container');
const modeBtns = document.querySelectorAll('.tab-btn[data-mode]');
const modeHint = document.getElementById('rotation-mode-hint');
const refreshTimer = document.getElementById('refresh-timer');
const manualRefreshBtn = document.getElementById('manual-refresh');

// Detail Panel Elements
const detailPanel = document.getElementById('sector-detail-panel');
const closeDetailBtn = document.getElementById('close-detail');
const detailSectorName = document.getElementById('detail-sector-name');
const detailAvgChange = document.getElementById('detail-avg-change');
const detailTurnover = document.getElementById('detail-turnover');
const detailADRatio = document.getElementById('detail-ad-ratio');
const detailGainersList = document.getElementById('detail-gainers');
const detailLosersList = document.getElementById('detail-losers');

/**
 * Initialize
 */
async function init() {
    setupEventListeners();
    
    // Register with Smart Refresh Manager if available
    if (window.smartRefresh) {
        window.smartRefresh.register('sector-rotation', () => {
            fetchAndProcessData();
            resetTimer();
        }, 30000, true);
        
        // Timer update (always runs but only useful when market open)
        setInterval(updateTimerUI, 1000);
        
        console.log('Sector Rotation: Using Smart Refresh (market-hours only)');
    } else {
        // Fallback: Legacy behavior
        await fetchAndProcessData();
        startTimer();
        console.log('Sector Rotation: Using manual refresh (always on)');
    }
}

function updateTimerUI() {
    // Only count down if market is open
    if (window.smartRefresh && window.smartRefresh.getStatus().isMarketOpen) {
        countdown--;
        if (countdown < 0) countdown = 30; // Sync with actual refresh
        refreshTimer.textContent = countdown;
        refreshTimer.parentElement.style.opacity = '1';
    } else {
        refreshTimer.textContent = '--';
        refreshTimer.parentElement.style.opacity = '0.5';
    }
}

/**
 * Event Listeners
 */
function setupEventListeners() {
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            
            modeHint.textContent = currentMode === 'strength' 
                ? 'Color by sector average % change' 
                : 'Color by sector turnover share';
                
            renderSectorCards();
        });
    });

    manualRefreshBtn.addEventListener('click', () => {
        fetchAndProcessData();
        resetTimer();
    });

    closeDetailBtn.addEventListener('click', () => {
        detailPanel.classList.add('hidden');
    });

    // Close on escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') detailPanel.classList.add('hidden');
    });
}

/**
 * Timer Logic
 */

function resetTimer() {
    countdown = 30;
    refreshTimer.textContent = countdown;
}

/**
 * Data Processing
 */
async function fetchAndProcessData() {
    try {
        const response = await apiService.getLiveNepseData();
        if (!response || !response.success) throw new Error('API Error');

        rawData = response.data;
        aggregateSectorData(rawData);
        renderSectorCards();
    } catch (error) {
        console.error('Sector Rotation Error:', error);
        if (typeof ErrorHandler !== 'undefined') {
            ErrorHandler.handleApiError(error, 'fetch sector data');
        }
    }
}

function aggregateSectorData(data) {
    const sectors = {};
    let totalMarketTurnover = 0;

    data.forEach(stock => {
        const sectorName = stock.sector || 'Unknown';
        const chgPercent = parseFloat(stock.percentageChange) || 0;
        const turnover = parseFloat(stock.totalTradeValue) || 0;
        const volume = parseFloat(stock.totalTradeQuantity) || 0;

        if (!sectors[sectorName]) {
            sectors[sectorName] = {
                name: sectorName,
                totalChg: 0,
                stockCount: 0,
                turnover: 0,
                volume: 0,
                advances: 0,
                declines: 0,
                unchanged: 0,
                stocks: []
            };
        }

        const s = sectors[sectorName];
        s.totalChg += chgPercent;
        s.stockCount++;
        s.turnover += turnover;
        s.volume += volume;
        s.stocks.push(stock);

        if (chgPercent > 0) s.advances++;
        else if (chgPercent < 0) s.declines++;
        else s.unchanged++;

        totalMarketTurnover += turnover;
    });

    // Finalize metrics
    Object.values(sectors).forEach(s => {
        s.avgChange = s.totalChg / s.stockCount;
        s.turnoverShare = (s.turnover / totalMarketTurnover) * 100;
        
        // Sort stocks for detail view
        s.stocks.sort((a, b) => (parseFloat(b.percentageChange) || 0) - (parseFloat(a.percentageChange) || 0));
    });

    sectorData = sectors;
}

/**
 * Rendering
 */
function renderSectorCards() {
    const list = Object.values(sectorData);
    
    // Sort logic
    if (currentMode === 'strength') {
        list.sort((a, b) => b.avgChange - a.avgChange);
    } else {
        list.sort((a, b) => b.turnover - a.turnover);
    }

    gridContainer.innerHTML = list.map(sector => generateCardHTML(sector)).join('');

    // Re-attach listeners to new cards
    document.querySelectorAll('.sector-card').forEach(card => {
        card.addEventListener('click', () => showSectorDetail(card.dataset.name));
    });
}

function generateCardHTML(s) {
    const formatValue = (val) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val);
    const formatCompact = (val) => {
        if (val >= 10000000) return (val / 10000000).toFixed(2) + ' Cr';
        if (val >= 100000) return (val / 100000).toFixed(2) + ' L';
        return formatValue(val);
    };

    // Style classes
    let colorClass = '';
    if (currentMode === 'strength') {
        if (s.avgChange > 1.5) colorClass = 'strength-strong-pos';
        else if (s.avgChange > 0) colorClass = 'strength-mild-pos';
        else if (s.avgChange < -1.5) colorClass = 'strength-strong-neg';
        else if (s.avgChange < 0) colorClass = 'strength-mild-neg';
    } else {
        if (s.turnoverShare > 15) colorClass = 'flow-high';
        else if (s.turnoverShare > 5) colorClass = 'flow-med';
    }

    const advPercent = (s.advances / s.stockCount) * 100;
    const uncPercent = (s.unchanged / s.stockCount) * 100;
    const decPercent = (s.declines / s.stockCount) * 100;

    return `
        <div class="sector-card ${colorClass}" data-name="${s.name}">
            <div class="card-header">
                <span class="sector-title">${s.name}</span>
                <span class="sector-change ${s.avgChange >= 0 ? 'success' : 'danger'}">
                    ${s.avgChange > 0 ? '+' : ''}${s.avgChange.toFixed(2)}%
                </span>
            </div>

            <div class="ad-ratio-container">
                <div class="ad-counts text-muted">
                    <span>${s.advances} Adv</span>
                    <span>${s.declines} Dec</span>
                </div>
                <div class="ad-ratio-bar">
                    <div class="adv" style="width: ${advPercent}%"></div>
                    <div class="unc" style="width: ${uncPercent}%"></div>
                    <div class="dec" style="width: ${decPercent}%"></div>
                </div>
            </div>

            <div class="card-metrics">
                <div class="metric-item">
                    <span class="metric-label">Turnover</span>
                    <span class="metric-value">Rs. ${formatCompact(s.turnover)}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Mkt Share</span>
                    <span class="metric-value">${s.turnoverShare.toFixed(1)}%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Volume</span>
                    <span class="metric-value">${formatValue(s.volume)}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Scrips</span>
                    <span class="metric-value">${s.stockCount}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Detail View
 */
function showSectorDetail(name) {
    const s = sectorData[name];
    if (!s) return;

    detailSectorName.textContent = name;
    detailAvgChange.textContent = `${s.avgChange > 0 ? '+' : ''}${s.avgChange.toFixed(2)}%`;
    detailAvgChange.className = s.avgChange >= 0 ? 'success' : 'danger';
    
    detailTurnover.textContent = `Rs. ${new Intl.NumberFormat('en-IN').format(s.turnover)}`;

    // A/D Bar
    const advP = (s.advances / s.stockCount) * 100;
    const uncP = (s.unchanged / s.stockCount) * 100;
    const decP = (s.declines / s.stockCount) * 100;
    
    detailADRatio.querySelector('.adv').style.width = `${advP}%`;
    detailADRatio.querySelector('.unc').style.width = `${uncP}%`;
    detailADRatio.querySelector('.dec').style.width = `${decP}%`;

    // Toppers
    const gainers = s.stocks.slice(0, 5);
    const losers = [...s.stocks].reverse().slice(0, 5);

    detailGainersList.innerHTML = gainers.map(st => `
        <li class="topper-item">
            <span class="symbol">${st.symbol}</span>
            <span class="chg success">+${st.percentageChange}%</span>
        </li>
    `).join('');

    detailLosersList.innerHTML = losers.map(st => `
        <li class="topper-item">
            <span class="symbol">${st.symbol}</span>
            <span class="chg danger">${st.percentageChange}%</span>
        </li>
    `).join('');

    // Actions
    document.getElementById('view-in-heatmap').onclick = () => {
        window.location.href = `heatmap.html?sector=${encodeURIComponent(name)}`;
    };
    
    document.getElementById('filter-in-market').onclick = () => {
        window.location.href = `live-market.html?sector=${encodeURIComponent(name)}`;
    };

    detailPanel.classList.remove('hidden');
}

// Start
document.addEventListener('DOMContentLoaded', init);

/**
 * Confluence Score Screener
 * Visualizes the "Super-Signal" score.
 */

// State
let confluenceData = [];
let filteredData = [];

// DOM Elements
const confluenceTableBody = document.getElementById('confluence-data');
const leaderboard = document.getElementById('leaderboard');
const symbolSearch = document.getElementById('symbol-search');
const scoreFilter = document.getElementById('score-filter');
const refreshBtn = document.getElementById('refresh-technical-btn');
const resetBtn = document.getElementById('reset-btn');
const noResults = document.getElementById('no-results');
const countBadge = document.getElementById('stock-count-badge');
const lastUpdatedText = document.getElementById('lastUpdatedText');

/**
 * Init
 */
async function init() {
    loadShimmer();
    await fetchData();
    setupEventListeners();
}

/**
 * Fetch Data
 */
async function fetchData() {
    try {
        const response = await apiService.getConfluence();
        if (response) {
            // Backend now handles digit filtering (Mutual Funds/Debentures)
            confluenceData = response || [];
            applyFilters();
            updateLastUpdated();
        }
    } catch (error) {
        ErrorHandler.handleApiError(error, 'fetching confluence data');
    }
}

/**
 * Filter and Sort
 */
function applyFilters() {
    const searchTerm = symbolSearch.value.trim().toUpperCase();
    const minScore = parseInt(scoreFilter.value || 0);

    filteredData = confluenceData.filter(item => {
        const matchesSymbol = item.symbol.toUpperCase().includes(searchTerm);
        const matchesScore = item.score >= minScore;
        return matchesSymbol && matchesScore;
    });

    renderLeaderboard(confluenceData.slice(0, 3));
    renderTable(filteredData);
    
    if (countBadge) {
        countBadge.textContent = `${filteredData.length} Stocks`;
        countBadge.classList.remove('u-hidden');
    }
}

/**
 * Render Top 3 Picks
 */
function renderLeaderboard(topPicks) {
    leaderboard.innerHTML = '';
    
    topPicks.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'pro-card';
        
        // Color based on score
        let scoreColor = 'var(--accent-success)';
        if (item.score < 40) scoreColor = 'var(--accent-danger)';
        else if (item.score < 60) scoreColor = 'var(--accent-secondary)';

        card.innerHTML = `
            <div class="rank">#${index + 1}</div>
            <div class="card-head">
                <h4>${item.symbol}</h4>
                <div class="trend-badge ${item.trend.toLowerCase()}">${item.trend}</div>
            </div>
            <div class="score-wrap">
                <div class="metrics-mini">
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0">Close: <b>${item.close}</b></p>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin: 5px 0 0 0">RSI: <b>${item.rsi || '--'}</b></p>
                </div>
                <div class="score-visual">
                    <div class="score-circle" style="border-color: ${scoreColor}">
                        <span class="val" style="color: ${scoreColor}">${item.score}</span>
                        <span class="lbl">Score</span>
                    </div>
                </div>
            </div>
            <div class="breakdown-pills" style="margin-top: 20px">
                ${item.breakdown?.rsi ? `<span class="p-rsi">RSI +${item.breakdown.rsi}</span>` : ''}
                ${item.breakdown?.ma ? `<span class="p-ma">MA +${item.breakdown.ma}</span>` : ''}
                ${item.breakdown?.trend ? `<span class="p-trend">Golden +${item.breakdown.trend}</span>` : ''}
            </div>
        `;
        leaderboard.appendChild(card);
    });
}

/**
 * Render Table
 */
function renderTable(data) {
    confluenceTableBody.innerHTML = '';
    
    if (data.length === 0) {
        noResults.classList.remove('u-hidden');
        return;
    }
    
    noResults.classList.add('u-hidden');
    
    data.forEach(item => {
        const tr = document.createElement('tr');
        
        // Bar color
        let barClass = 'score-high';
        if (item.score < 40) barClass = 'score-low';
        else if (item.score < 60) barClass = 'score-mid';

        const breakdownHtml = `
            <div class="score-bar-container">
                <div class="score-bar-fill ${barClass}" style="width: ${item.score}%"></div>
            </div>
            <div class="breakdown-pills">
                ${item.breakdown?.rsi ? `<span class="p-rsi">RSI ${item.breakdown.rsi > 0 ? '+' : ''}${item.breakdown.rsi}</span>` : ''}
                ${item.breakdown?.ma ? `<span class="p-ma">MA ${item.breakdown.ma > 0 ? '+' : ''}${item.breakdown.ma}</span>` : ''}
                ${item.breakdown?.trend ? `<span class="p-trend">Trend ${item.breakdown.trend > 0 ? '+' : ''}${item.breakdown.trend}</span>` : ''}
            </div>
        `;

        tr.innerHTML = `
            <td>
                <div style="font-weight: 700; color: var(--accent-primary)">${item.symbol}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted)">NEPSE Listing</div>
            </td>
            <td class="right">${(item.close || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td class="middle" style="min-width: 200px">
                <div style="font-size: 0.9rem; font-weight: 700; margin-bottom: 5px">${item.score}/100</div>
                ${breakdownHtml}
            </td>
            <td class="middle">
                <span class="trend-badge ${item.trend.toLowerCase()}">${item.trend}</span>
            </td>
            <td class="right">${item.rsi || '--'}</td>
        `;
        confluenceTableBody.appendChild(tr);
    });
}

/**
 * Shimmer
 */
function loadShimmer() {
    confluenceTableBody.innerHTML = '';
    leaderboard.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const div = document.createElement('div');
        div.className = 'shimmer';
        div.style.height = '140px';
        div.style.borderRadius = '16px';
        leaderboard.appendChild(div);
    }
}

/**
 * Listeners
 */
function setupEventListeners() {
    symbolSearch.addEventListener('input', applyFilters);
    scoreFilter.addEventListener('change', applyFilters);
    
    resetBtn.addEventListener('click', () => {
        symbolSearch.value = '';
        scoreFilter.value = '0';
        applyFilters();
    });

    refreshBtn.addEventListener('click', async () => {
        refreshBtn.classList.add('loading');
        refreshBtn.disabled = true;
        try {
            await apiService.refreshTechnical();
            await fetchData();
            alert('Technical signals refreshed from Google Sheets!');
        } catch (e) {
            console.error(e);
        } finally {
            refreshBtn.classList.remove('loading');
            refreshBtn.disabled = false;
        }
    });

    document.getElementById('retry-all')?.addEventListener('click', () => {
        symbolSearch.value = '';
        scoreFilter.value = '0';
        applyFilters();
    });
}

function updateLastUpdated() {
    const now = new Date();
    if (lastUpdatedText) {
        lastUpdatedText.textContent = `As of: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
}

document.addEventListener('DOMContentLoaded', init);

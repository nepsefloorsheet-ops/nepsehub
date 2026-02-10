/**
 * Candlestick AI Logic
 */

let patternData = [];

// DOM
const patternsContainer = document.getElementById('patterns-container');
const patternFilter = document.getElementById('pattern-filter');
const refreshBtn = document.getElementById('refresh-technical-btn');
const countBadge = document.getElementById('pattern-count-badge');
const noResults = document.getElementById('no-results');

async function init() {
    loadShimmer();
    await fetchPatterns();
    setupListeners();
}

async function fetchPatterns() {
    try {
        const data = await apiService.getCandlesticks();
        // Backend now handles digit filtering (Mutual Funds/Debentures)
        patternData = data || [];
        applyFilters();
    } catch (error) {
        ErrorHandler.handleApiError(error, 'fetching candlestick patterns');
    }
}

function applyFilters() {
    const filter = patternFilter.value;
    
    const filtered = patternData.filter(item => {
        const pat = item.pattern.toLowerCase();
        if (filter === 'all') return true;
        if (filter === 'Bullish') return pat.includes('bullish') || pat.includes('hammer');
        if (filter === 'Bearish') return pat.includes('bearish') || pat.includes('shooting star');
        if (filter === 'Hammer') return pat.includes('hammer');
        if (filter === 'Engulfing') return pat.includes('engulfing');
        return true;
    });

    renderPatterns(filtered);
    
    if (countBadge) {
        countBadge.textContent = `${filtered.length} Patterns`;
        countBadge.classList.remove('u-hidden');
    }
}

function renderPatterns(data) {
    patternsContainer.innerHTML = '';
    
    if (data.length === 0) {
        noResults.classList.remove('u-hidden');
        return;
    }
    
    noResults.classList.add('u-hidden');
    
    data.forEach(item => {
        const isBullish = item.pattern.toLowerCase().includes('bullish') || item.pattern.toLowerCase().includes('hammer');
        const card = document.createElement('div');
        card.className = `pattern-card ${isBullish ? 'is-bullish' : 'is-bearish'}`;
        
        card.innerHTML = `
            <i class="fas ${isBullish ? 'fa-chart-line' : 'fa-chart-area'} pattern-icon"></i>
            <span class="symbol">${item.symbol}</span>
            <span class="pattern-name">${item.pattern}</span>
            <div class="metrics">
                <span>LTP: ${(item.close || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                <span class="${isBullish ? 'text-success' : 'text-danger'}">
                   <i class="fas ${isBullish ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                </span>
            </div>
        `;
        patternsContainer.appendChild(card);
    });
}

function loadShimmer() {
    patternsContainer.innerHTML = '';
    for(let i=0; i<8; i++) {
        const div = document.createElement('div');
        div.className = 'shimmer';
        div.style.height = '120px';
        div.style.borderRadius = '12px';
        patternsContainer.appendChild(div);
    }
}

function setupListeners() {
    patternFilter.addEventListener('change', applyFilters);
    refreshBtn.addEventListener('click', async () => {
        refreshBtn.classList.add('loading');
        refreshBtn.disabled = true;
        try {
            await apiService.refreshTechnical();
            await fetchPatterns();
            alert('Technical patterns scanned and refreshed!');
        } catch (e) {
            console.error(e);
        } finally {
            refreshBtn.classList.remove('loading');
            refreshBtn.disabled = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', init);

/**
 * Volume Shockers - "Follow the Smart Money"
 */

let originalData = [];
let activeFilter = 'all';

// DOM
const container = document.getElementById('momentum-container');
const tableBody = document.getElementById('momentum-table-body');
const pillars = document.querySelectorAll('.pill');
const refreshBtn = document.getElementById('refresh-technical-btn');

async function init() {
    loadShimmer();
    await fetchData();
    setupListeners();
}

async function fetchData() {
    try {
        const data = await apiService.getVolumeShockers();
        // Backend now handles digit filtering (Mutual Funds/Debentures)
        // Sort by volume ratio descending
        originalData = (data || []).sort((a,b) => b.vol_ratio - a.vol_ratio);
        render();
    } catch (e) {
        ErrorHandler.handleApiError(e, 'momentum data');
    }
}

function render() {
    container.innerHTML = '';
    tableBody.innerHTML = '';

    const filtered = originalData.filter(item => {
        if (activeFilter === '3x') return item.vol_ratio >= 3;
        if (activeFilter === '5x') return item.vol_ratio >= 5;
        return true;
    });

    // Render Cards for Top 6
    filtered.slice(0, 6).forEach(item => {
        const card = document.createElement('div');
        card.className = `shocker-card ${item.vol_ratio >= 3 ? 'high-ratio' : ''}`;
        card.innerHTML = `
            <div class="ratio-badge">${item.vol_ratio}x</div>
            <div class="symbol">${item.symbol}</div>
            <div class="stat-row"><span>Today Vol</span><b>${(item.volume || 0).toLocaleString()}</b></div>
            <div class="stat-row"><span>Avg Vol</span><b>${(item.vol_avg_20 || 0).toLocaleString()}</b></div>
            <div class="stat-row"><span>LTP</span><b>Rs. ${item.close}</b></div>
        `;
        container.appendChild(card);
    });

    // Render Table
    filtered.forEach(item => {
        const tr = document.createElement('tr');
        const ratioPercent = Math.min(100, (item.vol_ratio / 5) * 100);
        let barClass = '';
        if (item.vol_ratio >= 5) barClass = 'extreme';
        else if (item.vol_ratio >= 3) barClass = 'high';

        tr.innerHTML = `
            <td><strong>${item.symbol}</strong></td>
            <td class="right">${item.close}</td>
            <td class="right">${(item.volume || 0).toLocaleString()}</td>
            <td class="right">${(item.vol_avg_20 || 0).toLocaleString()}</td>
            <td class="middle volume-cell" style="width: 150px">
                <div class="flex items-center gap-10">
                   <span style="font-weight: 700; width: 30px">${item.vol_ratio}x</span>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function setupListeners() {
    pillars.forEach(pill => {
        pill.addEventListener('click', () => {
            pillars.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeFilter = pill.dataset.filter;
            render();
        });
    });
}

function loadShimmer() {
    container.innerHTML = '<div class="shimmer" style="height: 150px; grid-column: 1/-1"></div>';
}

document.addEventListener('DOMContentLoaded', init);

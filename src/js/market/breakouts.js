/**
 * Breakout Scanner Logic
 */

let breakoutData = [];
let activeFilter = 'all';

// DOM
const alertFeed = document.getElementById('alert-feed');
const tableBody = document.getElementById('breakout-table-body');
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
        breakoutData = data || [];
        render();
    } catch (e) {
        ErrorHandler.handleApiError(e, 'breakout data');
    }
}

function render() {
    alertFeed.innerHTML = '';
    tableBody.innerHTML = '';

    const filtered = breakoutData.filter(item => {
        if (activeFilter === 'all') return item.breakout !== 'Neutral';
        return item.breakout === activeFilter;
    });

    // Render Alerts (Latest 5 detections as prominent cards)
    filtered.slice(0, 5).forEach(item => {
        const div = document.createElement('div');
        const typeCls = item.breakout.toLowerCase().includes('high') ? 'high' : item.breakout.toLowerCase().includes('low') ? 'low' : 'near';
        
        div.className = `alert-card ${typeCls}`;
        div.innerHTML = `
            <div class="alert-info">
               <span class="alert-tag tag-${typeCls}">${item.breakout}</span>
               <h4>${item.symbol} Breakthrough</h4>
               <p>Price Rs. ${item.close} vs Yearly Target Rs. ${item.breakout.includes('High') ? item.high_52 : item.low_52}</p>
            </div>
        `;
        alertFeed.appendChild(div);
    });

    // Render All in Table
    breakoutData.forEach(item => {
        const tr = document.createElement('tr');
        const statusCls = item.breakout.toLowerCase().includes('high') ? 'text-success' : item.breakout.toLowerCase().includes('low') ? 'text-danger' : 'text-muted';
        
        tr.innerHTML = `
            <td><strong>${item.symbol}</strong></td>
            <td class="right">${item.close}</td>
            <td class="right">${(item.high_52 || 0).toLocaleString()}</td>
            <td class="right">${(item.low_52 || 0).toLocaleString()}</td>
            <td class="middle breakout-cell" style="font-weight: 700;">
               <span class="${statusCls}">${item.breakout}</span>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    if (filtered.length === 0 && activeFilter !== 'all') {
        alertFeed.innerHTML = '<p class="text-muted" style="text-align: center; padding: 20px;">No stocks matching this breakout criteria currently.</p>';
    }
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

    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.classList.add('loading');
            refreshBtn.disabled = true;
            try {
                await apiService.refreshTechnical();
                await fetchData();
                alert('Breakout data refreshed!');
            } catch (e) {
                console.error(e);
            } finally {
                refreshBtn.classList.remove('loading');
                refreshBtn.disabled = false;
            }
        });
    }
}

function loadShimmer() {
    alertFeed.innerHTML = '<div class="shimmer" style="height: 100px; width: 100%"></div>';
}

document.addEventListener('DOMContentLoaded', init);

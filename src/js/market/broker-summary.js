/**
 * broker-summary.js
 * Logic for Broker Summary page
 */

let currentBrokerData = [];
let sortState = {
    column: 'buyer',
    direction: 'asc'
};
let searchTerm = '';
let netFlowChart = null;

// Available Broker Logos (Broker ID -> Extension)
const availableLogos = {
    1: 'png', 3: 'png', 4: 'png', 5: 'png', 6: 'png', 7: 'png', 8: 'png', 10: 'png', 11: 'png', 13: 'png', 14: 'png', 16: 'png', 17: 'png', 18: 'png', 19: 'png', 20: 'png', 21: 'jpg', 22: 'png', 25: 'jpg', 26: 'png', 28: 'jpg', 29: 'jpg', 32: 'png', 33: 'jpg', 34: 'png', 35: 'png', 36: 'jpg', 37: 'png', 38: 'png', 39: 'png', 40: 'png', 41: 'png', 42: 'png', 43: 'png', 44: 'png', 45: 'png', 46: 'png', 47:'png', 48: 'jpg', 49: 'png', 50: 'png', 51: 'png', 52: 'png', 53: 'jpg', 54: 'jpg', 55: 'png', 56: 'png', 57: 'jpg', 58: 'png', 59: 'png', 60: 'jpg', 61: 'jpeg', 62: 'png', 63: 'jpeg', 64: 'jpeg', 65: 'png', 66: 'png', 67: 'jpeg', 68: 'jpeg', 69: 'png', 70: 'png', 71: 'png', 72: 'jpeg', 73: 'jpeg', 74: 'jpeg', 75: 'jpeg', 76: 'jpeg', 77: 'jpeg', 78: 'png', 79: 'png', 80: 'jpeg', 81: 'png', 82: 'png', 83:'png', 84: 'png', 85: 'png', 86: 'png', 87: 'png', 88: 'jpg', 89: 'jpeg', 90: 'jpeg', 91: 'png', 92: 'jpeg', 93: 'jpeg', 94: 'jpeg', 95: 'jpeg', 96: 'png', 97: 'png', 98: 'png', 99: 'png', 100: 'jpg', 101: 'png'
};

document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch
    fetchBrokerSnapshot();

    // Register sort click listeners
    document.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.dataset.sort;
            handleSort(column);
        });
    });

    // Search input listener
    const searchInput = document.getElementById('broker-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.trim().toLowerCase();
            applySortAndRender();
        });
    }
});

async function fetchBrokerSnapshot() {
    console.log("Fetching Broker Summary...");
    const tableBody = document.getElementById('broker-body');
    
    try {
        if (!window.apiService) {
            console.error("apiService not found");
            return;
        }

        // Fetching broker snapshot from the API service
        const data = await window.apiService.getBrokerSnapshot();
        console.log("Broker Snapshot Data received:", data);
        
        if (!data || !Array.isArray(data) || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="empty-watchlist"><p>No snapshot data available.</p></td></tr>';
            return;
        }

        // 1. Calculate individual total turnover & process numbers
        let marketTotalTurnover = 0;
        const processedList = data.map(item => {
            const buy = parseFloat(item.buy_amount) || 0;
            const sell = parseFloat(item.sell_amount) || 0;
            const turnover = buy + sell;
            marketTotalTurnover += turnover;
            
            return {
                ...item,
                total_turnover: turnover,
                buy_amount: buy,
                sell_amount: sell,
                net_amount: parseFloat(item.net_amount) || 0
            };
        });

        // 2. Calculate Market Share and Diff %
        currentBrokerData = processedList.map(item => {
            const diff = item.buy_amount - item.sell_amount;
            return {
                ...item,
                market_share: marketTotalTurnover !== 0 ? (item.total_turnover / marketTotalTurnover) * 100 : 0,
                diff_pct: item.sell_amount !== 0 ? (diff / item.sell_amount) * 100 : (item.buy_amount !== 0 ? 100 : 0)
            };
        });

        // Update Top Summary Cards
        updateSummaryCards(currentBrokerData);

        // Render Net Flow Chart
        renderNetFlowChart(currentBrokerData);

        applySortAndRender();
    } catch (error) {
        console.error("Error fetching broker summary:", error);
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-watchlist"><p style="color: var(--accent-danger);">Error loading data. Please try again later.</p></td></tr>';
    }
}

/**
 * Update the Top 3 Summary Cards
 */
function updateSummaryCards(data) {
    if (!data.length) return;

    const fmtNum = (n) => n != null ? Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '--';

    const setCardLogo = (cardId, brokerId, defaultIcon) => {
        const card = document.getElementById(cardId);
        if (!card) return;
        const iconWrapper = card.querySelector('.summary-card-icon');
        const ext = availableLogos[brokerId];
        
        if (ext) {
            const logoSrc = `../img/broker/Broker no. ${brokerId}.${ext}`;
            iconWrapper.innerHTML = `
                <img src="${logoSrc}" 
                     style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;">
            `;
        } else {
            iconWrapper.innerHTML = `<i class="${defaultIcon}"></i>`;
        }
    };

    // 1. Market Leader (Highest Turnover)
    const leader = [...data].sort((a,b) => b.total_turnover - a.total_turnover)[0];
    document.getElementById('leader-id').textContent = `Broker ${leader.buyer}`;
    document.getElementById('leader-turnover').textContent = `Turnover: Rs ${fmtNum(leader.total_turnover)}`;
    setCardLogo('card-market-leader', leader.buyer, 'fas fa-crown');

    // 2. Top Accumulation (Highest Net Amount)
    const accumulator = [...data].sort((a,b) => b.net_amount - a.net_amount)[0];
    document.getElementById('accumulator-id').textContent = `Broker ${accumulator.buyer}`;
    document.getElementById('accumulator-net').textContent = `Net Buy: Rs ${fmtNum(accumulator.net_amount)} (${accumulator.diff_pct.toFixed(1)}%)`;
    setCardLogo('card-top-accumulator', accumulator.buyer, 'fas fa-bullseye');

    // 3. Top Distribution (Lowest Net Amount)
    const distributor = [...data].sort((a,b) => a.net_amount - b.net_amount)[0];
    document.getElementById('distributor-id').textContent = `Broker ${distributor.buyer}`;
    const distAbsNet = Math.abs(distributor.net_amount);
    document.getElementById('distributor-net').textContent = `Net Sell: Rs ${fmtNum(distAbsNet)} (${Math.abs(distributor.diff_pct).toFixed(1)}%)`;
    setCardLogo('card-top-distributor', distributor.buyer, 'fas fa-bear-market');
}

/**
 * Handle Column Sorting
 */
function handleSort(column) {
    if (sortState.column === column) {
        sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortState.column = column;
        sortState.direction = 'desc';
        if (column === 'buyer') sortState.direction = 'asc';
    }

    applySortAndRender();
}

function applySortAndRender() {
    // 1. Filter by Search Term
    let filteredData = [...currentBrokerData];
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.buyer.toString().toLowerCase().includes(searchTerm)
        );
    }

    // 2. Sort Data
    const { column, direction } = sortState;
    filteredData.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        if (column !== 'buyer') {
            valA = parseFloat(valA) || 0;
            valB = parseFloat(valB) || 0;
        } else {
            valA = parseInt(valA) || 0;
            valB = parseInt(valB) || 0;
        }

        return direction === 'asc' ? valA - valB : valB - valA;
    });

    // 3. Update Icons
    document.querySelectorAll('th.sortable').forEach(th => {
        th.classList.remove('active');
        const icon = th.querySelector('i');
        if (icon) icon.className = 'fas fa-sort';
        
        if (th.dataset.sort === column) {
            th.classList.add('active');
            if (icon) icon.className = direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        }
    });

    // 4. Render Table
    renderBrokerTable(filteredData);
}


function getBrokerLogoHtml(brokerId) {
    const ext = availableLogos[brokerId];
    
    if (ext) {
        const logoSrc = `../img/broker/Broker no. ${brokerId}.${ext}`;
        return `
            <div class="broker-info">
                <img src="${logoSrc}" 
                     class="broker-logo" 
                     alt="${brokerId}">
                <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: auto;">#${brokerId}</span>
            </div>
        `;
    } else {
        // Fallback to pill if logo not in available list
        return `
            <div class="broker-info">
                <span class="broker-pill">${brokerId}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: auto;">#${brokerId}</span>
            </div>
        `;
    }
}

function renderBrokerTable(data) {
    const tableBody = document.getElementById('broker-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-watchlist"><p>No brokers match your search.</p></td></tr>';
        return;
    }

    const fmtNum = (n) => n != null ? Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---';
    const fmtPct = (n) => n != null ? Number(n).toFixed(2) + '%' : '---';

    data.forEach(item => {
        const tr = document.createElement('tr');
        const netClass = (item.net_amount >= 0) ? 'positive' : 'negative';

        // Whale Watch Highlighting (> 3% Market Share)
        if (item.market_share > 3) {
            tr.classList.add('whale-row');
        }

        tr.innerHTML = `
            <td class="left">${getBrokerLogoHtml(item.buyer)}</td>
            <td class="right">${fmtNum(item.buy_amount)}</td>
            <td class="right">${fmtNum(item.sell_amount)}</td>
            <td class="right" style="font-weight: 600;">${fmtNum(item.total_turnover)}</td>
            <td class="right" style="color: var(--text-muted);">${fmtPct(item.market_share)}</td>
            <td class="right ${netClass}">${fmtNum(item.net_amount)}</td>
            <td class="right ${netClass}" style="font-weight: 600;">${fmtPct(item.diff_pct)}</td>
            <td class="right">${fmtNum(item.net_matching)}</td>
        `;

        tableBody.appendChild(tr);
    });
}

/**
 * Render Net Flow Bar Chart (Top 5 Accumulators vs Top 5 Distributors)
 */
function renderNetFlowChart(data) {
    const ctx = document.getElementById('netFlowChart');
    if (!ctx) return;

    // 1. Prepare Data
    const sorted = [...data].sort((a, b) => b.net_amount - a.net_amount);
    const top5Accumulators = sorted.slice(0, 5);
    const top5Distributors = sorted.slice(-5).reverse();

    const labels = [
        ...top5Accumulators.map(b => `Broker ${b.buyer}`),
        ...top5Distributors.map(b => `Broker ${b.buyer}`)
    ];

    const values = [
        ...top5Accumulators.map(b => b.net_amount),
        ...top5Distributors.map(b => b.net_amount)
    ];

    const colors = [
        ...top5Accumulators.map(() => '#22c55e'), // Green for accumulation
        ...top5Distributors.map(() => '#ef4444')   // Red for distribution
    ];

    // 2. Destroy existing chart if any
    if (netFlowChart) {
        netFlowChart.destroy();
    }

    // 3. Create Chart
    netFlowChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Net Flow (Rs)',
                data: values,
                backgroundColor: colors,
                borderRadius: 4,
                borderWidth: 0,
                barThickness: 25
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.x !== null) {
                                label += 'Rs ' + Number(context.parsed.x).toLocaleString();
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            if (Math.abs(value) >= 10000000) return (value / 10000000).toFixed(1) + ' Cr';
                            if (Math.abs(value) >= 100000) return (value / 100000).toFixed(1) + ' L';
                            return value;
                        }
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

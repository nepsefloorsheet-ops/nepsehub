const RAILWAY_API_BASE = "https://nepseapi-production-9edf.up.railway.app";
let refreshInterval = null;
let currentSymbol = "";

async function fetchMarketDepth(symbol) {
    if (!symbol) return;
    symbol = symbol.toUpperCase();
    currentSymbol = symbol;
    
    // Clear any existing interval to prevent multiple timers
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }

    const refreshData = async () => {
        try {
            if (!window.apiService) {
                console.error("apiService not found");
                return;
            }

            console.log(`Auto-refreshing depth for: ${currentSymbol}`);
            const data = await window.apiService.getMarketDepth(currentSymbol);
            renderMarketDepth(data, currentSymbol);
            
            // Fetch additional scrip details for the info card
            fetchScripDetails(currentSymbol);
        } catch (error) {
            console.error("Error fetching market depth:", error);
        }
    };

    // Initial load
    await refreshData();

    // Set interval for 30 seconds
    refreshInterval = setInterval(refreshData, 30000);
}

async function fetchScripDetails(symbol) {
    console.log("Fetching details for symbol:", symbol);
    try {
        if (!window.apiService) {
            console.error("apiService not found globally");
            return;
        }
        const response = await window.apiService.getLiveNepseData();
        // The API returns { success, data: [], ... }
        const liveData = response.data || [];
        console.log("Live data received, count:", liveData.length);
        
        // Ensure accurate matching (strip whitespace, upper case)
        const scrip = liveData.find(item => 
            item.symbol && item.symbol.trim().toUpperCase() === symbol.trim().toUpperCase()
        );
        
        if (scrip) {
            console.log("Matching scrip found:", scrip.securityName);
            renderSecurityInfo(scrip);
        } else {
            console.warn("No matching scrip found for symbol:", symbol);
        }
    } catch (error) {
        console.error("Error fetching scrip details:", error);
    }
}

function renderSecurityInfo(scrip) {
    const format = (val) => val != null ? val : '---';
    const formatNum = (val) => val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 }) : '0.00';

    const companyEl = document.getElementById('info-company-name');
    const securityEl = document.getElementById('info-security-name');
    if (companyEl) companyEl.innerHTML = `Company: <b>${format(scrip.securityName)}</b>`;
    if (securityEl) securityEl.innerHTML = `Security name: <b>${format(scrip.securityName)}</b>`;
    
    const pointEl = document.getElementById('info-point');
    const percentEl = document.getElementById('info-percent-change');
    const rowPoint = document.getElementById('row-point');
    const rowPercent = document.getElementById('row-percent-change');

    // API uses 'change' for point change
    const pointChange = scrip.change || 0;
    if (pointEl) pointEl.innerText = formatNum(pointChange);
    if (percentEl) percentEl.innerText = formatNum(scrip.percentageChange);
    
    if (rowPoint && rowPercent) {
        // Clear classes
        rowPoint.classList.remove('up', 'down');
        rowPercent.classList.remove('up', 'down');
        
        if (pointChange > 0) {
            rowPoint.classList.add('up');
            rowPercent.classList.add('up');
        } else if (pointChange < 0) {
            rowPoint.classList.add('down');
            rowPercent.classList.add('down');
        }
    }

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    setVal('info-ltp', formatNum(scrip.lastTradedPrice));
    
    // Calculate Average Price if not present (totalTradeValue / totalTradeQuantity)
    let avgPrice = 0;
    if (scrip.totalTradeValue && scrip.totalTradeQuantity) {
        avgPrice = scrip.totalTradeValue / scrip.totalTradeQuantity;
    }
    setVal('info-avg-price', formatNum(avgPrice));
    
    setVal('info-open', formatNum(scrip.openPrice));
    setVal('info-d-high', formatNum(scrip.highPrice));
    setVal('info-d-low', formatNum(scrip.lowPrice));
    setVal('info-close', formatNum(scrip.previousClose));
    
    // Mapping keys: totalTradeQuantity, lastTradedVolume
    setVal('info-ltq', (scrip.lastTradedVolume || 0).toLocaleString());
    setVal('info-volume', (scrip.totalTradeQuantity || 0).toLocaleString());
    
    
    // Format LTT to remove milliseconds (e.g., "2026-02-03 11:16:15.049..." -> "2026-02-03 11:16:15")
    let ltt = format(scrip.lastUpdatedDateTime);
    if (ltt !== '---' && ltt.includes('.')) {
        ltt = ltt.split('.')[0];
    }
    setVal('info-ltt', ltt);
}

function renderMarketDepth(data, symbol) {
    const buyBody = document.getElementById('buy-orders');
    const sellBody = document.getElementById('sell-orders');
    const symbolTitle = document.getElementById('current-symbol');
    
    if (symbolTitle) symbolTitle.innerText = symbol || data.symbol || "";

    // Clear tables
    if (buyBody) buyBody.innerHTML = '';
    if (sellBody) sellBody.innerHTML = '';

    const marketDepth = data.marketDepth || {};
    const buyOrders = marketDepth.buyMarketDepthList || [];
    const sellOrders = marketDepth.sellMarketDepthList || [];

    // Check if there are no orders - Show 5 rows with 0 value
    if (buyOrders.length === 0 && sellOrders.length === 0) {
        renderEmptyRows(buyBody, "positive");
        renderEmptyRows(sellBody, "negative");
        updateTotals(0, 0);
        return;
    }

    // Render Buy Orders
    buyOrders.slice(0, 5).forEach(order => {
        if (buyBody) {
            buyBody.innerHTML += `
                <tr>
                    <td>${order.orderCount || 1}</td>
                    <td class="value-cell right">${(order.quantity || 0).toLocaleString()}</td>
                    <td class="value-cell right positive">${(order.orderBookOrderPrice || 0).toLocaleString()}</td>
                </tr>
            `;
        }
    });

    // Handle missing rows if less than 5
    if (buyOrders.length < 5) {
        for (let i = buyOrders.length; i < 5; i++) {
            buyBody.innerHTML += `<tr><td>0</td><td class="right">0</td><td class="right positive">0</td></tr>`;
        }
    }

    // Render Sell Orders
    sellOrders.slice(0, 5).forEach(order => {
        if (sellBody) {
            sellBody.innerHTML += `
                <tr>
                    <td>${order.orderCount || 1}</td>
                    <td class="value-cell right">${(order.quantity || 0).toLocaleString()}</td>
                    <td class="value-cell right negative">${(order.orderBookOrderPrice || 0).toLocaleString()}</td>
                </tr>
            `;
        }
    });

    // Handle missing rows if less than 5
    if (sellOrders.length < 5) {
        for (let i = sellOrders.length; i < 5; i++) {
            sellBody.innerHTML += `<tr><td>0</td><td class="right">0</td><td class="right negative">0</td></tr>`;
        }
    }

    const totalBuy = data.totalBuyQty || buyOrders.reduce((acc, current) => acc + (current.quantity || 0), 0);
    const totalSell = data.totalSellQty || sellOrders.reduce((acc, current) => acc + (current.quantity || 0), 0);
    updateTotals(totalBuy, totalSell);
}

function updateTotals(totalBuy, totalSell) {
    const buyQtyEl = document.getElementById('total-buy-qty');
    const sellQtyEl = document.getElementById('total-sell-qty');

    if (buyQtyEl) buyQtyEl.innerText = totalBuy.toLocaleString();
    if (sellQtyEl) sellQtyEl.innerText = totalSell.toLocaleString();
}

function renderEmptyRows(container, colorClass) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        container.innerHTML += `
            <tr>
                <td>0</td>
                <td class="value-cell right">0</td>
                <td class="value-cell right ${colorClass}">0</td>
            </tr>
        `;
    }
}

function handleSearch() {
    const input = document.getElementById('symbol-input');
    const symbol = input ? input.value.trim() : "";
    if (symbol) {
        fetchMarketDepth(symbol);
    }
}

// Initial fetch if needed or handle from query param
window.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('symbol-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const symbol = urlParams.get('symbol');
    if (symbol) {
        const input = document.getElementById('symbol-input');
        if (input) input.value = symbol.toUpperCase();
        fetchMarketDepth(symbol);
    } else {
        // Show empty rows on initial load
        renderEmptyRows(document.getElementById('buy-orders'), "positive");
        renderEmptyRows(document.getElementById('sell-orders'), "negative");
    }
});

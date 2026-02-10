// Configuration
const UPDATE_INTERVAL = 5000; // 5 seconds
const SCROLL_DURATION = 120; // 120 seconds for one full cycle (slower scrolling)

// State
let stockData = [];
let tickerUpdateInterval = null;

// DOM Elements
const tickerScroll = document.getElementById('tickerScroll');

// Get change class
function getChangeClass(change) {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
}

// Format price change
function formatChange(change) {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
}

// Create ticker item HTML
function createTickerItem(symbol, price, change) {
    const changeClass = getChangeClass(change);
    const changeText = formatChange(change);

    return `
    <div class="sticker-item">
        <span class="symbol">${symbol}</span>
        <span class="price">${price.toFixed(2)}</span>
        <span class="change ${changeClass}">${changeText}</span>
    </div>
    `;
}

// Update stock prices from API data
function updateStockPrices(apiData) {
    // If we have no data yet, initialize
    if (stockData.length === 0) {
        apiData.forEach(stock => {
            stockData.push({
                symbol: stock.symbol,
                price: stock.lastTradedPrice || stock.price || 0,
                change: stock.change || 0
            });
        });
    } else {
        // Update existing stock prices
        apiData.forEach(apiStock => {
            const existingStock = stockData.find(s => s.symbol === apiStock.symbol);
            if (existingStock) {
                const oldPrice = existingStock.price;
                const newPrice = apiStock.lastTradedPrice || apiStock.price || 0;

                if (oldPrice !== newPrice) {
                    existingStock.price = newPrice;
                    existingStock.change = apiStock.change || 0;

                    // Update all matching items in the DOM
                    updateTickerItemPrice(apiStock.symbol, newPrice, apiStock.change || 0);
                }
            } else {
                // Add new stock
                stockData.push({
                    symbol: apiStock.symbol,
                    price: apiStock.lastTradedPrice || apiStock.price || 0,
                    change: apiStock.change || 0
                });
            }
        });
    }
}

// Update individual ticker item in DOM
function updateTickerItemPrice(symbol, price, change) {
    const items = tickerScroll.querySelectorAll('.sticker-item');
    items.forEach(item => {
        const itemSymbol = item.querySelector('.symbol').textContent;
        if (itemSymbol === symbol) {
            const priceEl = item.querySelector('.price');
            const changeEl = item.querySelector('.change');
            const changeClass = getChangeClass(change);
            const changeText = formatChange(change);

            priceEl.textContent = price.toFixed(2);
            changeEl.className = `change ${changeClass}`;
            changeEl.textContent = changeText;
        }
    });
}

// Render ticker items
function renderTicker() {
    if (stockData.length === 0) {
        tickerScroll.innerHTML = '<div class="loading">No stock data available</div>';
        return;
    }

    // Show ALL stocks
    const displayStocks = stockData;

    // Clear existing content
    tickerScroll.innerHTML = '';

    // Create enough items to fill the screen twice for seamless scrolling
    // We append the list twice to create a seamless loop
    const createItems = (stocks) => {
        return stocks.map(stock => createTickerItem(stock.symbol, stock.price, stock.change)).join('');
    };

    const itemsHTML = createItems(displayStocks);
    tickerScroll.innerHTML = itemsHTML + itemsHTML; // Double the items for seamless loop

    // Update animation duration using CSS variable for better control
    const totalWidth = displayStocks.length * 180;
    const duration = Math.max(SCROLL_DURATION, totalWidth / 50);
    tickerScroll.style.setProperty('--ticker-duration', `${duration}s`);
}

// Fetch live stock data
async function fetchLiveStocks() {
    try {
        if (!window.apiService) return [];
        const res = await apiService.getLiveNepseData();

        // Extract stocks from the response
        if (res && res.data) {
            // apiService ensures res.data is an array
            return res.data.filter(item =>
                item &&
                item.symbol &&
                (item.lastTradedPrice || item.price)
            ).map(stock => ({
                symbol: stock.symbol,
                price: parseFloat(stock.lastTradedPrice || stock.price || 0),
                change: parseFloat(stock.change || 0)
            }));
        }

        return [];
    } catch (error) {
        console.log('Error fetching stocks:', error.message);
        return [];
    }
}

// Update ticker data
async function updateTickerData() {
    const liveStocks = await fetchLiveStocks();
    if (liveStocks.length === 0) {
        if (stockData.length === 0) {
            tickerScroll.innerHTML = '<div class="loading">Waiting for stock data...</div>';
        }
        return;
    }

    // Store whether we need to re-render completely
    const needsFullRender = stockData.length === 0;

    updateStockPrices(liveStocks);

    if (needsFullRender) {
        renderTicker();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if smartRefresh is available
    if (window.smartRefresh) {
        window.smartRefresh.register('ticker-data', updateTickerData, UPDATE_INTERVAL, true);
        console.log('Ticker: Using Smart Refresh (market-hours only)');
    } else {
        // Fallback: Manual auto-update
        tickerUpdateInterval = setInterval(updateTickerData, UPDATE_INTERVAL);
        updateTickerData();
        console.log('Ticker: Using manual refresh (always on)');
    }
});


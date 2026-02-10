/**
 * Heatmap Page Logic
 * Built for NEPSE Dashboard - Premium Trader Experience
 */

// State
let rawData = [];
let filteredData = [];
let currentTab = 'turnover'; // 'turnover' or 'volume'
let currentSector = 'all';
let colorMode = 'absolute'; // 'absolute' or 'relative'

// DOM Elements
const heatmapContainer = document.getElementById('heatmap-container');
const sectorFilter = document.getElementById('sectorFilter');
const tabBtns = document.querySelectorAll('.tab-btn[data-type]');
const modeBtns = document.querySelectorAll('.mode-btn');
const tooltip = document.getElementById('heatmap-tooltip');
const legendContainer = document.getElementById('heatmap-legend');

/**
 * Initialize Heatmap
 */
async function initHeatmap() {
    try {
        console.log('Heatmap initializing...');
        showLoading();
        
        // Check for URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const sectorParam = urlParams.get('sector');
        if (sectorParam) {
            currentSector = sectorParam;
            if (sectorFilter) sectorFilter.value = sectorParam;
        }

        // Setup base listeners first so UI is responsive
        setupEventListeners();
        
        // Initial data fetch and render handled by fetchAndRender
        
        // Use Smart Refresh Manager if available, otherwise fallback to manual
        if (window.smartRefresh) {
            window.smartRefresh.register('market-heatmap', fetchAndRender, 30000, true);
            console.log('Heatmap: Using Smart Refresh (market-hours only)');
        } else {
            // Fallback: Manual auto-update
            fetchAndRender();
            setInterval(fetchAndRender, 30000);
            console.log('Heatmap: Using manual refresh (always on)');
        }
        
    } catch (error) {
        console.error('Heatmap Init Error:', error);
        if (typeof ErrorHandler !== 'undefined') {
            ErrorHandler.handleApiError(error, 'initialize heatmap');
        } else {
            heatmapContainer.innerHTML = `<div class="error-state">
                <i class="fa-solid fa-circle-exclamation"></i>
                <p class="error-message">Failed to load market data. Please try again later.</p>
                <button class="retry-btn" onclick="location.reload()">
                    <i class="fa-solid fa-rotate"></i> Retry Load
                </button>
            </div>`;
        }
    }
}

/**
 * Fetch and Render (called by refresh)
 */
async function fetchAndRender() {
    try {
        await fetchData();
        renderHeatmap();
        console.log('Heatmap updated with live data');
    } catch (error) {
        console.warn('Silent refresh failed:', error);
    }
}

/**
 * Fetch and Normalize Data
 */
async function fetchData() {
    try {
        const response = await apiService.getLiveNepseData();
        if (response && response.success && response.data) {
            
            // 1. Basic Normalization
            rawData = response.data.map(item => ({
                symbol: item.symbol,
                name: item.securityName,
                sector: item.sector,
                price: parseFloat(item.lastTradedPrice) || 0,
                change: parseFloat(item.change) || 0,
                percentChange: parseFloat(item.percentageChange) || 0,
                volume: parseFloat(item.totalTradeQuantity) || 0,
                turnover: parseFloat(item.totalTradeValue) || 0,
                prevClose: parseFloat(item.previousClose) || 0
            }));

            // 2. Calculate Sector Averages
            const sectorSums = {};
            const sectorCounts = {};

            rawData.forEach(stock => {
                if (!sectorSums[stock.sector]) {
                    sectorSums[stock.sector] = 0;
                    sectorCounts[stock.sector] = 0;
                }
                // Only include valid trades in average to avoid skewing
                if (stock.price > 0) {
                    sectorSums[stock.sector] += stock.percentChange;
                    sectorCounts[stock.sector]++;
                }
            });

            // 3. Compute Relative Strength
            rawData.forEach(stock => {
                const count = sectorCounts[stock.sector] || 1;
                const sectorAvg = sectorSums[stock.sector] / count;
                
                stock.sectorAvgChange = sectorAvg;
                stock.relativeStrength = stock.percentChange - sectorAvg;
            });

            // Populate Sectors if first load
            if (sectorFilter.options.length <= 1) {
                const uniqueSectors = [...new Set(rawData.map(d => d.sector))].sort();
                const sectors = ['all', ...uniqueSectors];
                
                sectorFilter.innerHTML = sectors.map(s => 
                    `<option value="${s}">${s === 'all' ? 'All Sectors' : s}</option>`
                ).join('');

                // Ensure the selection matches state (fix for 'Commercial Banks' appearing instead of 'All Sectors')
                sectorFilter.value = currentSector;
            }
            
            filterAndSortData();
        } else {
            throw new Error('Invalid API response');
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Filter and Sort Data
 */
function filterAndSortData() {
    filteredData = rawData.filter(d => 
        (currentSector === 'all' || d.sector === currentSector) &&
        (currentTab === 'turnover' ? d.turnover > 0 : d.volume > 0)
    );

    // Sort by activity descending for logical placement
    const key = currentTab;
    filteredData.sort((a, b) => b[key] - a[key]);
}

/**
 * Render Heatmap using D3.js
 */
function renderHeatmap() {
    if (!filteredData.length) {
        heatmapContainer.innerHTML = '<div class="error-state"><p class="text-muted">No matching company data found for this view.</p></div>';
        return;
    }

    updateUIHints();

    const width = heatmapContainer.clientWidth;
    const height = heatmapContainer.clientHeight;

    // Clear previous
    d3.select('#heatmap-container').selectAll('*').remove();

    const svg = d3.select('#heatmap-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create hierarchy
    let hierarchyData;
    if (currentSector === 'all') {
        const groups = d3.group(filteredData, d => d.sector);
        const children = Array.from(groups, ([key, value]) => ({ 
            name: key, 
            children: value 
        }));
        hierarchyData = { name: 'root', children: children };
    } else {
        hierarchyData = { name: 'root', children: filteredData };
    }

    const root = d3.hierarchy(hierarchyData)
        .sum(d => currentTab === 'turnover' ? d.turnover : d.volume)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([width, height])
        .paddingOuter(2)
        .paddingTop(d => d.depth === 1 ? 20 : 0) // Label space for sectors
        .paddingInner(1)
        .round(true)(root);

    // Sector Groups (only if all sectors)
    if (currentSector === 'all') {
        svg.selectAll('.sector-label')
            .data(root.children)
            .enter()
            .append('text')
            .attr('x', d => d.x0 + 5)
            .attr('y', d => d.y0 + 14)
            .attr('class', 'sector-label')
            .style('fill', 'var(--text-muted)')
            .style('font-size', '10px')
            .style('font-weight', '600')
            .text(d => {
                const w = d.x1 - d.x0;
                return w > 80 ? d.data.name : '';
            });
    }

    // Sector Summary Logic
    updateSectorSummary();

    const nodes = svg.selectAll('.leaf')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)
        .attr('class', 'treemap-node')
        .on('mousemove', showTooltip)
        .on('mouseout', hideTooltip);

    nodes.append('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => getColor(d.data))
        .attr('rx', 2);

    nodes.append('text')
        .attr('x', d => (d.x1 - d.x0) / 2)
        .attr('y', d => (d.y1 - d.y0) / 2)
        .attr('text-anchor', 'middle')
        .attr('class', 'symbol-text')
        .text(d => {
            const w = d.x1 - d.x0;
            const h = d.y1 - d.y0;
            return (w > 35 && h > 20) ? d.data.symbol : '';
        });

    nodes.append('text')
        .attr('x', d => (d.x1 - d.x0) / 2)
        .attr('y', d => ((d.y1 - d.y0) / 2) + 12)
        .attr('text-anchor', 'middle')
        .attr('class', 'change-text')
        .text(d => {
            const w = d.x1 - d.x0;
            const h = d.y1 - d.y0;
            // Show different value based on mode
            const val = colorMode === 'absolute' 
                ? d.data.percentChange 
                : d.data.relativeStrength;
            
            return (w > 50 && h > 40) ? `${val > 0 ? '+' : ''}${val.toFixed(2)}%` : '';
        });
}

/**
 * Color Logic based on Mode
 */
function getColor(data) {
    const value = colorMode === 'absolute' ? data.percentChange : data.relativeStrength;
    
    // Diverging Color Intepolation could be used here for smoother gradients,
    // but distinct buckets are often better for quick readability in trading.
    
    if (value > 3) return 'var(--heatmap-strong-pos)';
    if (value > 0.5) return 'var(--heatmap-mild-pos)';
    if (value < -3) return 'var(--heatmap-strong-neg)';
    if (value < -0.5) return 'var(--heatmap-mild-neg)';
    return 'var(--heatmap-neutral)';
}

/**
 * Update Sector Summary Header
 */
function updateSectorSummary() {
    const summaryContainer = document.getElementById('sector-summary');
    
    if (currentSector === 'all') {
        summaryContainer.classList.add('hidden');
        return;
    }

    // Calculate stats for current sector view
    const sectorStocks = filteredData;
    const avgChange = sectorStocks.reduce((sum, s) => sum + s.percentChange, 0) / sectorStocks.length;
    
    const leaders = sectorStocks.filter(s => s.relativeStrength > 0).length;
    const laggards = sectorStocks.filter(s => s.relativeStrength < 0).length;

    summaryContainer.innerHTML = `
        <span style="font-weight: 700; color: var(--accent-primary);">${currentSector}</span>
        <span style="width: 1px; height: 14px; background: var(--border-color);"></span>
        <span class="text-muted">Avg Change:</span>
        <span class="${avgChange >= 0 ? 'success' : 'danger'}" style="font-weight: 600;">
            ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}%
        </span>
        <span style="width: 1px; height: 14px; background: var(--border-color);"></span>
        <span class="text-muted">Leaders: <strong style="color: var(--text-primary)">${leaders}</strong></span>
        <span class="text-muted" style="margin-left: 10px;">Laggards: <strong style="color: var(--text-primary)">${laggards}</strong></span>
    `;
    
    summaryContainer.classList.remove('hidden');
}

/**
 * Update UI Hints and Legend
 */
function updateUIHints() {
    // Update Mode Hint
    const hintEl = document.getElementById('mode-hint');
    if (hintEl) {
        hintEl.textContent = colorMode === 'absolute' 
            ? 'Shows raw price movement' 
            : 'Highlights sector leaders & laggards';
    }

    // Update Legend Title
    const legendTitle = document.getElementById('legend-title');
    if (legendTitle) {
        legendTitle.textContent = colorMode === 'absolute'
            ? 'Color: % Price Change'
            : 'Color: Performance vs Sector Average';
    }
}


/**
 * Tooltip Logic
 */
function showTooltip(event, d) {
    const data = d.data;
    const formatValue = (val) => new Intl.NumberFormat('en-IN').format(val);
    
    tooltip.innerHTML = `
        <div class="tooltip-header">
            <strong>${data.symbol}</strong><br/>
            <small style="opacity: 0.8">${data.name}</small>
        </div>
        <div class="tooltip-row">
            <span>Sector:</span>
            <span class="tooltip-val">${data.sector}</span>
        </div>
        <div class="tooltip-row">
            <span>Last Price:</span>
            <span class="tooltip-val">Rs. ${formatValue(data.price)}</span>
        </div>
        <div class="tooltip-row">
            <span>Absolute Change:</span>
            <span class="tooltip-val ${data.change >= 0 ? 'success' : 'danger'}">
                ${data.change >= 0 ? '+' : ''}${data.change} (${data.percentChange.toFixed(2)}%)
            </span>
        </div>
        <div class="tooltip-row" style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px;">
            <span>Sector Avg:</span>
            <span class="tooltip-val">${data.sectorAvgChange > 0 ? '+' : ''}${data.sectorAvgChange.toFixed(2)}%</span>
        </div>
        <div class="tooltip-row">
            <span>Rel. Strength:</span>
            <span class="tooltip-val ${data.relativeStrength >= 0 ? 'success' : 'danger'}">
                ${data.relativeStrength > 0 ? '+' : ''}${data.relativeStrength.toFixed(2)}%
            </span>
        </div>
        <div class="tooltip-row" style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px;">
            <span>Turnover:</span>
            <span class="tooltip-val">Rs. ${formatValue(data.turnover)}</span>
        </div>
        <div class="tooltip-row">
            <span>Volume:</span>
            <span class="tooltip-val">${formatValue(data.volume)}</span>
        </div>
    `;

    tooltip.classList.remove('hidden');
    
    // Position tooltip
    const x = event.pageX + 15;
    const y = event.pageY + 15;
    
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = x;
    let top = y;
    
    if (x + tooltipRect.width > viewportWidth) left = event.pageX - tooltipRect.width - 15;
    if (y + tooltipRect.height > viewportHeight) top = event.pageY - tooltipRect.height - 15;
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

function hideTooltip() {
    tooltip.classList.add('hidden');
}

/**
 * Events and Interactivity
 */
function setupEventListeners() {
    sectorFilter.addEventListener('change', (e) => {
        currentSector = e.target.value;
        filterAndSortData();
        renderHeatmap();
    });

    // Turnover/Volume Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.type;
            filterAndSortData();
            renderHeatmap();
        });
    });

    // Color Mode Tabs (Absolute/Relative)
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            colorMode = btn.dataset.mode;
            renderHeatmap(); // No need to re-sort/filter, just re-color
        });
    });

    window.addEventListener('resize', debounce(() => {
        renderHeatmap();
    }, 250));
}

function showLoading() {
    heatmapContainer.innerHTML = `
        <div class="flex items-center column justify-center w-100 h-100" style="min-height: 400px;">
            <div class="shimmer" style="width: 80%; height: 60%; border-radius: 8px;"></div>
            <p class="mt-14 text-muted">Analyzing market flow...</p>
        </div>
    `;
}

/**
 * Utility: Debounce for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure global scripts are ready
    setTimeout(initHeatmap, 100);
});

// Chart instance
let chartInstance = null;
let currentTimePeriod = '1D';
const REFRESH_INTERVAL = 30000; // 30 seconds
let refreshTimer = null;


// DOM Elements
const chartCanvas = document.getElementById('marketChart');
const chartPlaceholder = document.getElementById('chartPlaceholder');
const timeButtons = document.querySelectorAll('.time-btn');

// Check if time is between 11:00 AM and 3:00 PM (11:00-15:00 in 24hr format)
function isTradingHours(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Convert to decimal hours for easier comparison
    const decimalTime = hours + (minutes / 60);

    // Return true if between 11:00 AM (11.00) and 3:00 PM (15.00)
    return decimalTime >= 11.00 && decimalTime <= 15.00;
}

// Format date for display
function formatDate(timestamp, dateString, is1D = false) {
    if (is1D) {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        const date = new Date(dateString);
        if (currentTimePeriod === '1W') {
            return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: currentTimePeriod === '1Y' ? 'numeric' : undefined });
        }
    }
}

// Process 1D data (array format) - Filtered for trading hours
function process1DData(apiData) {
    if (!Array.isArray(apiData)) {
        throw new Error('1D data should be an array');
    }

    const dataPoints = [];

    // Process each [timestamp, value] pair
    apiData.forEach(item => {
        const timestamp = item[0]; // Already in seconds
        const close = item[1];

        // Only include data points from 11:00 AM to 3:00 PM if it's 1D, 
        // but for DhanWeb API we might want all if they are already pre-filtered or during market hours
        dataPoints.push({
            timestamp: timestamp,
            time: formatDate(timestamp, null, true),
            value: close,
            date: new Date(timestamp * 1000).toISOString().split('T')[0]
        });
    });

    return dataPoints;
}

// Process weekly/monthly/yearly data (object format)
function processLongTermData(apiData) {
    if (!apiData.success || !Array.isArray(apiData.data)) {
        throw new Error('Invalid long-term data format');
    }

    const dataPoints = [];

    // Process each data object
    apiData.data.forEach(item => {
        const date = item.date;
        const value = item.value;

        // Convert date to timestamp (set to noon for consistency)
        const timestamp = Math.floor(new Date(date + 'T12:00:00').getTime() / 1000);

        dataPoints.push({
            timestamp: timestamp,
            time: formatDate(null, date),
            close: value,
            value: value,
            date: date,
            turnover: item.turnover,
            volume: item.volume,
            sharesTraded: item.sharesTraded
        });
    });

    // Sort by date (oldest first)
    dataPoints.sort((a, b) => a.timestamp - b.timestamp);

    return dataPoints;
}

// Process chart data based on time period
function processChartData(apiData, timePeriod) {
    if (timePeriod === '1D') {
        return process1DData(apiData);
    } else {
        return processLongTermData(apiData);
    }
}

// Show loading state
function showLoading() {
    chartPlaceholder.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading ${currentTimePeriod} chart data...</p>
        </div>
    `;
    chartPlaceholder.style.display = 'flex';
    chartCanvas.style.display = 'none';
}

// Show error state
function showError(message) {
    chartPlaceholder.innerHTML = `
        <div>
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <p style="margin-top: 10px; font-size: 10px;">Please try again</p>
        </div>
    `;
    chartPlaceholder.style.display = 'flex';
    chartCanvas.style.display = 'none';
}

// Create or update chart
function createChart(chartData) {
    // Destroy existing chart
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Prepare data for Chart.js
    const labels = chartData.map(point => point.time);
    const prices = chartData.map(point => point.value);

    // FIXED COLORS:
    const isUp = prices[prices.length - 1] >= prices[0];
    const lineColor = isUp ? '#22c55e' : '#ef4444'; // Green if up, Red if down
    const backgroundColor = isUp ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';

    // Get chart context
    const ctx = chartCanvas.getContext('2d');

    // Create gradient for area under line
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, backgroundColor);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // Create enhanced chart
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'NEPSE Index',
                data: prices,
                borderColor: lineColor,
                backgroundColor: gradient,
                borderWidth: 1.5,
                fill: true,
                tension: 0.1, // Smooth lines
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHitRadius: 10,
                pointHoverBackgroundColor: lineColor,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 10,
                    bottom: 0
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#94a3b8',
                    bodyColor: '#f8fafc',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return `Value: ${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: { size: 10 },
                        autoSkip: true,
                        maxTicksLimit: 6,
                        maxRotation: 0
                    }
                },
                y: {
                    position: 'right',
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: { size: 10 },
                        padding: 10,
                        callback: function (value) {
                            return value.toFixed(0);
                        }
                    }
                }
            }
        }
    });

    // Show chart, hide placeholder
    chartCanvas.style.display = 'block';
    chartPlaceholder.style.display = 'none';
}

// Load chart data
async function loadChartData(timePeriod, isRefresh = false) {
  try {
    if (!isRefresh) {
      showLoading();
      timeButtons.forEach(btn => btn.disabled = true);
    }


    const apiData = await apiService.getChartData(timePeriod);
    const chartData = processChartData(apiData, timePeriod);
    
    if (!chartData || chartData.length === 0) {
      throw new Error('No chart data available');
    }
    
    createChart(chartData);
    
  } catch (error) {
    console.error('Error loading chart:', error);
    
    ErrorHandler.showError(chartPlaceholder, 
      `Failed to load ${timePeriod} chart: ${error.message}`,
      () => {
        loadChartData(timePeriod);
      }
    );
    
  } finally {
    if (!isRefresh) {
      timeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.time === timePeriod);
        btn.disabled = false;
      });
    }
    
    // Always update current time period
    currentTimePeriod = timePeriod;
    
    // Start/Restart auto-refresh
    startAutoRefresh(timePeriod);
  }
}

// Start auto-refresh timer
function startAutoRefresh(timePeriod) {
    // Clear existing timer
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }

    // Only auto-refresh for 1D chart during market hours or as per user request
    // For now, let's keep it simple and refresh if it's 1D
    if (timePeriod === '1D') {
        refreshTimer = setInterval(() => {
            console.log(`Auto-refreshing ${timePeriod} chart...`);
            loadChartData(timePeriod, true);
        }, REFRESH_INTERVAL);
    }
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Setup time button events
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const timePeriod = button.dataset.time;
            if (timePeriod !== currentTimePeriod) {
                loadChartData(timePeriod);
            }
        });
    });


    // Load initial data (1D)
    loadChartData('1D');
});
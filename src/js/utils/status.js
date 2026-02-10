/**
 * status.js
 * Common logic for Work in Progress / Under Development pages
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initial data fetch for header
    updateHeaderData();
    setInterval(updateHeaderData, 60000);
});

async function updateHeaderData() {
    try {
        if (!window.apiService) return;
        
        // Use the common homepage data for header stats
        const data = await apiService.getMarketData();
        
        const nepse = data.indices?.find(i => i.name === 'NEPSE Index');
        if (nepse) {
            document.querySelector('.index-value').textContent = nepse.currentValue.toFixed(2);
            const diffEl = document.querySelector('.difference');
            diffEl.textContent = (nepse.change >= 0 ? '+' : '') + nepse.change.toFixed(2);
            document.querySelector('.percent-change').textContent = `(${nepse.changePercent.toFixed(2)}%)`;
            
            const colorClass = nepse.change >= 0 ? 'up' : 'down';
            document.getElementById('nepseData').className = `flex gap-10 items-baseline ${colorClass}`;
        }

        const summaryMap = {};
        data.marketSummary.forEach(item => {
            const name = item.name.toLowerCase();
            if (name.includes("total turnover")) summaryMap.turnover = item.value;
            else if (name.includes("total volume")) summaryMap.volume = item.value;
        });

        document.querySelector('.turnover').textContent = summaryMap.turnover ? `Rs ${summaryMap.turnover.toLocaleString()}` : '--';
        document.querySelector('.volume').textContent = summaryMap.volume ? summaryMap.volume.toLocaleString() : '--';
        
    } catch (error) {
        console.error("Error updating header:", error);
    }
}

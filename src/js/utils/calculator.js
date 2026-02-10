/**
 * NEPSE Broker Fee Calculator Logic
 */

const SEBON_FEE_RATE = 0.00015; // 0.015%
const DP_CHARGE = 25; // per transaction

function getBrokerCommission(amount) {
    if (amount <= 50000) return Math.max(10, amount * 0.0036);
    if (amount <= 500000) return amount * 0.0033;
    if (amount <= 2000000) return amount * 0.0031;
    if (amount <= 10000000) return amount * 0.0027;
    return amount * 0.0024;
}

function calculate() {
    const buyPrice = parseFloat(document.getElementById('buy-price').value || 0);
    const sellPrice = parseFloat(document.getElementById('sell-price').value || 0);
    const units = parseInt(document.getElementById('units').value || 0);
    const cgtRate = parseFloat(document.getElementById('cgt-type').value) / 100;

    if (buyPrice <= 0 || sellPrice <= 0 || units <= 0) return;

    // 1. BUY SIDE
    const buyBase = buyPrice * units;
    const buyComm = getBrokerCommission(buyBase);
    const buySebon = buyBase * SEBON_FEE_RATE;
    const totalBuyCost = buyBase + buyComm + buySebon + DP_CHARGE;

    // 2. SELL SIDE
    const sellBase = sellPrice * units;
    const sellComm = getBrokerCommission(sellBase);
    const sellSebon = sellBase * SEBON_FEE_RATE;
    const totalSellGross = sellBase - sellComm - sellSebon - DP_CHARGE;

    // 3. TAX (CGT)
    const grossProfit = totalSellGross - totalBuyCost;
    let tax = 0;
    if (grossProfit > 0) {
        tax = grossProfit * cgtRate;
    }

    const netProfit = grossProfit - tax;
    const profitPercentage = (netProfit / totalBuyCost) * 100;

    // UPDATE UI
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 2
    });

    document.getElementById('net-profit').textContent = formatter.format(netProfit);
    document.getElementById('net-profit').className = `value ${netProfit >= 0 ? 'value-success' : 'value-danger'}`;
    
    document.getElementById('buy-total').textContent = formatter.format(totalBuyCost);
    document.getElementById('sell-total').textContent = formatter.format(totalSellGross);
    document.getElementById('total-comm').textContent = formatter.format(buyComm + sellComm);
    document.getElementById('total-sebon').textContent = formatter.format(buySebon + sellSebon);
    document.getElementById('total-cgt').textContent = formatter.format(tax);

    const percentEl = document.getElementById('profit-percentage');
    percentEl.textContent = `${profitPercentage.toFixed(2)}%`;
    percentEl.className = `percentage-label ${netProfit >= 0 ? 'value-success' : 'value-danger'}`;

    const gaugeFill = document.getElementById('gauge-fill');
    const displayPercent = Math.min(100, Math.max(0, profitPercentage * 2)); // scale for visibility
    gaugeFill.style.width = `${displayPercent}%`;
    gaugeFill.style.backgroundColor = netProfit >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)';
}

document.getElementById('calculate-btn').addEventListener('click', calculate);

// Initial placeholder update
document.addEventListener('DOMContentLoaded', () => {
    // Add layout support if needed
});

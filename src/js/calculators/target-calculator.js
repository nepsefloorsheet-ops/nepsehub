/**
 * target-calculator.js
 * Professional Trading Calculators Suite
 */

// 1. Risk/Reward Calculator
function calculateRiskReward() {
    const entry = parseFloat(document.getElementById('rr-entry').value);
    const stop = parseFloat(document.getElementById('rr-stop').value);
    const target = parseFloat(document.getElementById('rr-target').value);
    const resultBox = document.getElementById('rr-result');

    if (!entry || !stop || !target) {
        resultBox.innerHTML = '<p class="error"><i class="fas fa-exclamation-circle"></i> Please fill all fields</p>';
        return;
    }

    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);
    const ratio = reward / risk;

    let ratingClass = 'neutral';
    let ratingText = 'Fair';
    if (ratio >= 3) {
        ratingClass = 'excellent';
        ratingText = 'Excellent';
    } else if (ratio >= 2) {
        ratingClass = 'good';
        ratingText = 'Good';
    } else if (ratio < 1.5) {
        ratingClass = 'poor';
        ratingText = 'Poor';
    }

    resultBox.innerHTML = `
        <div class="result-item">
            <span>Risk Amount:</span>
            <span class="negative">Rs ${risk.toFixed(2)}</span>
        </div>
        <div class="result-item">
            <span>Reward Amount:</span>
            <span class="positive">Rs ${reward.toFixed(2)}</span>
        </div>
        <div class="result-item highlight">
            <span>Risk/Reward Ratio:</span>
            <span class="${ratingClass}">1:${ratio.toFixed(2)} (${ratingText})</span>
        </div>
        <div class="result-note">
            <i class="fas fa-info-circle"></i> 
            ${ratio >= 2 ? 'This is a favorable trade setup.' : 'Consider adjusting your targets for better R:R.'}
        </div>
    `;
}

// 2. Position Sizing Calculator
function calculatePositionSize() {
    const account = parseFloat(document.getElementById('ps-account').value);
    const riskPct = parseFloat(document.getElementById('ps-risk').value);
    const entry = parseFloat(document.getElementById('ps-entry').value);
    const stop = parseFloat(document.getElementById('ps-stop').value);
    const resultBox = document.getElementById('ps-result');

    if (!account || !riskPct || !entry || !stop) {
        resultBox.innerHTML = '<p class="error"><i class="fas fa-exclamation-circle"></i> Please fill all fields</p>';
        return;
    }

    const riskAmount = account * (riskPct / 100);
    const riskPerShare = Math.abs(entry - stop);
    const quantity = Math.floor(riskAmount / riskPerShare);
    const totalCost = quantity * entry;
    const actualRisk = quantity * riskPerShare;

    resultBox.innerHTML = `
        <div class="result-item">
            <span>Risk Amount:</span>
            <span class="negative">Rs ${riskAmount.toFixed(2)}</span>
        </div>
        <div class="result-item">
            <span>Risk Per Share:</span>
            <span>Rs ${riskPerShare.toFixed(2)}</span>
        </div>
        <div class="result-item highlight">
            <span>Recommended Quantity:</span>
            <span class="positive">${quantity} shares</span>
        </div>
        <div class="result-item">
            <span>Total Investment:</span>
            <span>Rs ${totalCost.toLocaleString()}</span>
        </div>
        <div class="result-item">
            <span>Actual Risk:</span>
            <span class="negative">Rs ${actualRisk.toFixed(2)}</span>
        </div>
        <div class="result-note">
            <i class="fas fa-info-circle"></i> 
            This position size keeps your risk at ${riskPct}% of your account.
        </div>
    `;
}

// 3. Fibonacci Extension Calculator
function calculateFibonacci() {
    const low = parseFloat(document.getElementById('fib-low').value);
    const high = parseFloat(document.getElementById('fib-high').value);
    const retrace = parseFloat(document.getElementById('fib-retrace').value);
    const resultBox = document.getElementById('fib-result');

    if (!low || !high || !retrace) {
        resultBox.innerHTML = '<p class="error"><i class="fas fa-exclamation-circle"></i> Please fill all fields</p>';
        return;
    }

    const range = high - low;
    const levels = {
        '1.272': retrace + (range * 1.272),
        '1.414': retrace + (range * 1.414),
        '1.618': retrace + (range * 1.618),
        '2.0': retrace + (range * 2.0),
        '2.618': retrace + (range * 2.618)
    };

    resultBox.innerHTML = `
        <div class="fib-levels">
            <div class="result-item">
                <span>Fib 1.272:</span>
                <span class="positive">Rs ${levels['1.272'].toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span>Fib 1.414:</span>
                <span class="positive">Rs ${levels['1.414'].toFixed(2)}</span>
            </div>
            <div class="result-item highlight">
                <span>Fib 1.618 (Golden):</span>
                <span class="excellent">Rs ${levels['1.618'].toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span>Fib 2.0:</span>
                <span class="positive">Rs ${levels['2.0'].toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span>Fib 2.618:</span>
                <span class="positive">Rs ${levels['2.618'].toFixed(2)}</span>
            </div>
        </div>
        <div class="result-note">
            <i class="fas fa-info-circle"></i> 
            The 1.618 level (Golden Ratio) is the most commonly watched target.
        </div>
    `;
}

// 4. Multiple Target Levels
function calculateMultipleTargets() {
    const entry = parseFloat(document.getElementById('mt-entry').value);
    const stop = parseFloat(document.getElementById('mt-stop').value);
    const resultBox = document.getElementById('mt-result');

    if (!entry || !stop) {
        resultBox.innerHTML = '<p class="error"><i class="fas fa-exclamation-circle"></i> Please fill all fields</p>';
        return;
    }

    const risk = Math.abs(entry - stop);
    const targets = {
        conservative: entry + (risk * 1.5),
        moderate: entry + (risk * 2),
        aggressive: entry + (risk * 3)
    };

    resultBox.innerHTML = `
        <div class="result-item">
            <span>Conservative (1:1.5):</span>
            <span class="positive">Rs ${targets.conservative.toFixed(2)}</span>
        </div>
        <div class="result-item highlight">
            <span>Moderate (1:2):</span>
            <span class="good">Rs ${targets.moderate.toFixed(2)}</span>
        </div>
        <div class="result-item">
            <span>Aggressive (1:3):</span>
            <span class="excellent">Rs ${targets.aggressive.toFixed(2)}</span>
        </div>
        <div class="result-note">
            <i class="fas fa-lightbulb"></i> 
            <strong>Strategy:</strong> Exit 50% at moderate target, trail stop for remainder.
        </div>
    `;
}

// 5. Stop-Loss Optimizer
function calculateStopLoss() {
    const entry = parseFloat(document.getElementById('sl-entry').value);
    const atr = parseFloat(document.getElementById('sl-atr').value);
    const support = parseFloat(document.getElementById('sl-support').value);
    const resultBox = document.getElementById('sl-result');

    if (!entry) {
        resultBox.innerHTML = '<p class="error"><i class="fas fa-exclamation-circle"></i> Please enter entry price</p>';
        return;
    }

    let html = '<div class="sl-options">';

    // Percentage-based stops
    const pct2 = entry * 0.98;
    const pct3 = entry * 0.97;
    const pct5 = entry * 0.95;

    html += `
        <div class="result-item">
            <span>2% Stop:</span>
            <span>Rs ${pct2.toFixed(2)}</span>
        </div>
        <div class="result-item">
            <span>3% Stop:</span>
            <span>Rs ${pct3.toFixed(2)}</span>
        </div>
        <div class="result-item">
            <span>5% Stop:</span>
            <span>Rs ${pct5.toFixed(2)}</span>
        </div>
    `;

    // ATR-based stop
    if (atr) {
        const atr1x = entry - atr;
        const atr2x = entry - (atr * 2);
        html += `
            <div class="result-item highlight">
                <span>ATR 1x Stop:</span>
                <span class="good">Rs ${atr1x.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span>ATR 2x Stop:</span>
                <span>Rs ${atr2x.toFixed(2)}</span>
            </div>
        `;
    }

    // Support-based stop
    if (support) {
        const supportStop = support * 0.99; // 1% below support
        html += `
            <div class="result-item highlight">
                <span>Support-Based:</span>
                <span class="excellent">Rs ${supportStop.toFixed(2)}</span>
            </div>
        `;
    }

    html += '</div>';
    html += `
        <div class="result-note">
            <i class="fas fa-info-circle"></i> 
            ${atr ? 'ATR-based stops adapt to volatility.' : 'Add ATR value for volatility-adjusted stops.'}
        </div>
    `;

    resultBox.innerHTML = html;
}

// 6. Break-even Calculator
function calculateBreakeven() {
    const entry = parseFloat(document.getElementById('be-entry').value);
    const quantity = parseInt(document.getElementById('be-quantity').value);
    const commission = parseFloat(document.getElementById('be-commission').value) || 0.4;
    const resultBox = document.getElementById('be-result');

    if (!entry || !quantity) {
        resultBox.innerHTML = '<p class="error"><i class="fas fa-exclamation-circle"></i> Please fill all fields</p>';
        return;
    }

    const totalCost = entry * quantity;
    const buyCommission = totalCost * (commission / 100);
    const totalBuyCost = totalCost + buyCommission;

    // To break even, sell price must cover buy cost + sell commission
    // sellPrice * quantity * (1 - commission/100) = totalBuyCost
    const breakEvenPrice = totalBuyCost / (quantity * (1 - commission / 100));
    const minProfit = breakEvenPrice - entry;
    const minProfitPct = (minProfit / entry) * 100;

    resultBox.innerHTML = `
        <div class="result-item">
            <span>Total Buy Cost:</span>
            <span>Rs ${totalBuyCost.toLocaleString()}</span>
        </div>
        <div class="result-item">
            <span>Buy Commission:</span>
            <span class="negative">Rs ${buyCommission.toFixed(2)}</span>
        </div>
        <div class="result-item highlight">
            <span>Break-even Price:</span>
            <span class="excellent">Rs ${breakEvenPrice.toFixed(2)}</span>
        </div>
        <div class="result-item">
            <span>Min Profit Required:</span>
            <span class="positive">Rs ${minProfit.toFixed(2)} (${minProfitPct.toFixed(2)}%)</span>
        </div>
        <div class="result-note">
            <i class="fas fa-info-circle"></i> 
            You need at least ${minProfitPct.toFixed(2)}% gain to break even after commissions.
        </div>
    `;
}

// Auto-calculate on Enter key
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const card = input.closest('.calc-card');
                const button = card.querySelector('.calc-btn');
                if (button) button.click();
            }
        });
    });
});

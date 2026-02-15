/**
 * NEPSE Margin Trading Calculator
 * Logic to calculate purchase costs, interest, sale proceeds, and P/L with margin rules.
 */

const MarginCalculator = (() => {
    // DOM Elements - Inputs
    const unitsInput = document.getElementById('units');
    const buyPriceInput = document.getElementById('buy-price');
    const sellPriceInput = document.getElementById('sell-price');
    const holdingDaysInput = document.getElementById('holding-days');
    const interestRateInput = document.getElementById('interest-rate');

    // DOM Elements - Outputs
    const grossBuyEl = document.getElementById('gross-buy');
    const buyFeesEl = document.getElementById('buy-fees');
    const totalBuyCostEl = document.getElementById('total-buy-cost');
    const userInvestmentEl = document.getElementById('user-investment');
    const brokerLoanEl = document.getElementById('broker-loan');
    const accruedInterestEl = document.getElementById('accrued-interest');
    const grossSellEl = document.getElementById('gross-sell');
    const sellFeesEl = document.getElementById('sell-fees');
    const netSellEl = document.getElementById('net-sell');
    const pnlValueEl = document.getElementById('pnl-value');
    const roiValueEl = document.getElementById('roi-value');
    const statusCard = document.getElementById('status-card');

    // Constants
    const SEBON_FEE_RATE = 0.00015; // 0.015%
    const DP_CHARGE = 25;
    const MARGIN_PERCENT = 0.30; // 30% User Margin

    /**
     * NEPSE Brokerage Slab Detection
     * @param {number} amount - Transaction amount
     * @returns {number} commission amount
     */
    function calculateCommission(amount) {
        if (amount <= 0) return 0;
        if (amount <= 50000) {
            return Math.max(10, amount * 0.0036);
        } else if (amount <= 500000) {
            return amount * 0.0033;
        } else if (amount <= 2000000) {
            return amount * 0.0031;
        } else if (amount <= 10000000) {
            return amount * 0.0027;
        } else {
            return amount * 0.0024;
        }
    }

    /**
     * Formats number to NPR currency format with commas
     */
    function formatCurrency(num) {
        return "Rs. " + new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }

    function calculate() {
        // Read Inputs
        const units = Math.max(0, parseInt(unitsInput.value) || 0);
        const buyPrice = Math.max(0, parseFloat(buyPriceInput.value) || 0);
        const sellPrice = Math.max(0, parseFloat(sellPriceInput.value) || 0);
        const holdingDays = Math.max(0, parseInt(holdingDaysInput.value) || 0);
        const annualRate = Math.max(0, parseFloat(interestRateInput.value) || 0);

        // -- BUY SIDE --
        const grossBuy = units * buyPrice;
        const buyComm = calculateCommission(grossBuy);
        const buySebon = grossBuy * SEBON_FEE_RATE;
        const buyFees = grossBuy > 0 ? (buyComm + buySebon + DP_CHARGE) : 0;
        const totalBuyCost = grossBuy + buyFees;

        const userInvestment = totalBuyCost * MARGIN_PERCENT;
        const brokerLoan = totalBuyCost * (1 - MARGIN_PERCENT);

        // -- INTEREST --
        const dailyRate = (annualRate / 100) / 365;
        const interest = brokerLoan * dailyRate * holdingDays;

        // -- SELL SIDE --
        const grossSell = units * sellPrice;
        const sellComm = calculateCommission(grossSell);
        const sellSebon = grossSell * SEBON_FEE_RATE;
        const sellFees = grossSell > 0 ? (sellComm + sellSebon + DP_CHARGE) : 0;
        const totalSellAmount = Math.max(0, grossSell - sellFees);

        // -- FINAL SETTLEMENT --
        // To settle: Sell Proceeds - Loan Principal - Accrued Interest
        const amountAfterLoan = totalSellAmount - brokerLoan - interest;
        const netProfitLoss = amountAfterLoan - userInvestment;
        const roi = userInvestment > 0 ? (netProfitLoss / userInvestment) * 100 : 0;

        // -- UPDATE UI --
        grossBuyEl.textContent = formatCurrency(grossBuy);
        buyFeesEl.textContent = formatCurrency(buyFees);
        totalBuyCostEl.textContent = formatCurrency(totalBuyCost);
        userInvestmentEl.textContent = formatCurrency(userInvestment);
        brokerLoanEl.textContent = formatCurrency(brokerLoan);
        accruedInterestEl.textContent = formatCurrency(interest);

        grossSellEl.textContent = formatCurrency(grossSell);
        sellFeesEl.textContent = formatCurrency(sellFees);
        netSellEl.textContent = formatCurrency(totalSellAmount);

        pnlValueEl.textContent = formatCurrency(netProfitLoss);
        roiValueEl.textContent = `ROI: ${roi.toFixed(2)}%`;

        // Styling for profit/loss
        if (netProfitLoss >= 0) {
            statusCard.classList.remove('loss');
            statusCard.classList.add('profit');
            roiValueEl.classList.remove('loss');
            roiValueEl.classList.add('profit');
        } else {
            statusCard.classList.remove('profit');
            statusCard.classList.add('loss');
            roiValueEl.classList.remove('profit');
            roiValueEl.classList.add('loss');
        }
    }

    function init() {
        const inputs = [unitsInput, buyPriceInput, sellPriceInput, holdingDaysInput, interestRateInput];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', calculate);
            }
        });

        // Run initial calculation
        calculate();
    }

    return { init };
})();

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', MarginCalculator.init);

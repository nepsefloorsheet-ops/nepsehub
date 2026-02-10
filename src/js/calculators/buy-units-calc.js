/**
 * Buying Capacity Calculator
 * Logic to calculate max units based on budget and price including NEPSE fees
 */

const BuyingCapacityCalc = (() => {
    // DOM Elements
    const budgetInput = document.getElementById('budget-input');
    const priceInput = document.getElementById('price-input');
    const resultValue = document.getElementById('max-units');
    const breakdownUnits = document.getElementById('breakdown-units');
    const breakdownTotal = document.getElementById('breakdown-total');
    const breakdownComm = document.getElementById('breakdown-comm');
    const breakdownSebon = document.getElementById('breakdown-sebon');
    const breakdownDp = document.getElementById('breakdown-dp');
    const breakdownFinal = document.getElementById('breakdown-final');

    const SEBON_RATE = 0.00015; // 0.015%
    const DP_CHARGE = 25;

    function getCommission(amount) {
        if (amount <= 50000) return Math.max(10, amount * 0.0036);
        if (amount <= 500000) return amount * 0.0033;
        if (amount <= 2000000) return amount * 0.0030;
        if (amount <= 10000000) return amount * 0.0027;
        return amount * 0.0024;
    }

    /**
     * Solve for max buy amount (X) such that X + commission(X) + sebon(X) + dp <= budget
     */
    function calculateMaxUnits() {
        const budget = parseFloat(budgetInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;

        if (budget <= 0 || price <= 0) {
            updateUI(0, 0, 0, 0, 0, 0);
            return;
        }

        // We can use a simple binary search or iterate through buckets to find the exact X.
        // A direct solve is possible per bucket.
        let amount = solveForBucket(budget, price);
        let units = Math.floor(amount / price);
        
        // Final verification and adjustment for discrete units
        let finalAmount = units * price;
        let comm = getCommission(finalAmount);
        let sebon = finalAmount * SEBON_RATE;
        let total = finalAmount + comm + sebon + DP_CHARGE;

        // If total exceeds budget due to rounding or edge cases, decrease units
        while (total > budget && units > 0) {
            units--;
            finalAmount = units * price;
            comm = getCommission(finalAmount);
            sebon = finalAmount * SEBON_RATE;
            total = finalAmount + comm + sebon + DP_CHARGE;
        }

        updateUI(units, finalAmount, comm, sebon, DP_CHARGE, total);
    }

    function solveForBucket(budget, price) {
        // Budget available for (Price + Fees) = budget - DP_CHARGE
        const available = budget - DP_CHARGE;
        if (available <= 0) return 0;

        // Bucket 1: <= 50,000
        // rate = 0.36% + 0.015% = 0.375%
        let x = available / 1.00375;
        if (x <= 50000) {
            // Check min commission case (Rs 10)
            // X + 10 + 0.00015X = available => 1.00015X = available - 10
            let xMin = (available - 10) / 1.00015;
            if (getCommission(xMin) === 10) return xMin;
            return x;
        }

        // Bucket 2: 50,001 to 5 Lakhs (0.33%)
        x = available / 1.00345;
        if (x <= 500000) return x;

        // Bucket 3: 5 Lakhs to 20 Lakhs (0.30%)
        x = available / 1.00315;
        if (x <= 2000000) return x;

        // Bucket 4: 20 Lakhs to 1 Crore (0.27%)
        x = available / 1.00285;
        if (x <= 10000000) return x;

        // Bucket 5: Above 1 Crore (0.24%)
        return available / 1.00255;
    }

    function updateUI(units, baseAmt, comm, sebon, dp, total) {
        const fmt = (num) => num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        resultValue.textContent = units.toLocaleString();
        breakdownUnits.textContent = units.toLocaleString();
        breakdownTotal.textContent = `Rs. ${fmt(baseAmt)}`;
        breakdownComm.textContent = `Rs. ${fmt(comm)}`;
        breakdownSebon.textContent = `Rs. ${fmt(sebon)}`;
        breakdownDp.textContent = `Rs. ${fmt(dp)}`;
        breakdownFinal.textContent = `Rs. ${fmt(total)}`;

        // Animation on result
        resultValue.classList.remove('pulse-success');
        void resultValue.offsetWidth; // trigger reflow
        resultValue.classList.add('pulse-success');
    }

    function init() {
        [budgetInput, priceInput].forEach(el => {
            el.addEventListener('input', calculateMaxUnits);
        });
        
        // Initial calc
        calculateMaxUnits();
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', BuyingCapacityCalc.init);

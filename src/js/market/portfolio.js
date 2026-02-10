/**
 * portfolio.js
 * Handles portfolio transactions (Buy/Sell), fee calculations (Broker, SEBON, DP, CGT),
 * WACC-based holdings, Supabase sync, and Chart.js visualization.
 */

const STORAGE_KEY = 'nepse_portfolio_v1';

// Sector Mapping Data
const SECTOR_MAP = {
    ACLBSL: 'Microfinance', ADBL: 'Commercial Banks', AHL: 'Hydro Power', AHPC: 'Hydro Power', AKJCL: 'Hydro Power', AKPL: 'Hydro Power', ALBSL: 'Microfinance', ALICL: 'Life Insurance', ANLB: 'Microfinance', API: 'Hydro Power',
    AVYAN: 'Microfinance', BARUN: 'Hydro Power', BANDIPUR: 'Hotels And Tourism', BBC: 'Tradings', BEDC: 'Hydro Power', BFC: 'Finance', BGWT: 'Hydro Power', BHCL: 'Hydro Power', BHL: 'Hydro Power', BHPL: 'Hydro Power',
    BNHC: 'Hydro Power', BNL: 'Manufacturing And Processing', BNT: 'Manufacturing And Processing', BPCL: 'Hydro Power', BUNGAL: 'Hydro Power', CBBL: 'Microfinance', CFCL: 'Finance', CGH: 'Hotels And Tourism', CHCL: 'Hydro Power', CHDC: 'Investment',
    CHL: 'Hydro Power', CIT: 'Investment', CITY: 'Hotels And Tourism', CKHL: 'Hydro Power', CLI: 'Life Insurance', CORBL: 'Development Banks', CREST: 'Life Insurance', CYCL: 'Microfinance', CZBIL: 'Commercial Banks', DDBL: 'Microfinance',
    DHEL: 'Hydro Power', DHPL: 'Hydro Power', DLBS: 'Microfinance', DOLTI: 'Hydro Power', DORDI: 'Hydro Power', EBL: 'Commercial Banks', EDBL: 'Development Banks', EHPL: 'Hydro Power', ENL: 'Investment', FMDBL: 'Microfinance',
    FOWAD: 'Microfinance', GBBL: 'Development Banks', GBIME: 'Commercial Banks', GBLBS: 'Microfinance', GCIL: 'Manufacturing And Processing', GFCL: 'Finance', GHL: 'Hydro Power', GILB: 'Microfinance', GLBSL: 'Microfinance', GLH: 'Hydro Power',
    GMFBS: 'Microfinance', GMFIL: 'Finance', GMLI: 'Life Insurance', GRDBL: 'Development Banks', GUFL: 'Finance', GVL: 'Hydro Power', HATHY: 'Investment', HBL: 'Commercial Banks', HDHPC: 'Hydro Power', HDL: 'Manufacturing And Processing',
    HEI: 'Non Life Insurance', HHL: 'Hydro Power', HIDCL: 'Investment', HIMSTAR: 'Hydro Power', HLBSL: 'Microfinance', HLI: 'Life Insurance', HPPL: 'Hydro Power', HRL: 'Others', HURJA: 'Hydro Power', ICFC: 'Finance',
    IGI: 'Non Life Insurance', IHL: 'Hydro Power', ILBS: 'Microfinance', ILI: 'Life Insurance', JBBL: 'Development Banks', JBLB: 'Microfinance', JFL: 'Finance', JHAPA: 'Others', JOSHI: 'Hydro Power', JSLBB: 'Microfinance',
    KBL: 'Commercial Banks', KBSH: 'Hydro Power', KDL: 'Hotels And Tourism', KKHC: 'Hydro Power', KMCDB: 'Microfinance', KPCL: 'Hydro Power', KSBBL: 'Development Banks', LBBL: 'Development Banks', LEC: 'Hydro Power', LICN: 'Life Insurance',
    LLBS: 'Microfinance', LSL: 'Commercial Banks', MABEL: 'Hydro Power', MAKAR: 'Hydro Power', MANDU: 'Hydro Power', MATRI: 'Microfinance', MBJC: 'Hydro Power', MBL: 'Commercial Banks', MCHL: 'Hydro Power', MDB: 'Development Banks',
    MEHL: 'Hydro Power', MEL: 'Hydro Power', MEN: 'Hydro Power', MERO: 'Microfinance', MFIL: 'Finance', MHCL: 'Hydro Power', MHL: 'Hydro Power', MHNL: 'Hydro Power', MKCL: 'Others', MKHC: 'Hydro Power',
    MKHL: 'Hydro Power', MKJC: 'Hydro Power', MLBBL: 'Microfinance', MLBL: 'Development Banks', MLBS: 'Microfinance', MLBSL: 'Microfinance', MMKJL: 'Hydro Power', MNBBL: 'Development Banks', MPFL: 'Finance', MSHL: 'Hydro Power',
    MSLB: 'Microfinance', NABBC: 'Development Banks', NABIL: 'Commercial Banks', NADEP: 'Non Life Insurance', NBL: 'Commercial Banks', NESDO: 'Microfinance', NFS: 'Finance', NGPL: 'Hydro Power', NHDL: 'Hydro Power', NHPC: 'Hydro Power',
    NICA: 'Commercial Banks', NICL: 'Non Life Insurance', NICLBSL: 'Microfinance', NIFRA: 'Investment', NIL: 'Non Life Insurance', NIMB: 'Commercial Banks', NLG: 'Non Life Insurance', NLIC: 'Life Insurance', NLICL: 'Life Insurance', NLO: 'Manufacturing And Processing',
    NMB: 'Commercial Banks', NMBMF: 'Microfinance', NMFBS: 'Microfinance', NMIC: 'Non Life Insurance', NMLBBL: 'Microfinance', NRIC: 'Others', NRM: 'Others', NRN: 'Investment', NTC: 'Others', NUBL: 'Microfinance',
    NWCL: 'Others', NYADI: 'Hydro Power', OHL: 'Hotels And Tourism', OMPL: 'Manufacturing And Processing', PCBL: 'Commercial Banks', PFL: 'Finance', PHCL: 'Hydro Power', PMHPL: 'Hydro Power', PMLI: 'Life Insurance', PPCL: 'Hydro Power',
    PPL: 'Hydro Power', PRIN: 'Non Life Insurance', PROFL: 'Finance', PRVU: 'Commercial Banks', PURE: 'Others', RADHI: 'Hydro Power', RAWA: 'Hydro Power', RBCL: 'Non Life Insurance', RFPL: 'Hydro Power', RHGCL: 'Hydro Power',
    RHPL: 'Hydro Power', RIDI: 'Hydro Power', RLFL: 'Finance', RNLI: 'Life Insurance', RSDC: 'Microfinance', RURU: 'Hydro Power', SADBL: 'Development Banks', SAGAR: 'Manufacturing And Processing', SAHAS: 'Hydro Power', SAIL: 'Manufacturing And Processing',
    SALICO: 'Non Life Insurance', SAMAJ: 'Microfinance', SANIMA: 'Commercial Banks', SANVI: 'Hydro Power', SAPDBL: 'Development Banks', SARBTM: 'Manufacturing And Processing', SBI: 'Commercial Banks', SBL: 'Commercial Banks', SCB: 'Commercial Banks', SFCL: 'Finance',
    SGHC: 'Hydro Power', SGIC: 'Non Life Insurance', SHEL: 'Hydro Power', SHINE: 'Development Banks', SHIVM: 'Manufacturing And Processing', SHL: 'Hotels And Tourism', SHLB: 'Microfinance', SHPC: 'Hydro Power', SICL: 'Non Life Insurance', SIFC: 'Finance',
    SIKLES: 'Hydro Power', SINDU: 'Development Banks', SJCL: 'Hydro Power', SJLIC: 'Life Insurance', SKBBL: 'Microfinance', SLBBL: 'Microfinance', SLBSL: 'Microfinance', SMATA: 'Microfinance', SMB: 'Microfinance', SMFBS: 'Microfinance',
    SMH: 'Hydro Power', SMHL: 'Hydro Power', SMJC: 'Hydro Power', SMPDA: 'Microfinance', SNLI: 'Life Insurance', SONA: 'Manufacturing And Processing', SPC: 'Hydro Power', SPDL: 'Hydro Power', SPHL: 'Hydro Power', SPIL: 'Non Life Insurance',
    SPL: 'Hydro Power', SRLI: 'Life Insurance', SSHL: 'Hydro Power', STC: 'Tradings', SWASTIK: 'Microfinance', SWBBL: 'Microfinance', SWMF: 'Microfinance', TAMOR: 'Hydro Power', TPC: 'Hydro Power', TRH: 'Hotels And Tourism',
    TSHL: 'Hydro Power', TTL: 'Others', TVCL: 'Hydro Power', UAIL: 'Non Life Insurance', UHEWA: 'Hydro Power', ULBSL: 'Microfinance', ULHC: 'Hydro Power', UMHL: 'Hydro Power', UMRH: 'Hydro Power', UNHPL: 'Hydro Power',
    UNL: 'Manufacturing And Processing', UNLB: 'Microfinance', UPCL: 'Hydro Power', UPPER: 'Hydro Power', USHEC: 'Hydro Power', USHL: 'Hydro Power', USLB: 'Microfinance', VLBS: 'Microfinance', VLUCL: 'Hydro Power', WNLB: 'Microfinance'
};

// Initial State
const initialState = {
    transactions: [],
    holdings: {},
    targets: {}, // { SYMBOL: { target: 0, stopLoss: 0 } }
    lastUpdate: null
};

let portfolioState = JSON.parse(JSON.stringify(initialState));
let livePriceData = [];
let diversificationChart = null;
let performanceChart = null;
let historicalScripData = {}; // Cache: { SYMBOL: [pricePoints] }
let currentPerformanceRange = '1Y';
let currentTxType = 'BUY';

// Fee Constants
const SEBON_RATE = 0.00015; // 0.015%
const DP_CHARGE = 25;
const CGT_RATE_INDIVIDUAL = 0.05; // Fixed 5%

// DOM Elements
const holdingsTableBody = document.getElementById('holdings-tbody');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const addModal = document.getElementById('add-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const transactionForm = document.getElementById('transaction-form');

// View Tab Elements
const viewTabs = document.querySelectorAll('.view-tab');
const viewContents = document.querySelectorAll('.view-content');
const historyTableBody = document.getElementById('history-tbody');

// Toggle Elements
const typeButtons = document.querySelectorAll('.type-btn');

// Input Elements
const modalUnitsInput = document.getElementById('modal-units');
const modalPriceInput = document.getElementById('modal-price');
const modalSymbolInput = document.getElementById('modal-symbol');
const modalDateInput = document.getElementById('modal-date');
const modalCgtRateInput = document.getElementById('modal-cgt-rate');
const priceLabelEl = document.getElementById('price-label');

// Fee Display Elements
const feeBaseEl = document.getElementById('fee-base-value');
const feeCommEl = document.getElementById('fee-commission');
const feeCommLabelEl = document.getElementById('fee-comm-label');
const feeSebonEl = document.getElementById('fee-sebon');
const feeDpEl = document.getElementById('fee-dp');
const feeCgtEl = document.getElementById('fee-cgt');
const feeNetEl = document.getElementById('fee-net-total');
const feeWaccUnitEl = document.getElementById('fee-wacc-unit');
const netLabelEl = document.getElementById('net-label');
const waccLabelEl = document.getElementById('wacc-label');
const cgtRow = document.querySelector('.cgt-row');

// Summary elements
const totalInvestmentEl = document.getElementById('total-investment');
const currentValueEl = document.getElementById('current-value');
const overallPLEl = document.getElementById('overall-pl');
const overallPLPctEl = document.getElementById('overall-pl-pct');
const todayPLEl = document.getElementById('today-pl');
const todayPLPctEl = document.getElementById('today-pl-pct');
const realizedPLEl = document.getElementById('realized-pl-value');
const unrealizedPLEl = document.getElementById('unrealized-pl');
const unrealizedPLPctEl = document.getElementById('unrealized-pl-pct');

// New Fee Elements
const feeAvgCostEl = document.getElementById('fee-avg-cost');
const feeProfitLossEl = document.getElementById('fee-profit-loss');
const feeNetProfitEl = document.getElementById('fee-net-profit');
const avgCostRow = document.querySelector('.symbol-avg-cost-row');
const profitLossRow = document.querySelector('.profit-loss-row');
const netProfitRow = document.querySelector('.net-profit-row');
const cgtDropdownGroup = document.querySelector('.cgt-dropdown-group');

// Performance Chart Elements
const performanceNoteEl = document.getElementById('performance-note');
const performanceLoaderEl = document.getElementById('performance-loader');
const performanceRangeButtons = document.querySelectorAll('.performance-section .time-btn');

document.addEventListener('DOMContentLoaded', async () => {
    // Set default date to today
    modalDateInput.valueAsDate = new Date();
    
    await loadState();
    setupEventListeners();
    initChart();
    
    await fetchLivePrices();
    await updatePerformanceChart();
    
    if (window.smartRefresh) {
        window.smartRefresh.register('portfolio-refresh', fetchLivePrices, 60000);
    } else {
        setInterval(fetchLivePrices, 60000);
    }
});

function setupEventListeners() {
    addTransactionBtn.addEventListener('click', () => {
        addModal.classList.add('active');
        updateModalFees();
    });

    closeModalBtn.addEventListener('click', () => {
        addModal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === addModal) addModal.classList.remove('active');
    });
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTxType = btn.getAttribute('data-type');
            
            // Adjust UI based on type
            cgtDropdownGroup.style.display = currentTxType === 'SELL' ? 'block' : 'none';
            updateModalFees();
        });
    });

    [modalUnitsInput, modalPriceInput, modalSymbolInput, modalCgtRateInput].forEach(el => {
        el.addEventListener('input', updateModalFees);
    });
    
    modalCgtRateInput.addEventListener('change', updateModalFees);

    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAddTransaction();
    });

    performanceRangeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            performanceRangeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPerformanceRange = btn.getAttribute('data-range');
            updatePerformanceChart();
        });
    });

    // Autocomplete Logic
    const autocompleteList = document.getElementById('autocomplete-list');
    modalSymbolInput.addEventListener('input', () => {
        const val = modalSymbolInput.value.trim().toUpperCase();
        if (!val || val.length < 1) {
            hideAutocomplete();
            return;
        }

        const matches = livePriceData.filter(s => 
            (s.symbol && s.symbol.toUpperCase().includes(val)) || 
            (s.securityName && s.securityName.toUpperCase().includes(val))
        ).slice(0, 8);

        if (matches.length > 0) {
            renderAutocomplete(matches);
        } else {
            hideAutocomplete();
        }
    });

    function renderAutocomplete(matches) {
        autocompleteList.innerHTML = '';
        autocompleteList.style.display = 'block';
        matches.forEach(match => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.innerHTML = `
                <span class="symbol">${match.symbol}</span>
                <span class="name">${match.securityName || match.symbol}</span>
            `;
            item.onclick = () => {
                modalSymbolInput.value = match.symbol;
                hideAutocomplete();
                updateModalFees();
            };
            autocompleteList.appendChild(item);
        });
    }

    function hideAutocomplete() {
        autocompleteList.style.display = 'none';
    }

    // View Switching Logic
    viewTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.getAttribute('data-view');
            viewTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            viewContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${view}-section`) {
                    content.classList.add('active');
                }
            });

            if (view === 'history') renderTransactions();
            else renderHoldings();
        });
    });
}

/**
 * Formatting Helpers
 */
function formatCurrency(val) {
    return `Rs ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatNumber(val, decimals = 2) {
    return val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
/**
 * Calculation Engine for NEPSE Fees
 */
function calculateNEPSEFees(units, price, type, symbol) {
    const baseAmount = units * price;
    const holding = portfolioState.holdings[symbol];
    const avgCost = holding ? holding.avgCost : 0;
    
    // Default values
    if (baseAmount < 0 || (type !== 'BONUS' && baseAmount <= 0)) {
        return { base: 0, comm: 0, commRate: 0, sebon: 0, dp: 0, cgt: 0, total: 0, wacc: 0, profit: 0, avgCost: 0, netProfit: 0 };
    }

    let comm = 0;
    let commRate = 0;
    let sebon = 0;
    let dp = DP_CHARGE;
    let cgt = 0;
    let profit = 0;

    if (type === 'BUY' || type === 'SELL') {
        // Broker Commission (Tiered)
        if (baseAmount <= 50000) commRate = 0.0036;
        else if (baseAmount <= 500000) commRate = 0.0033;
        else if (baseAmount <= 2000000) commRate = 0.0030;
        else if (baseAmount <= 10000000) commRate = 0.0027;
        else commRate = 0.0024;
        
        comm = Math.max(10, baseAmount * commRate);
        sebon = parseFloat((baseAmount * SEBON_RATE).toFixed(2));
    } else {
        // BONUS / RIGHT
        comm = 0;
        sebon = 0;
        commRate = 0;
    }

    if (type === 'SELL' && avgCost > 0) {
        // Gross profit = (Sell Price - Avg Cost) * Units
        const grossProfit = (price - avgCost) * units;
        
        // Net profit after deducting all transaction fees
        const netProfitBeforeTax = grossProfit - (comm + sebon + dp);
        
        // CGT only applies if there's a net profit after fees
        if (netProfitBeforeTax > 0) {
            const selectedCgtRate = parseFloat(modalCgtRateInput.value) || 0.05;
            cgt = netProfitBeforeTax * selectedCgtRate;
        }
        
        profit = grossProfit; // Store gross profit for display
    }

    let netEffect = 0;
    if (type === 'BUY' || type === 'RIGHT') {
        netEffect = baseAmount + comm + sebon + dp;
    } else if (type === 'SELL') {
        netEffect = baseAmount - (comm + sebon + dp + cgt);
    } else if (type === 'BONUS') {
        netEffect = dp; // Only DP charge for bonus
    }

    return { 
        base: baseAmount, 
        comm, 
        commRate: commRate * 100,
        sebon, 
        dp, 
        cgt, 
        total: netEffect,
        wacc: units > 0 ? (netEffect / units) : 0,
        profit,
        avgCost,
        netProfit: profit - (comm + sebon + dp + cgt)
    };
}

function updateModalFees() {
    const units = parseInt(modalUnitsInput.value) || 0;
    const price = parseFloat(modalPriceInput.value) || 0;
    const symbol = modalSymbolInput.value.trim().toUpperCase();

    const fees = calculateNEPSEFees(units, price, currentTxType, symbol);

    feeBaseEl.textContent = formatCurrency(fees.base);
    feeCommEl.textContent = formatCurrency(fees.comm);
    feeCommLabelEl.textContent = `Broker Commission (${fees.commRate.toFixed(2)}%)`;
    feeSebonEl.textContent = formatCurrency(fees.sebon);
    feeDpEl.textContent = formatCurrency(fees.dp);
    
    if (currentTxType === 'SELL') {
        avgCostRow.style.display = fees.avgCost > 0 ? 'flex' : 'none';
        profitLossRow.style.display = 'flex';
        netProfitRow.style.display = 'flex';
        cgtRow.style.display = 'flex';
        
        feeAvgCostEl.textContent = formatCurrency(fees.avgCost);
        feeProfitLossEl.textContent = formatCurrency(fees.profit);
        feeProfitLossEl.className = `fee-profit-loss ${fees.profit >= 0 ? 'profit-text' : 'loss-text'}`;
        
        feeNetProfitEl.textContent = formatCurrency(fees.netProfit);
        feeNetProfitEl.className = `fee-net-profit ${fees.netProfit >= 0 ? 'profit-text' : 'loss-text'}`;

        const selectedCgtRate = parseFloat(modalCgtRateInput.value) || 0.05;
        // The span for CGT label is the first child of cgtRow
        cgtRow.querySelector('span').textContent = `Estimated CGT (${(selectedCgtRate * 100).toFixed(1)}%)`;
        feeCgtEl.textContent = formatCurrency(fees.cgt);
        
        netLabelEl.textContent = 'Net Receivable';
        waccLabelEl.textContent = 'Net Selling Rate per Unit';
    } else {
        avgCostRow.style.display = 'none';
        profitLossRow.style.display = 'none';
        netProfitRow.style.display = 'none';
        cgtRow.style.display = 'none';
        netLabelEl.textContent = 'Net Payable';
        waccLabelEl.textContent = 'Effective Cost per Unit (WACC)';
        if (currentTxType === 'BONUS') netLabelEl.textContent = 'Total Fees (DP)';
    }

    feeNetEl.textContent = formatCurrency(fees.total);
    feeWaccUnitEl.textContent = formatCurrency(fees.wacc);
}

/**
 * Handle Transaction Record
 */
function handleAddTransaction() {
    const symbol = modalSymbolInput.value.trim().toUpperCase();
    const units = parseInt(modalUnitsInput.value);
    const price = parseFloat(modalPriceInput.value);
    const date = modalDateInput.value;

    if (!symbol || isNaN(units) || isNaN(price) || !date) {
        alert("Please fill all fields correctly.");
        return;
    }

    if (currentTxType === 'SELL') {
        const currentHeld = portfolioState.holdings[symbol]?.units || 0;
        if (units > currentHeld) {
            alert(`Insufficient units. You only hold ${currentHeld} of ${symbol}.`);
            return;
        }
    }

    const fees = calculateNEPSEFees(units, price, currentTxType, symbol);

    portfolioState.transactions.push({
        symbol, units, price, type: currentTxType, date,
        fees: { comm: fees.comm, sebon: fees.sebon, dp: fees.dp, cgt: fees.cgt },
        netTotal: fees.total
    });

    calculateHoldings();
    saveState();
    updatePerformanceChart();
    transactionForm.reset();
    modalDateInput.valueAsDate = new Date();
    addModal.classList.remove('active');
    
    // Refresh the current view
    const activeTab = document.querySelector('.view-tab.active');
    if (activeTab && activeTab.getAttribute('data-view') === 'history') {
        renderTransactions();
    } else {
        renderHoldings();
    }
}

/**
 * Calculate Holdings from Transactions (WACC Logic)
 */
function calculateHoldings() {
    portfolioState.holdings = {};
    const sortedTx = [...portfolioState.transactions].sort((a,b) => new Date(a.date) - new Date(b.date));

    sortedTx.forEach(tx => {
        if (!portfolioState.holdings[tx.symbol]) {
            portfolioState.holdings[tx.symbol] = { units: 0, totalCost: 0, avgCost: 0, realizedPL: 0 };
        }
        
        const h = portfolioState.holdings[tx.symbol];
        if (tx.type === 'BUY') {
            h.units += tx.units;
            h.totalCost += tx.netTotal; 
            h.avgCost = h.totalCost / h.units;
        } else {
            const costBasisOfSold = h.avgCost * tx.units;
            h.realizedPL += (tx.netTotal - costBasisOfSold);
            h.units -= tx.units;
            h.totalCost = h.units * h.avgCost; 
            if (h.units === 0) { h.totalCost = 0; h.avgCost = 0; }
        }
    });

    Object.keys(portfolioState.holdings).forEach(s => {
        if (portfolioState.holdings[s].units <= 0 && portfolioState.holdings[s].realizedPL === 0) delete portfolioState.holdings[s];
    });
}

/**
 * Persistence: Load and Save
 */
async function loadState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) portfolioState = JSON.parse(stored);
        
        // Safety: Ensure targets object exists for legacy users
        if (!portfolioState.targets) portfolioState.targets = {};

        if (window.supabaseClient) {
            const { data: { session } } = await window.supabaseClient.auth.getSession();
            if (session?.user) {
                const { data } = await window.supabaseClient.from('user_settings').select('portfolio_data').eq('user_id', session.user.id).single();
                if (data?.portfolio_data) {
                    portfolioState = data.portfolio_data;
                    if (!portfolioState.targets) portfolioState.targets = {};
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioState));
                }
            }
        }
        calculateHoldings();
    } catch (e) {
        console.error("Portfolio: Load Error", e);
    }
}

async function saveState() {
    try {
        portfolioState.lastUpdate = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioState));
        
        if (window.supabaseClient) {
            const { data: { session } } = await window.supabaseClient.auth.getSession();
            if (session?.user) {
                await window.supabaseClient.from('user_settings').upsert({
                    user_id: session.user.id,
                    portfolio_data: portfolioState,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
            }
        }
    } catch (e) {
        console.error("Portfolio: Save Error", e);
    }
}

async function fetchLivePrices() {
    try {
        if (!window.apiService) return;
        const response = await window.apiService.getLiveNepseData();
        livePriceData = response.data || [];
        
        // Render whatever view is currently active
        const activeTab = document.querySelector('.view-tab.active');
        if (activeTab && activeTab.getAttribute('data-view') === 'history') {
            renderTransactions();
        } else {
            renderHoldings();
        }
    } catch (e) {
        console.error("Portfolio: Fetch Error", e);
    }
}

function renderHoldings() {
    if (!holdingsTableBody) return;
    holdingsTableBody.innerHTML = '';
    
    const symbols = Object.keys(portfolioState.holdings).filter(s => portfolioState.holdings[s].units > 0);
    
    if (symbols.length === 0) {
        holdingsTableBody.innerHTML = `<tr><td colspan="12" class="empty-portfolio"><div class="empty-icon"><i class="fas fa-briefcase"></i></div><div class="empty-title">No Active Holdings</div><div class="empty-desc">Record a BUY transaction to start tracking.</div></td></tr>`;
        resetSummary();
        return;
    }

    let totalInvBasis = 0, totalVal = 0, dayChange = 0;

    symbols.forEach(symbol => {
        const h = portfolioState.holdings[symbol];
        const match = livePriceData.find(d => d.symbol === symbol);
        const ltp = match ? match.lastTradedPrice : 0;
        const prevClose = match ? match.previousClose : 0;
        
        const exitFees = calculateNEPSEFees(h.units, ltp, 'SELL', symbol);
        const currValue = exitFees.total;
        const pl = currValue - h.totalCost;
        const plPct = h.totalCost > 0 ? (pl / h.totalCost * 100) : 0;
        
        totalInvBasis += h.totalCost;
        totalVal += currValue;
        if (ltp && prevClose) dayChange += h.units * (ltp - prevClose);

        const targetData = portfolioState.targets[symbol] || { target: 0, stopLoss: 0 };
        const isTargetHit = targetData.target > 0 && ltp >= targetData.target;
        const isStopLossHit = targetData.stopLoss > 0 && ltp <= targetData.stopLoss;
        const rowAlertClass = isTargetHit ? 'target-hit' : (isStopLossHit ? 'stop-loss-hit' : '');

        const investment = h.units * h.avgCost;
        const sector = SECTOR_MAP[symbol] || 'Unknown';
        const tr = document.createElement('tr');
        tr.className = rowAlertClass;
        tr.innerHTML = `
            <td><span class="symbol-badge">${symbol}</span></td>
            <td><span class="sector-badge">${sector}</span></td>
            <td class="right font-600">${h.units.toLocaleString()}</td>
            <td class="right">Rs ${h.avgCost.toFixed(2)}</td>
            <td class="right font-600">Rs ${investment.toLocaleString(undefined, { maximumFractionDigits: 2,minimumFractionDigits: 2 })}</td>
            <td class="right font-mono">${ltp.toLocaleString()}</td>
            <td class="right">
                <input type="number" class="alert-input sl-input" value="${targetData.stopLoss || ''}" placeholder="SL" onchange="updateScripAlert('${symbol}', 'stopLoss', this.value)">
            </td>
            <td class="right">
                <input type="number" class="alert-input target-input" value="${targetData.target || ''}" placeholder="Target" onchange="updateScripAlert('${symbol}', 'target', this.value)">
            </td>
            <td class="right font-mono">Rs ${currValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            <td class="right ${pl >= 0 ? 'profit-text' : 'loss-text'} font-bold">Rs ${pl.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            <td class="right ${pl >= 0 ? 'profit-text' : 'loss-text'}">${plPct.toFixed(2)}%</td>
            <td class="center">
                <button class="action-icon-btn delete" onclick="clearTransactions('${symbol}')" title="Clear history">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        holdingsTableBody.appendChild(tr);
    });

    updateSummary(totalInvBasis, totalVal, dayChange);
    updateCharts();
}

function updateSummary(totalInv, totalVal, dayChange) {
    let totalRealized = 0;
    Object.values(portfolioState.holdings).forEach(h => totalRealized += h.realizedPL);

    const unrealizedPL = totalVal - totalInv;
    const unrealizedPLPct = totalInv > 0 ? (unrealizedPL / totalInv * 100) : 0;
    const overallNetPL = unrealizedPL + totalRealized;
    const overallPLPct = totalInv > 0 ? (overallNetPL / totalInv * 100) : 0;
    const dailyPLPct = totalVal > 0 ? (dayChange / totalVal * 100) : 0;

    totalInvestmentEl.textContent = `Rs ${totalInv.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    currentValueEl.textContent = `Rs ${totalVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    
    // Unrealised P/L
    unrealizedPLEl.textContent = `Rs ${unrealizedPL.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    unrealizedPLEl.className = `summary-value ${unrealizedPL >= 0 ? 'profit-text' : 'loss-text'}`;
    unrealizedPLPctEl.textContent = `${unrealizedPL >= 0 ? '+' : ''}${unrealizedPLPct.toFixed(2)}%`;
    unrealizedPLPctEl.className = `summary-footer ${unrealizedPL >= 0 ? 'profit-text' : 'loss-text'}`;

    // Realised Profit
    realizedPLEl.textContent = `Rs ${totalRealized.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    realizedPLEl.className = `summary-value ${totalRealized >= 0 ? 'profit-text' : 'loss-text'}`;

    // Overall P/L
    overallPLEl.textContent = `Rs ${overallNetPL.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    overallPLEl.className = `summary-value ${overallNetPL >= 0 ? 'profit-text' : 'loss-text'}`;
    overallPLPctEl.textContent = `${overallNetPL >= 0 ? '+' : ''}${overallPLPct.toFixed(2)}% (Inc. Realized)`;
    overallPLPctEl.className = `summary-footer ${overallNetPL >= 0 ? 'profit-text' : 'loss-text'}`;

    // Today's Change
    todayPLEl.textContent = `Rs ${dayChange.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    todayPLEl.className = `summary-value ${dayChange >= 0 ? 'profit-text' : 'loss-text'}`;
    todayPLPctEl.textContent = `${dayChange >= 0 ? '+' : ''}${dailyPLPct.toFixed(2)}%`;
    todayPLPctEl.className = `summary-footer ${dayChange >= 0 ? 'profit-text' : 'loss-text'}`;
}

function resetSummary() {
    totalInvestmentEl.textContent = 'Rs 0.00'; 
    currentValueEl.textContent = 'Rs 0.00';
    unrealizedPLEl.textContent = 'Rs 0.00';
    unrealizedPLPctEl.textContent = '0.00%';
    realizedPLEl.textContent = 'Rs 0.00';
    overallPLEl.textContent = 'Rs 0.00'; 
    overallPLPctEl.textContent = '0.00%';
    todayPLEl.textContent = 'Rs 0.00'; 
    todayPLPctEl.textContent = '0.00%';
}

window.clearTransactions = (symbol) => {
    if (!confirm(`Clear all history for ${symbol}?`)) return;
    portfolioState.transactions = portfolioState.transactions.filter(tx => tx.symbol !== symbol);
    calculateHoldings(); saveState(); renderHoldings();
};

window.updateScripAlert = (symbol, field, value) => {
    if (!portfolioState.targets[symbol]) portfolioState.targets[symbol] = { target: 0, stopLoss: 0 };
    portfolioState.targets[symbol][field] = parseFloat(value) || 0;
    saveState();
    // We don't necessarily need to re-render everything instantly, 
    // but highlighting needs to update. Or just let the next refresh handle it for better UX.
    // For instant feedback:
    renderHoldings();
};

function initChart() {
    const ctx = document.getElementById('diversification-chart').getContext('2d');
    diversificationChart = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: [], datasets: [{ data: [], backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#14b8a6'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 20 } } } }
    });

    const perfCtx = document.getElementById('performance-chart').getContext('2d');
    const gradient = perfCtx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    performanceChart = new Chart(perfCtx, {
        type: 'line',
        data: { 
            labels: [], 
            datasets: [
                { 
                    label: 'Total Equity', 
                    data: [], 
                    borderColor: '#6366f1', 
                    backgroundColor: 'transparent', 
                    fill: false, 
                    tension: 0.4, 
                    pointRadius: 0, 
                    pointHoverRadius: 6 
                },
                { 
                    label: 'Investment Basis', 
                    data: [], 
                    borderColor: 'rgba(148, 163, 184, 0.5)', 
                    borderDash: [5, 5],
                    backgroundColor: 'transparent', 
                    fill: false, 
                    tension: 0, 
                    pointRadius: 0, 
                    pointHoverRadius: 4 
                }
            ] 
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { 
                legend: { display: true, position: 'top', align: 'end', labels: { color: '#94a3b8', boxWidth: 12, font: { size: 10 } } }, 
                tooltip: { mode: 'index', intersect: false } 
            },
            scales: { 
                x: { grid: { display: false }, ticks: { color: '#64748b', maxTicksLimit: 8 } },
                y: { position: 'right', grid: { color: 'rgba(148, 163, 184, 0.05)' }, ticks: { color: '#64748b' } }
            }
        }
    });
}

/**
 * Historical Reconstruction Engine
 */
async function updatePerformanceChart() {
    if (!performanceChart || !window.apiService) return;
    
    performanceLoaderEl.classList.add('active');
    
    try {
        const uniqueSymbols = [...new Set(portfolioState.transactions.map(tx => tx.symbol))];
        const oldestDate = portfolioState.transactions.length > 0 
            ? new Date(Math.min(...portfolioState.transactions.map(tx => new Date(tx.date))))
            : new Date();
        
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Handle Note Logic
        if (oldestDate < oneYearAgo) {
            performanceNoteEl.textContent = "Note: 1 Years Record only, Historic coming soon...";
        } else {
            performanceNoteEl.textContent = "only 1 year historic portfolio performance";
        }

        // Fetch missing historical data
        const fetchPromises = uniqueSymbols.filter(s => !historicalScripData[s]).map(async s => {
            try {
                const res = await window.apiService.getScripChartData(s, '1Y');
                if (res?.success && Array.isArray(res.data)) {
                    // Sort chronologically to ensure filter.pop() gets the latest available price
                    historicalScripData[s] = res.data.sort((a,b) => a.date.localeCompare(b.date));
                }
            } catch (e) {
                console.error(`Error fetching history for ${s}:`, e);
            }
        });
        await Promise.all(fetchPromises);

        // Prepare timeline
        const labels = [];
        const valueData = [];
        const investmentData = [];
        const today = new Date();
        const firstTx = portfolioState.transactions.length > 0 
            ? portfolioState.transactions.reduce((min, cur) => cur.date < min.date ? cur : min)
            : null;
        
        // Define range start
        let rangeDays = 365;
        if (currentPerformanceRange === '1M') rangeDays = 30;
        else if (currentPerformanceRange === '3M') rangeDays = 90;
        else if (currentPerformanceRange === '6M') rangeDays = 180;

        // Find true start day: the most recent of (rangeDays ago) or (first transaction date)
        const rangeStartDate = new Date(today);
        rangeStartDate.setDate(rangeStartDate.getDate() - rangeDays);
        
        const firstTxDate = firstTx ? new Date(firstTx.date) : today;
        const actualStartDate = firstTxDate > rangeStartDate ? firstTxDate : rangeStartDate;
        
        // Calculate days to loop from today backwards to actualStartDate
        const diffItems = Math.max(1, Math.ceil((today - actualStartDate) / (1000 * 60 * 60 * 24)));

        for (let i = diffItems; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Reconstruct holdings on this specific date
            let dailyStockValue = 0;
            let dailyRealizedProfit = 0;
            let dailyInvestment = 0;

            const txUntilDate = portfolioState.transactions.filter(tx => tx.date <= dateStr)
                                .sort((a,b) => new Date(a.date) - new Date(b.date));
            
            const tempHoldings = {};
            txUntilDate.forEach(tx => {
                if (!tempHoldings[tx.symbol]) tempHoldings[tx.symbol] = { units: 0, totalCost: 0, avgCost: 0 };
                const h = tempHoldings[tx.symbol];
                if (tx.type === 'BUY') {
                    h.units += tx.units;
                    h.totalCost += tx.netTotal;
                    h.avgCost = h.totalCost / h.units;
                    dailyInvestment += tx.netTotal; // Total cash outlaid
                } else if (tx.type === 'SELL') {
                    const costBasisOfSold = h.avgCost * tx.units;
                    dailyRealizedProfit += (tx.netTotal - costBasisOfSold);
                    dailyInvestment -= costBasisOfSold; // Reduce investment basis of capital being "tracked"
                    h.units -= tx.units;
                    h.totalCost = h.units * h.avgCost;
                    if (h.units <= 0) { h.totalCost = 0; h.avgCost = 0; }
                }
            });

            // Calculate current valuation of held units on this date
            Object.keys(tempHoldings).forEach(symbol => {
                if (tempHoldings[symbol].units > 0) {
                    const pricePoints = historicalScripData[symbol] || [];
                    const pricePoint = pricePoints.filter(p => p.date <= dateStr).pop();
                    const price = pricePoint ? pricePoint.value : 0;
                    dailyStockValue += tempHoldings[symbol].units * price;
                }
            });

            labels.push(date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
            valueData.push(dailyStockValue + dailyRealizedProfit);
            investmentData.push(dailyInvestment);
        }

        performanceChart.data.labels = labels;
        performanceChart.data.datasets[0].data = valueData;
        performanceChart.data.datasets[1].data = investmentData;
        
        // Dynamic color based on performance
        const lastVal = valueData[valueData.length - 1];
        const lastInv = investmentData[investmentData.length - 1];
        const color = lastVal >= lastInv ? '#10b981' : '#ef4444';
        
        performanceChart.data.datasets[0].borderColor = color;
        performanceChart.update();
    } catch (e) {
        console.error("Reconstruction Error:", e);
    } finally {
        performanceLoaderEl.classList.remove('active');
    }
}

function updateCharts() {
    if (!diversificationChart) return;
    const symbols = Object.keys(portfolioState.holdings).filter(s => portfolioState.holdings[s].units > 0);
    
    // Calculate sector-wise portfolio values
    const sectorData = {};
    symbols.forEach(symbol => {
        const sector = SECTOR_MAP[symbol] || 'Unknown';
        const match = livePriceData.find(d => d.symbol === symbol);
        const value = portfolioState.holdings[symbol].units * (match ? match.lastTradedPrice : 0);
        sectorData[sector] = (sectorData[sector] || 0) + value;
    });
    
    const sectors = Object.keys(sectorData);
    const data = sectors.map(s => sectorData[s]);
    diversificationChart.data.labels = sectors;
    diversificationChart.data.datasets[0].data = data;
    diversificationChart.update();
}

/**
 * Transaction History Rendering
 */
function renderTransactions() {
    if (!historyTableBody) return;
    historyTableBody.innerHTML = '';

    const sortedTx = [...portfolioState.transactions].sort((a,b) => new Date(b.date) - new Date(a.date));

    if (sortedTx.length === 0) {
        historyTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-40 text-muted">No transactions found.</td></tr>`;
        return;
    }

    sortedTx.forEach((tx, sortedIndex) => {
        // Find original index for deletion
        const originalIndex = portfolioState.transactions.indexOf(tx);
        const totalFees = (tx.fees.comm + tx.fees.sebon + tx.fees.dp + (tx.fees.cgt || 0));

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="font-mono text-secondary" style="font-size: 0.85rem">${tx.date}</td>
            <td><span class="symbol-badge">${tx.symbol}</span></td>
            <td class="center">
                <span class="tx-type-badge ${tx.type.toLowerCase()}">${tx.type}</span>
            </td>
            <td class="right font-600">${tx.units.toLocaleString()}</td>
            <td class="right font-mono">Rs ${tx.price.toLocaleString()}</td>
            <td class="right text-muted" style="font-size: 0.85rem">Rs ${totalFees.toLocaleString()}</td>
            <td class="right font-600">Rs ${tx.netTotal.toLocaleString()}</td>
            <td class="center">
                <button class="action-icon-btn delete" onclick="deleteTransaction(${originalIndex})" title="Delete record">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        historyTableBody.appendChild(tr);
    });
    
    // Still update charts/summary in background just in case
    let totalInvBasis = 0, totalVal = 0, dayChange = 0;
    const symbols = Object.keys(portfolioState.holdings).filter(s => portfolioState.holdings[s].units > 0);
    symbols.forEach(symbol => {
        const h = portfolioState.holdings[symbol];
        const match = livePriceData.find(d => d.symbol === symbol);
        const ltp = match ? match.lastTradedPrice : 0;
        const prevClose = match ? match.previousClose : 0;
        const exitFees = calculateNEPSEFees(h.units, ltp, 'SELL', symbol);
        totalInvBasis += h.totalCost;
        totalVal += exitFees.total;
        if (ltp && prevClose) dayChange += h.units * (ltp - prevClose);
    });
    updateSummary(totalInvBasis, totalVal, dayChange);
}

window.deleteTransaction = (index) => {
    if (!confirm('Are you sure you want to delete this transaction record? This will affect your holdings.')) return;
    portfolioState.transactions.splice(index, 1);
    calculateHoldings();
    saveState();
    updatePerformanceChart();
    
    const activeTab = document.querySelector('.view-tab.active');
    if (activeTab && activeTab.getAttribute('data-view') === 'history') {
        renderTransactions();
    } else {
        renderHoldings();
    }
};

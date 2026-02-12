/**
 * holdings-analytics.js
 * Optimized for Raw Data Audit and Aggregated Summary Views
 */

const API_BASE_URL = "https://holdings-production-447e.up.railway.app/api";
const DEBOUNCE_DELAY = 500;
const ROWS_PER_PAGE = 50;

// Symbol database: {symbol: fullName}
const SYMBOL_DATABASE = {
  NABIL: "Nabil Bank Limited",
  NIMB: "Nepal Investment Mega Bank Limited",
  SCB: "Standard Chartered Bank Limited",
  HBL: "Himalayan Bank Limited",
  SBI: "Nepal SBI Bank Limited",
  EBL: "Everest Bank Limited",
  NICA: "NIC Asia Bank Ltd.",
  MBL: "Machhapuchhre Bank Limited",
  LSL: "Laxmi Sunrise Bank Limited",
  KBL: "Kumari Bank Limited",
  SBL: "Siddhartha Bank Limited",
  SHL: "Soaltee Hotel Limited",
  TRH: "Taragaon Regency Hotel Limited",
  OHL: "Oriental Hotels Limited",
  NHPC: "National Hydro Power Company Limited",
  BPCL: "Butwal Power Company Limited",
  CHCL: "Chilime Hydropower Company Limited",
  STC: "Salt Trading Corporation",
  BBC: "Bishal Bazar Company Limited",
  NUBL: "Nirdhan Utthan Laghubitta Bittiya Sanstha Limited",
  CBBL: "Chhimek Laghubitta Bittiya Sanstha Limited",
  DDBL: "Deprosc Laghubitta Bittiya Sanstha Limited",
  SANIMA: "Sanima Bank Limited",
  NABBC: "Narayani Development Bank Limited",
  NICL: "Nepal Insurance Co. Ltd.",
  RBCL: "Rastriya Beema Company Limited",
  NLICL: "National Life Insurance Co. Ltd.",
  HEI: "Himalayan Everest Insurance Limited",
  UAIL: "United Ajod Insurance Limited",
  SPIL: "Siddhartha Premier Insurance Limited",
  NIL: "Neco Insurance Limited",
  PRIN: "Prabhu Insurance Ltd.",
  SALICO: "Sagarmatha Lumbini Insurance Co. Limited",
  IGI: "IGI Prudential insurance Limited",
  NLIC: "Nepal Life Insurance Co. Ltd.",
  LICN: "Life Insurance Corporation (Nepal) Limited",
  SICL: "Shikhar Insurance Co. Ltd.",
  NFS: "Nepal Finance Ltd.",
  BNL: "Bottlers Nepal (Balaju) Limited",
  NLO: "Nepal Lube Oil Limited",
  GUFL: "Gurkhas Finance Ltd.",
  CIT: "Citizen Investment Trust",
  BNT: "Bottlers Nepal (Terai) Limited",
  UNL: "Unilever Nepal Limited",
  BFC: "Best Finance Company Ltd.",
  GFCL: "Goodwill Finance Limited",
  HDL: "Himalayan Distillery Limited",
  PFL: "Pokhara Finance Ltd.",
  NMB: "NMB Bank Limited",
  SIFC: "Shree Investment Finance Co. Ltd.",
  CFCL: "Central Finance Co. Ltd.",
  JFL: "Janaki Finance Company Limited",
  PRVU: "Prabhu Bank Limited",
  SFCL: "Samriddhi Finance Company Limited",
  GMFIL: "Guheshowori Merchant Bank & Finance Co. Ltd.",
  SWBBL: "Swabalamban Laghubitta Bittiya Sanstha Limited",
  ICFC: "ICFC Finance Limited",
  EDBL: "Excel Development Bank Ltd.",
  NTC: "Nepal Doorsanchar Company Limited",
  PROFL: "Progressive Finance Limited",
  GBIME: "Global IME Bank Limited",
  CZBIL: "Citizens Bank International Limited",
  PCBL: "Prime Commercial Bank Ltd.",
  LBBL: "Lumbini Bikas Bank Ltd.",
  AHPC: "Arun Valley Hydropower Development Co. Ltd.",
  MDB: "Miteri Development Bank Limited",
  ALICL: "Asian Life Insurance Co. Limited",
  HLI: "Himalayan Life Insurance Limited",
  NMLBBL: "Nerude Mirmire Laghubitta Bittiya Sanstha Limited",
  ADBL: "Agricultural Development Bank Limited",
  MLBL: "Mahalaxmi Bikas Bank Ltd.",
  SJLIC: "SuryaJyoti Life Insurance Company Limited",
  GBBL: "Garima Bikas Bank Limited",
  JBBL: "Jyoti Bikas Bank Limited",
  CORBL: "Corporate Development Bank Limited",
  KSBBL: "Kamana Sewa Bikas Bank Limited",
  MPFL: "Multipurpose Finance Company Limited",
  SADBL: "Shangrila Development Bank Ltd.",
  SHINE: "Shine Resunga Development Bank Ltd.",
  MNBBL: "Muktinath Bikas Bank Ltd.",
  FMDBL: "First Micro Finance Laghubitta Bittiya Sanstha Limited",
  MFIL: "Manjushree Finance Ltd.",
  NBL: "Nepal Bank Limited",
  SLBBL: "Swarojgar Laghubitta Bittiya Sanstha Ltd.",
  NLG: "NLG Insurance Company Ltd.",
  SINDU: "Sindhu Bikash Bank Ltd",
  SKBBL: "Sana Kisan Bikas Laghubitta Bittiya Sanstha Limited",
  GBLBS: "Grameen Bikas Laghubitta Bittiya Sanstha Ltd.",
  RLFL: "Reliance Finance Ltd.",
  SHPC: "Sanima Mai Hydropower Ltd.",
  KMCDB: "Kalika Laghubitta Bittiya Sanstha Ltd",
  MLBBL: "Mithila LaghuBitta Bittiya Sanstha Limited",
  RIDI: "Ridi Power Company Limited",
  LLBS: "Laxmi Laghubitta Bittiya Sanstha Ltd.",
  BARUN: "Barun Hydropower Co. Ltd.",
  VLBS: "Vijaya laghubitta Bittiya Sanstha Ltd.",
  HLBSL: "Himalayan Laghubitta Bittiya Sanstha Limited",
  MATRI: "Matribhumi Lagubitta Bittiya Sanstha Limited",
  JSLBB: "Janautthan Samudayic Laghubitta Bittya Sanstha Limited",
  API: "Api Power Company Ltd.",
  NMBMF: "NMB Microfinance Bittiya Sanstha Ltd.",
  GILB: "Global IME Laghubitta Bittiya Sanstha Ltd.",
  SWMF: "Suryodaya Womi Laghubitta Bittiya Sanstha Limited",
  MERO: "Mero Microfinance Bittiya Sanstha Ltd.",
  HIDCL: "Hydorelectricity Investment and Development Company Ltd",
  NGPL: "Ngadi Group Power Ltd.",
  GRDBL: "Green Development Bank Ltd.",
  NMFBS: "National Laghubitta Bittiya Sanstha Limited",
  RSDC: "RSDC Laghubitta Bittiya Sanstha Ltd.",
  KKHC: "Khanikhola Hydropower Co. Ltd.",
  DHPL: "Dibyashwori Hydropower Ltd.",
  AKPL: "Arun Kabeli Power Ltd.",
  FOWAD: "Forward Microfinance Laghubitta Bittiya Sanstha Limited",
  SPDL: "Synergy Power Development Ltd.",
  UMHL: "United Modi Hydropower Ltd.",
  SMATA: "Samata Gharelu Laghubitta Bittiya Sanstha Limited",
  CHL: "Chhyangdi Hydropower Ltd.",
  HPPL: "Himalayan Power Partner Ltd.",
  MSLB: "Mahuli Laghubitta Bittiya Sanstha Limited",
  NHDL: "Nepal Hydro Developers Ltd.",
  SMB: "Support Microfinance Bittiya Sanstha Ltd.",
  USLB: "Unnati Sahakarya Laghubitta Bittiya Sanstha Limited",
  RADHI: "Radhi Bidyut Company Ltd",
  WNLB: "Wean Nepal Laghubitta Bittiya Sanstha Limited",
  NADEP: "Nadep Laghubittiya bittya Sanstha Ltd.",
  PMHPL: "Panchakanya Mai Hydropower Ltd",
  KPCL: "Kalika power Company Ltd",
  AKJCL: "Ankhu Khola Jalvidhyut Company Ltd",
  JOSHI: "Joshi Hydropower Development Company Ltd",
  ACLBSL: "Aarambha Chautari Laghubitta Bittiya Sanstha Limited",
  UPPER: "Upper Tamakoshi Hydropower Ltd",
  SLBSL: "Samudayik Laghubitta Bittiya Sanstha Limited",
  GHL: "Ghalemdi Hydro Limited",
  ALBSL: "Asha Laghubitta Bittiya Sanstha Ltd",
  SHIVM: "SHIVAM CEMENTS LTD",
  UPCL: "UNIVERSAL POWER COMPANY LTD",
  MHNL: "Mountain Hydro Nepal Limited",
  PPCL: "Panchthar Power Compant Limited",
  GMFBS: "Ganapati Laghubitta Bittiya Sanstha Limited",
  HURJA: "Himalaya Urja Bikas Company Limited",
  GLBSL: "Gurans Laghubitta Bittiya Sanstha Limited",
  SMFBS: "Swabhimaan Laghubitta Bittiya Sanstha Limited",
  UNHPL: "Union Hydropower Limited",
  ILBS: "Infinity Laghubitta Bittiya Sanstha Limited",
  RHPL: "RASUWAGADHI HYDROPOWER COMPANY LIMITED",
  SJCL: "SANJEN JALAVIDHYUT COMPANY LIMITED",
  SAPDBL: "Saptakoshi Development Bank Ltd",
  HDHPC: "Himal Dolakha Hydropower Company Limited",
  NRIC: "Nepal Reinsurance Company Limited",
  NICLBSL: "NIC ASIA Laghubitta Bittiya Sanstha Limited",
  SMPDA: "Sampada Laghubitta Bittiya Sanstha Limited",
  NRN: "NRN Infrastructure and Development Limited",
  LEC: "Liberty Energy Company Limited",
  SSHL: "Shiva Shree Hydropower Ltd",
  SGIC: "Sanima GIC Insurance Limited",
  MEN: "Mountain Energy Nepal Limited",
  UMRH: "United IDI Mardi RB Hydropower Limited.",
  PMLI: "Prabhu Mahalaxmi Life Insurance Limited",
  CGH: "Chandragiri Hills Limited",
  NIFRA: "Nepal Infrastructure Bank Limited",
  GLH: "GreenLife Hydropower Limited",
  MLBSL: "Mahila Lagubitta Bittiya Sanstha Limited",
  SHEL: "Singati Hydro Energy Limited",
  RURU: "Ru Ru Jalbidhyut Pariyojana Limited",
  CHDC: "CEDB Holdings Limited",
  JBLB: "Jeevan Bikas Laghubitta Bittya Sanstha Ltd",
  SRLI: "Sanima Reliance Life Insurance Limited",
  MKJC: "Mailung Khola Jal Vidhyut Company Limited",
  MLBS: "Manushi Laghubitta Bittiya Sanstha Limited",
  SAHAS: "Sahas Urja Limited",
  TPC: "Terhathum Power Company Limited",
  SPC: "Samling Power Company Limited",
  NYADI: "Nyadi Hydropower Limited",
  MBJC: "Madhya Bhotekoshi Jalavidyut Company Limited",
  BNHC: "Buddha Bhumi Nepal Hydropower Company Limited",
  ENL: "Emerging Nepal Limited",
  NESDO: "NESDO Sambridha Laghubitta Bittiya Sanstha Limited",
  GVL: "Green Ventures Limited",
  BHL: "Balephi Hydropower Limited",
  ULBSL: "Upakar Laghubitta Bittiya Sanstha Limited",
  CYCL: "CYC Nepal Laghubitta Bittiya Sanstha Limited",
  RFPL: "River Falls Power Limited",
  DORDI: "Dordi Khola Jal Bidyut Company Limited",
  BHDC: "Bindhyabasini Hydropower Development Company Limited",
  HHL: "Himalayan Hydropower Limited",
  UHEWA: "Upper Hewakhola Hydropower Company Limited",
  SGHC: "Swet-Ganga Hydropower & Construction Limited",
  MHL: "Mandakini Hydropower Limited",
  USHEC: "Upper Solu Hydro Electric Company Limited",
  RHGCL: "Rapti Hydro And General Construction Limited",
  AVYAN: "Aviyan Laghubitta Bittiya Sanstha Limited",
  SPHL: "Sayapatri Hydropower Limited",
  PPL: "People's Power Limited",
  DLBS: "Dhaulagiri Laghubitta Bittiya Sanstha Limited",
  SIKLES: "Sikles Hydropower Limited",
  EHPL: "Eastern Hydropower Limited",
  SHLB: "Shrijanshil Laghubitta Bittiya Sanstha Limited",
  PHCL: "Peoples Hydropower Company Limited",
  BHPL: "Barahi Hydropower Public Limited",
  UNLB: "Unique Nepal Laghubitta Bittiya Sanstha Limited",
  SMHL: "Super Madi Hydropower Limited",
  SPL: "Shuvam Power Limited",
  SMH: "Super Mai Hydropower Limited",
  MKHC: "Maya Khola Hydropower Company Limited",
  AHL: "Asian Hydropower Limited",
  KDL: "Kalinchowk Darshan Limited",
  TAMOR: "Sanima Middle Tamor Hydropower Limited",
  MHCL: "Molung Hydropower Company Limited",
  SMJC: "Sagarmatha Jalabidhyut Company Limited",
  ANLB: "Aatmanirbhar Laghubitta Bittiya Sanstha Limited",
  MAKAR: "Makar Jitumaya Suri Hydropower Limited",
  MKHL: "Mai Khola Hydropower Limited",
  DOLTI: "Dolti Power Company Limited",
  BEDC: "Bhugol Energy Development Company Limited",
  CITY: "City Hotel Limited",
  MCHL: "Menchhiyam Hydropower Limited",
  IHL: "Ingwa Hydropower Limited",
  MEL: "Modi Energy Limited",
  RAWA: "Rawa Energy Development Limited",
  NRM: "Nepal Republic Media Limited",
  ILI: "IME Life Insurance Company Limited",
  USHL: "Upper Syange Hydropower Limited",
  GCIL: "Ghorahi Cement Industry Limited",
  TSHL: "Three Star Hydropower Limited",
  KBSH: "Kutheli Bukhari Small Hydropower Limited",
  RNLI: "Reliable Nepal Life Insurance Limited",
  SNLI: "Sun Nepal Life Insurance Company Limited",
  MEHL: "Manakamana Engineering Hydropower Limited",
  ULHC: "Upper Lohore Khola Hydropower Company Limited",
  CLI: "Citizen Life Insurance Company Limited",
  MANDU: "Mandu Hydropower Limited",
  HATHY: "Hathway Investment Nepal Limited",
  BGWT: "Bhagawati Hydropower Development Company Limited",
  MSHL: "Mid Solu Hydropower Limited",
  SONA: "Sonapur Minerals And Oil Limited",
  MMKJL: "Mathillo Mailun Khola Jalvidhyut Limited",
  TVCL: "Trishuli Jal Vidhyut Company Limited",
  VLUCL: "Vision Lumbini Urja Company Limited",
  MKCL: "Muktinath Krishi Company Limited",
  CKHL: "Chirkhwa Hydropower Limited",
  NWCL: "Nepal Warehousing Company Limited",
  HRL: "Himalayan Reinsurance Limited",
  SARBTM: "Sarbottam Cement Limited",
  GMLI: "Guardian Micro Life Insurance Limited",
  NMIC: "Nepal Micro Insurance Company Limited",
  CREST: "Crest Micro Life Insurance Limited",
  OMPL: "Om Megashree Pharmaceuticals Limited",
  PURE: "Pure Energy Limited",
  TTL: "Trade Tower Limited",
  SANVI: "Sanvi Energy Limited",
  BHCL: "Bikash Hydropower Company Limited",
  HIMSTAR: "Him Star Urja Company Limited",
  MABEL: "Mabilung Energy Limited",
  DHEL: "Daramkhola Hydro Energy Limited",
  SAGAR: "Sagar Distillery Limited",
  SWASTIK: "Swastik Laghubitta Bittiya Sanstha Limited",
  BUNGAL: "Bungal Hydro Limited",
  BANDIPUR: "Bandipur Cablecar and Tourism Limited",
  JHAPA: "Jhapa Energy Limited",
  SAIL: "Shreenagar Agritech Industries Limited",
  SYPNL: "SY Panel Nepal Limited"
};

let state = {
  filters: {
    brokerId: null,
    symbol: "",
    startDate: "",
    endDate: "",
  },
  ui: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    sortColumn: "date",
    sortDirection: "desc",
    aggSortColumn: "total_qty",
    aggSortDirection: "desc"
    , chartMetric: 'total_qty'
  },
  data: {
    tableItems: [],
    aggregatedItems: [],
  },
};

// Chart instance holder
let aggChart = null;

let debounceTimer = null;
let selectedSymbol = null;

document.addEventListener("DOMContentLoaded", async () => {
  initDateLimits();
  initSymbolDropdown();
  setupEventListeners();
  initAggregatedChart();
  loadDashboard();
});

function initDateLimits() {
  const startEl = document.getElementById("start-date");
  const endEl = document.getElementById("end-date");
  if (startEl && endEl) {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const maxStr = formatDate(today);
    const minStr = formatDate(oneYearAgo);

    startEl.setAttribute("min", minStr);
    startEl.setAttribute("max", maxStr);
    endEl.setAttribute("min", minStr);
    endEl.setAttribute("max", maxStr);

    // Also set initial values to avoid future dates
    startEl.value = maxStr;
    endEl.value = maxStr;

    // Sync initial state
    state.filters.startDate = maxStr;
    state.filters.endDate = maxStr;

    // Enhance click behavior to show native picker
    [startEl, endEl].forEach(el => {
      el.addEventListener('click', () => {
        try {
          if (typeof el.showPicker === 'function') {
            el.showPicker();
          }
        } catch (e) {
          console.debug("showPicker not supported or failed", e);
        }
      });
    });
  }
}

function setupEventListeners() {
  // Broker Filter
  const brokerInput = document.getElementById("broker-filter");
  if (brokerInput) {
    brokerInput.addEventListener("input", (e) => {
      state.filters.brokerId = e.target.value ? parseInt(e.target.value) : null;
    });
  }

  // Symbol Filter with Dropdown
  const symbolInput = document.getElementById("symbol-filter");
  const symbolDropdown = document.getElementById("symbol-dropdown");

  if (symbolInput && symbolDropdown) {
    symbolInput.addEventListener("focus", () => {
      symbolDropdown.classList.add("open");
    });

    symbolInput.addEventListener("input", (e) => {
      const val = e.target.value.trim().toUpperCase();
      filterSymbolDropdown(val);
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".symbol-filter-wrapper")) {
        symbolDropdown.classList.remove("open");
      }
    });
  }

  // Date Range Inputs
  const startEl = document.getElementById("start-date");
  const endEl = document.getElementById("end-date");
  if (startEl && endEl) {
    [startEl, endEl].forEach(el => {
      el.addEventListener("change", () => {
        state.filters.startDate = startEl.value;
        state.filters.endDate = endEl.value;
      });
    });
  }

  // Search Button Trigger
  const searchBtn = document.getElementById("search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      // Validate symbol if entered
      const symbolInput = document.getElementById("symbol-filter");
      if (symbolInput && symbolInput.value.trim()) {
        const symbol = symbolInput.value.trim().toUpperCase();
        if (!SYMBOL_DATABASE[symbol]) {
          alert(`Invalid symbol: "${symbol}". Please select from the dropdown list.`);
          return;
        }
      }
      state.ui.currentPage = 1;
      loadDashboard();
    });
  }

  // Timeframe Shortcut Buttons
  document.querySelectorAll(".date-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const range = btn.dataset.range;
      document.querySelectorAll(".date-chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyTimeframeShortcut(range);
    });
  });

  // Clear Filters
  const clearBtn = document.getElementById("clear-filters-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearFilters);
  }

  // Keyboard Shortcut: Esc
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      clearFilters();
    }
  });

  // Aggregated Table Sorting
  document.querySelectorAll("#aggregated-master-table th.sortable").forEach(th => {
    th.addEventListener("click", () => {
      const column = th.dataset.sort;
      if (state.ui.aggSortColumn === column) {
        state.ui.aggSortDirection = state.ui.aggSortDirection === "asc" ? "desc" : "asc";
      } else {
        state.ui.aggSortColumn = column;
        state.ui.aggSortDirection = "desc";
      }
      renderAggregatedTable();
    });
  });

  // Chart metric toggles (Qty / Amount)
  document.querySelectorAll('.chart-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-toggle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.ui.chartMetric = btn.dataset.metric;
      updateAggregatedChart();
    });
  });

  // Pagination
  document.getElementById("prev-page-btn").addEventListener("click", () => {
    if (state.ui.currentPage > 1) {
      state.ui.currentPage--;
      loadDashboard();
    }
  });

  document.getElementById("next-page-btn").addEventListener("click", () => {
    if (state.ui.currentPage < state.ui.totalPages) {
      state.ui.currentPage++;
      loadDashboard();
    }
  });
}

function clearFilters() {
  state.filters.brokerId = null;
  state.filters.symbol = "";
  state.filters.startDate = "";
  state.filters.endDate = "";
  state.ui.currentPage = 1;
  selectedSymbol = null;

  // Reset UI elements
  document.getElementById("broker-filter").value = "";
  document.getElementById("symbol-filter").value = "";
  document.getElementById("start-date").value = "";
  document.getElementById("end-date").value = "";

  // Close symbol dropdown
  const symbolDropdown = document.getElementById("symbol-dropdown");
  if (symbolDropdown) symbolDropdown.classList.remove("open");

  // Reset Timeframe buttons
  document.querySelectorAll(".date-chip").forEach(b => b.classList.remove("active"));
  const btn1D = document.querySelector('.date-chip[data-range="1D"]');
  if (btn1D) btn1D.classList.add("active");

  loadDashboard();
}

function applyTimeframeShortcut(range) {
  const end = new Date();
  const start = new Date();

  switch (range) {
    case "1W": start.setDate(start.getDate() - 7); break;
    case "1M": start.setMonth(start.getMonth() - 1); break;
    case "3M": start.setMonth(start.getMonth() - 3); break;
    case "1Y": start.setFullYear(start.getFullYear() - 1); break;
    case "1D": break; // API handles last trading day
  }

  state.filters.startDate = range === "1D" ? "" : start.toISOString().split('T')[0];
  state.filters.endDate = range === "1D" ? "" : end.toISOString().split('T')[0];

  document.getElementById("start-date").value = state.filters.startDate;
  document.getElementById("end-date").value = state.filters.endDate;

  state.ui.currentPage = 1;
  loadDashboard();
}

async function loadDashboard() {
  toggleLoading(true);
  try {
    const params = new URLSearchParams({
      limit: ROWS_PER_PAGE,
      offset: (state.ui.currentPage - 1) * ROWS_PER_PAGE,
    });

    if (state.filters.brokerId) params.append("broker_id", state.filters.brokerId);
    if (state.filters.symbol) params.append("symbol", state.filters.symbol);
    if (state.filters.startDate) params.append("start_date", state.filters.startDate);
    if (state.filters.endDate) params.append("end_date", state.filters.endDate);

    const response = await fetch(`${API_BASE_URL}/holdings?${params.toString()}`);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const result = await response.json();

    // Sync State
    state.data.tableItems = result.table_data;
    state.data.aggregatedItems = result.aggregated_data;
    state.ui.totalRecords = result.pagination.total;
    state.ui.totalPages = Math.ceil(state.ui.totalRecords / ROWS_PER_PAGE);

    // Update Stats
    document.getElementById("stat-total-volume").textContent =
      (result.summary.total_volume || 0).toLocaleString();
    document.getElementById("stat-total-turnover").textContent =
      `Rs ${(result.summary.total_turnover || 0).toLocaleString()}`;
    document.getElementById("stat-active-entities").textContent =
      (result.summary.active_entities || 0).toLocaleString();

    // Sync UI with detected dates if they were empty
    if (!state.filters.startDate && result.table_data.length > 0) {
      const latestDate = result.table_data[0].date;
      document.getElementById("start-date").value = latestDate;
      document.getElementById("end-date").value = latestDate;
    }

    renderAggregatedTable();
    renderRawTable();
    updatePaginationUI();
  } catch (e) {
    console.error("Master Load Error:", e);
    showTableError("Failed to connect to the Analytics Engine.");
  } finally {
    toggleLoading(false);
  }
}

function renderAggregatedTable() {
  const tbody = document.getElementById("aggregated-tbody");
  const header = document.getElementById("agg-entity-header");
  const title = document.getElementById("aggregated-table-title");

  if (!tbody) return;
  tbody.innerHTML = "";

  // Context detection for headers
  const isBrokerSearch = state.filters.brokerId && !state.filters.symbol;
  const isSymbolSearch = !!state.filters.symbol;

  if (isSymbolSearch) {
    header.textContent = "Broker ID";
    // Also keep the sort icon if it was overwritten
    if (!header.innerHTML.includes('fa-sort')) header.innerHTML += ' <i class="fas fa-sort"></i>';
    title.textContent = `Broker-wise Holding for ${state.filters.symbol}`;
  } else if (isBrokerSearch) {
    header.textContent = "Symbol";
    if (!header.innerHTML.includes('fa-sort')) header.innerHTML += ' ';
    title.textContent = `Portfolio for Broker ${state.filters.brokerId}`;
  } else {
    header.textContent = "Broker ID";
    if (!header.innerHTML.includes('fa-sort')) header.innerHTML += ' ';
    title.textContent = "Global Broker-wise Distribution";
  }

  // Sort Data Locally
  const sortedData = [...state.data.aggregatedItems].sort((a, b) => {
    let valA, valB;
    if (state.ui.aggSortColumn === "avg_rate") {
      valA = (a.total_amount / a.total_qty) || 0;
      valB = (b.total_amount / b.total_qty) || 0;
    } else {
      valA = a[state.ui.aggSortColumn];
      valB = b[state.ui.aggSortColumn];
    }

    if (typeof valA === "string") {
      return state.ui.aggSortDirection === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    return state.ui.aggSortDirection === "asc" ? valA - valB : valB - valA;
  }).slice(0, 15);

  if (sortedData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-20 text-muted">No aggregated data available.</td></tr>`;
    return;
  }

  // Update Sorting Icons in UI
  document.querySelectorAll("#aggregated-master-table th.sortable").forEach(th => {
    const icon = th.querySelector("i");
    if (icon) {
      if (th.dataset.sort === state.ui.aggSortColumn) {
        icon.className = `fas fa-sort-${state.ui.aggSortDirection === "asc" ? "up" : "down"}`;
        th.classList.add("active-sort");
      } else {
        icon.className = "fas fa-sort";
        th.classList.remove("active-sort");
      }
    }
  });

  sortedData.forEach(item => {
    const tr = document.createElement("tr");
    const entityDisplay = isBrokerSearch ? `<span class="badge-indicator badge-acc">${item.entity_id}</span>` : `Broker ${item.entity_id}`;
    const avgRate = item.total_qty > 0 ? (item.total_amount / item.total_qty).toFixed(2) : "0.00";

    tr.innerHTML = `
            <td><span class="font-700 text-primary">${entityDisplay}</span></td>
            <td class="text-right font-mono font-600">${(item.total_qty || 0).toLocaleString()}</td>
            <td class="text-right font-mono text-accent-primary">Rs ${(item.total_amount || 0).toLocaleString()}</td>
            <td class="text-right font-mono font-600">${parseFloat(avgRate).toLocaleString()}</td>
            <td class="text-right text-muted">${item.record_count || 0}</td>
        `;
    tbody.appendChild(tr);
  });

  // Update chart with the latest aggregated items (top 5)
  updateAggregatedChart();
}

function renderRawTable() {
  const tbody = document.getElementById("holdings-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (state.data.tableItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-40 text-muted">No audit logs found.</td></tr>`;
    return;
  }

  state.data.tableItems.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td class="text-muted font-500">${item.date}</td>
            <td><span class="font-700 text-primary">Broker ${item.broker_id}</span></td>
            <td><span class="badge-indicator badge-acc">${item.symbol}</span></td>
            <td class="text-right font-mono font-600">${(item.qty || 0).toLocaleString()}</td>
            <td class="text-right font-mono text-accent-primary">Rs ${(item.amount || 0).toLocaleString()}</td>
        `;
    tbody.appendChild(tr);
  });

  document.getElementById("table-results-info").textContent =
    `Showing ${(state.ui.totalRecords || 0).toLocaleString()} history records`;
}

function updatePaginationUI() {
  const prevBtn = document.getElementById("prev-page-btn");
  const nextBtn = document.getElementById("next-page-btn");
  const pageInfo = document.getElementById("current-page");
  const totalInfo = document.getElementById("total-pages");
  const numbersContainer = document.getElementById("pagination-numbers");

  if (prevBtn) prevBtn.disabled = state.ui.currentPage === 1;
  if (nextBtn) nextBtn.disabled = state.ui.currentPage >= state.ui.totalPages;
  if (pageInfo) pageInfo.textContent = state.ui.currentPage;
  if (totalInfo) totalInfo.textContent = state.ui.totalPages;

  if (numbersContainer) {
    numbersContainer.innerHTML = "";
    const maxVisible = 5;
    let start = Math.max(1, state.ui.currentPage - 2);
    let end = Math.min(state.ui.totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      const p = document.createElement("div");
      p.className = `page-num ${i === state.ui.currentPage ? "active" : ""}`;
      p.textContent = i;
      p.onclick = () => {
        state.ui.currentPage = i;
        loadDashboard();
      };
      numbersContainer.appendChild(p);
    }
  }
}

function showTableError(msg) {
  const tbody = document.getElementById("holdings-tbody");
  if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="text-center py-40 text-accent-danger font-600">${msg}</td></tr>`;
}

function toggleLoading(isLoading) {
  const overlay = document.getElementById("chart-loading-overlay");
  if (overlay) {
    overlay.className = isLoading ? "overlay" : "overlay hidden";
  }
}

/* Chart helpers for Aggregated Bar */
function initAggregatedChart() {
  const canvas = document.getElementById('aggregated-bar-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  const ctx = canvas.getContext('2d');
  aggChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Qty',
        data: [],
        backgroundColor: 'rgba(54, 235, 78, 0.8)',
        borderColor: 'rgb(255, 255, 255)',
        borderWidth: 1
      }]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { autoSkip: false } },
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (context) => formatChartTooltip(context) } }
      }
    }
  });
}

function formatChartTooltip(context) {
  const metric = state.ui.chartMetric || 'total_qty';
  const val = context.raw || 0;
  if (metric === 'total_amount') return `Rs ${Number(val).toLocaleString()}`;
  return Number(val).toLocaleString();
}

function updateAggregatedChart() {
  if (!aggChart) return;

  const metric = state.ui.chartMetric || 'total_qty';

  // Prepare top 5 from aggregatedItems by selected metric
  const items = (state.data.aggregatedItems || []).map(it => ({
    entity: it.entity_id,
    total_qty: Number(it.total_qty || 0),
    total_amount: Number(it.total_amount || 0)
  }));

  if (items.length === 0) {
    aggChart.data.labels = [];
    aggChart.data.datasets[0].data = [];
    aggChart.update();
    return;
  }

  const sorted = items.sort((a, b) => b[metric] - a[metric]).slice(0, 5);
  const labels = sorted.map(i => `Broker ${i.entity}`);
  const data = sorted.map(i => i[metric]);

  aggChart.data.labels = labels;
  aggChart.data.datasets[0].data = data;
  aggChart.data.datasets[0].label = metric === 'total_amount' ? 'Amount (Rs)' : 'Qty';
  aggChart.options.plugins.tooltip.callbacks.label = (context) => formatChartTooltip(context);
  aggChart.update();
}

/* Symbol Dropdown Helpers */
function filterSymbolDropdown(searchTerm) {
  const dropdown = document.getElementById("symbol-dropdown");
  if (!dropdown) return;

  dropdown.innerHTML = "";

  // Filter symbols by search term
  const filtered = Object.entries(SYMBOL_DATABASE).filter(([symbol, name]) =>
    symbol.includes(searchTerm) || name.toUpperCase().includes(searchTerm)
  );

  if (filtered.length === 0) {
    dropdown.innerHTML = '<div class="dropdown-item disabled">No matches found</div>';
    return;
  }

  filtered.forEach(([symbol, fullName]) => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.innerHTML = `<strong>${fullName}</strong><br><small>${symbol}</small>`;
    item.addEventListener("click", () => selectSymbol(symbol));
    dropdown.appendChild(item);
  });
}

function selectSymbol(symbol) {
  const input = document.getElementById("symbol-filter");
  const dropdown = document.getElementById("symbol-dropdown");

  if (input && SYMBOL_DATABASE[symbol]) {
    input.value = symbol;
    selectedSymbol = symbol;
    state.filters.symbol = symbol;
    dropdown.classList.remove("open");
  }
}

function initSymbolDropdown() {
  const dropdown = document.getElementById("symbol-dropdown");
  if (!dropdown) return;

  // Show all symbols initially
  Object.entries(SYMBOL_DATABASE).forEach(([symbol, fullName]) => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.innerHTML = `<strong>${fullName}</strong><br><small>${symbol}</small>`;
    item.addEventListener("click", () => selectSymbol(symbol));
    dropdown.appendChild(item);
  });
}

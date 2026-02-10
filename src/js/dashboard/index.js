// =============================================
// GLOBAL STATE (SINGLE SOURCE OF TRUTH)
// =============================================
let marketData = null;
let announcements = [];

let activeTab = "volume";
let activeIndicesTab = "main";

// Ticker state
let tickerInterval = null;
let currentTickerIndex = 0;
let isTickerPaused = false;

// =============================================
// DOM ELEMENTS
// =============================================
const indicesContainer = document.getElementById("indicesContainer");
const gainersContainer = document.getElementById("gainersContainer");
const losersContainer = document.getElementById("losersContainer");
const metricsTableContainer = document.getElementById("metricsTableContainer");

const refreshBtn = document.getElementById("refreshBtn");
const tabButtons = document.querySelectorAll(".metrics-section .tab-btn-min");

// Ticker
const tickerTrack = document.getElementById("tickerTrack");
const modal = document.getElementById("announcementModal");

// =============================================
// UTILITIES
// =============================================
function getChangeClass(v) {
  if (v > 0) return "positive";
  if (v < 0) return "negative";
  return "neutral";
}

function formatNumber(num, currency = false, index = false) {
  if (num === null || num === undefined) return '---';
  if (index) return num.toFixed(2);
  if (currency) return `Rs ${num.toFixed(2)}`;
  if (typeof num === 'number') return num.toFixed(2);
  return (num || 0).toLocaleString("en-IN");
}

// =============================================
// HOMEPAGE DATA CARD
// =============================================
function updateSummaryCards(data) {
  if (!data || !data.marketSummary) return;

  const summaryMap = {};
  data.marketSummary.forEach(item => {
    const name = item.name.toLowerCase();
    if (name.includes("scrips traded") || name.includes("scrip traded")) summaryMap.scripts = item.value;
    else if (name.includes("total turnover")) summaryMap.turnover = item.value;
    else if (name.includes("total traded shares") || name.includes("total volume")) summaryMap.volume = item.value;
    else if (name.includes("total transactions")) summaryMap.transactions = item.value;
    else if (name.includes("total listed scrips") || name.includes("total listed companies")) summaryMap.scripts = item.value;
  });

  const elements = {
    "totalTraded": (summaryMap.scripts || 0).toLocaleString(),
    "advances": data.stockSummary?.advanced ?? 0,
    "declines": data.stockSummary?.declined ?? 0,
    "unchanged": data.stockSummary?.unchanged ?? 0,
    "positiveCircuits": data.stockSummary?.positiveCircuit ?? 0,
    "negativeCircuits": data.stockSummary?.negativeCircuit ?? 0,
    "transactionsStat": (summaryMap.transactions || 0).toLocaleString(),
  };

  for (const [id, value] of Object.entries(elements)) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = value;
      el.classList.remove('shimmer');
    }
  }
}

// =============================================
// INDICES MODULE
// =============================================
function renderIndices() {
  if (!marketData) return;

  const data = activeIndicesTab === "main" ? (marketData.indices || []) : (marketData.subIndices || []);
  const titleText = activeIndicesTab === "main" ? "MAIN INDICES" : "SECTOR INDICES";

  const container = document.createElement('div');
  container.className = 'indices-tables-container';
  container.id = 'indicesContainer';

  const nav = document.createElement('div');
  nav.className = 'indices-tabs-navigation';

  ['main', 'sector'].forEach(tab => {
    const btn = document.createElement('button');
    btn.className = `indices-tab-btn ${activeIndicesTab === tab ? 'active' : ''}`;
    btn.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
    btn.dataset.tab = tab;
    btn.onclick = () => {
      activeIndicesTab = tab;
      renderIndices();
    };
    nav.appendChild(btn);
  });

  const card = document.createElement('div');
  card.className = 'table-card scroll ml-104';
  const h3 = document.createElement('h3');
  h3.textContent = titleText;
  card.appendChild(h3);

  const table = document.createElement('table');
  table.className = 'compact-table';
  table.innerHTML = `
    <thead><tr><th>Index</th><th class="right">Close</th><th class="right">Change</th><th class="right">% Ch</th></tr></thead>
  `;

  const tbody = document.createElement('tbody');
  data.forEach(i => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i.name}</td>
      <td class="right">${formatNumber(i.currentValue, false, true)}</td>
      <td class="right ${getChangeClass(i.change)}">
        ${(i.change || 0) > 0 ? "+" : ""}${(i.change || 0).toFixed(2)}
      </td>
      <td class="right ${getChangeClass(i.changePercent)}">
        ${(i.changePercent || 0).toFixed(2)}%
      </td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  card.appendChild(table);
  indicesContainer.innerHTML = '';
  indicesContainer.appendChild(nav);
  indicesContainer.appendChild(card);
}

// =============================================
// GAINERS / LOSERS
// =============================================
function renderGainersLosers() {
  const g = marketData.topGainers || [];
  const l = marketData.topLosers || [];

  const updateTable = (container, arr) => {
    container.innerHTML = '';
    arr.forEach(s => {
      const tr = document.createElement('tr');
      tr.className = getChangeClass(s.changePercent);
      tr.innerHTML = `
        <td>${s.symbol}</td>
        <td class="right">${(s.lastTradedPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
        <td class="right change">${(s.change || 0).toFixed(2)}</td>
        <td class="right">${(s.changePercent || 0).toFixed(2)}%</td>
      `;
      container.appendChild(tr);
    });
  };

  updateTable(gainersContainer, g);
  updateTable(losersContainer, l);

  const loader = document.querySelector(".loading-container");
  if (loader) loader.style.display = "none";
}

// =============================================
// METRICS
// =============================================
function renderMetrics() {
  let data = [];
  let title = "";
  if (activeTab === "volume") {
    data = marketData.topTradedShares || [];
    title = "TOP VOLUME";
  } else if (activeTab === "turnover") {
    data = marketData.topTurnover || [];
    title = "TOP TURNOVER";
  } else {
    data = marketData.topTransactions || [];
    title = "TOP TRANSACTIONS";
  }

  const container = metricsTableContainer;
  container.innerHTML = '';
  const h3 = document.createElement('h3');
  h3.textContent = title;
  container.appendChild(h3);

  const table = document.createElement('table');
  table.className = 'compact-table';
  let headerLabel = activeTab === 'volume' ? 'Volume' : activeTab === 'turnover' ? 'Turnover' : 'Transactions';
  
  table.innerHTML = `
    <thead><tr><th>Symbol</th><th class="right">${headerLabel}</th><th class="right">LTP</th><th class="right">% Ch</th></tr></thead>
  `;

  const tbody = document.createElement('tbody');
  data.forEach(i => {
    const tr = document.createElement('tr');
    tr.className = getChangeClass(i.changePercent);
    let val = activeTab === "turnover" ? (i.turnover || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : 
              activeTab === "volume" ? (i.sharesTraded || 0).toLocaleString("en-IN") : (i.transactions || 0).toLocaleString("en-IN");

    tr.innerHTML = `
      <td>${i.symbol}</td>
      <td class="right">${val}</td>
      <td class="right">${(i.lastTradedPrice || 0).toFixed(2)}</td>
      <td class="right">${(i.changePercent || 0).toFixed(2)}%</td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

function setupMetricTabs() {
  tabButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeTab = btn.dataset.tab;
      renderMetrics();
    })
  );
}

// =============================================
// ANNOUNCEMENTS
// =============================================
function renderNewsList() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  track.innerHTML = '';
  if (announcements.length === 0) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>No announcements available</span>';
    track.appendChild(errorDiv);
    return;
  }
  track.classList.add('news-feed-list');
  announcements.forEach((announcement, index) => {
    const item = document.createElement('div');
    item.className = 'news-item';
    item.dataset.index = index;
    const date = new Date(announcement.announcementDate);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    item.innerHTML = `
      <div class="news-item-top">
        <span class="news-symbol">${announcement.symbol}</span>
        <span class="news-date">${formattedDate}</span>
      </div>
      <div class="news-title">${announcement.title}</div>
      <div class="news-category">${announcement.category}</div>
    `;
    item.addEventListener('click', () => showAnnouncementDetails(index));
    track.appendChild(item);
  });
}

function showAnnouncementDetails(index) {
  const announcement = announcements[index];
  const modal = document.getElementById('announcementModal');
  if (!announcement || !modal) return;
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  const pdfLink = document.getElementById('pdfLink');
  if (modalTitle) modalTitle.textContent = announcement.title;
  if (modalContent) {
    const date = new Date(announcement.announcementDate).toLocaleDateString();
    modalContent.innerHTML = `
      <div class="announcement-detail">
        <div class="detail-header"><span class="detail-symbol"><strong>Symbol:</strong> ${announcement.symbol}</span><span class="detail-date"><strong>Date:</strong> ${date}</span></div>
        <div class="detail-category"><strong>Category:</strong> ${announcement.category}</div>
        <div class="detail-title"><strong>Title:</strong> ${announcement.title}</div>
      </div>
    `;
  }
  if (pdfLink) {
    if (announcement.document && (announcement.document.url || announcement.documentUrl)) {
      pdfLink.href = announcement.document.url || announcement.documentUrl;
      pdfLink.style.display = 'inline-flex';
    } else {
      pdfLink.style.display = 'none';
    }
  }
  modal.classList.add('show');
}

function setupModalListeners() {
  const modal = document.getElementById('announcementModal');
  const closeModal = document.getElementById('closeModal');
  const closeDetails = document.getElementById('closeDetails');
  if (!modal) return;
  const hideModal = () => modal.classList.remove('show');
  if (closeModal) closeModal.addEventListener('click', hideModal);
  if (closeDetails) closeDetails.addEventListener('click', hideModal);
  window.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideModal(); });
}

async function loadAnnouncements() {
  try {
    const res = await apiService.getAnnouncements();
    announcements = res?.data?.content || [];
    renderNewsList();
    setupModalListeners();
  } catch (error) {
    console.error('Error loading announcements:', error);
  }
}

async function loadAllData() {
  try {
    refreshBtn.disabled = true;
    const originalContent = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';

    marketData = await apiService.getMarketData();
    if (window.updateNEPSEIndex) window.updateNEPSEIndex(marketData);
    updateSummaryCards(marketData);
    renderIndices();
    renderGainersLosers();
    renderMetrics();
    
    refreshBtn.innerHTML = originalContent;
  } catch (e) {
    console.error(e);
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
  } finally {
    refreshBtn.disabled = false;
  }
}

// =============================================
// INIT
// =============================================
document.addEventListener("DOMContentLoaded", () => {
    // Check if smartRefresh is available
    if (window.smartRefresh) {
        window.smartRefresh.register('dashboard-data', loadAllData, 60000, true);
        window.smartRefresh.register('dashboard-announcements', loadAnnouncements, 300000, true);
        
        console.log('Dashboard: Using Smart Refresh (market-hours only)');
    } else {
        // Fallback: Manual refresh (always on)
        loadAllData();
        loadAnnouncements();
        setInterval(loadAllData, 60000);
        setInterval(loadAnnouncements, 300000);
        
        console.log('Dashboard: Using manual refresh (always on)');
    }

    setupMetricTabs();
    refreshBtn.addEventListener("click", loadAllData);
});


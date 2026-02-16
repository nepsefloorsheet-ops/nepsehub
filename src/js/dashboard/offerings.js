/**
 * Offerings Dashboard Module
 * Handles fetching and rendering for IPOs, FPOs, Rights, etc.
 */

const offeringsModule = (() => {
  let currentOfferingTab = 'ipo-general';
  
  const elements = {
    offeringTabs: document.getElementById('offeringTabs'),
    offeringContainer: document.getElementById('offeringTableContainer')
  };

  const offeringAPIMap = {
    'ipo-general': () => apiService.getIpoGeneral(),
    'ipo-local': () => apiService.getIpoLocal(),
    'ipo-foreign': () => apiService.getIpoForeign(),
    'fpo': () => apiService.getFpo(),
    'right-share': () => apiService.getRightShares(),
    'mutual-fund': () => apiService.getMutualFundOfferings(),
    'debenture': () => apiService.getDebentureOfferings()
  };

  async function loadOfferings(type) {
    if (!elements.offeringContainer) return;
    
    elements.offeringContainer.innerHTML = '<div class="loading-container shimmer" style="height:350px;">Loading...</div>';
    
    try {
      const data = await offeringAPIMap[type]();
      renderOfferings(data.data?.content || []);
    } catch (error) {
      console.error('Error loading offerings:', error);
      elements.offeringContainer.innerHTML = '<div class="error">Failed to load offerings</div>';
    }
  }

  function renderOfferings(offerings) {
    if (offerings.length === 0) {
      elements.offeringContainer.innerHTML = '<div class="loading-container">No active offerings found</div>';
      return;
    }

    const table = document.createElement('table');
    table.className = 'compact-table offerings-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Company & Symbol</th>
          <th>Sector</th>
          <th class="right">Units</th>
          <th class="right">Amount (NPR)</th>
          <th class="right">Price</th>
          <th class="right">Open</th>
          <th class="right">Close</th>
          <th class="right">Status</th>
          <th class="right">Prospectus</th>
        </tr>
      </thead>
      <tbody>
        ${offerings.slice(0, 5).map(o => {
          const units = o.units ? o.units.toLocaleString() : '0';
          const amount = o.totalAmount ? o.totalAmount.toLocaleString() : '0';
          const statusClass = o.status === 'Open' ? 'positive' : o.status === 'ComingSoon' ? 'warning' : '';
          const openDate = o.openingDate ? new Date(o.openingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-';
          const closeDate = o.closingDate ? new Date(o.closingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-';
          const prospectusBtn = o.prospectus 
            ? `<a href="${o.prospectus}" target="_blank" class="prospectus-link"><i class="fas fa-file-pdf"></i> View</a>` 
            : '<span class="text-muted">-</span>';
          
          return `
            <tr>
              <td>
                <div class="company-cell">
                  <span class="company-name">${o.name || 'N/A'}</span>
                  <span class="symbol-tag">${o.symbol || 'N/A'}</span>
                </div>
              </td>
              <td class="sector-cell text-muted">${o.sector || 'N/A'}</td>
              <td class="right">${units}</td>
              <td class="right">${amount}</td>
              <td class="right price-cell">Rs ${o.price || '0'}</td>
              <td class="right date-cell">${openDate}</td>
              <td class="right date-cell">${closeDate}</td>
              <td class="right"><span class="badge ${statusClass}">${o.status || 'N/A'}</span></td>
              <td class="right">${prospectusBtn}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    `;
    
    elements.offeringContainer.innerHTML = '';
    elements.offeringContainer.appendChild(table);
  }

  function setupEventListeners() {
    if (!elements.offeringTabs) return;
    
    const buttons = elements.offeringTabs.querySelectorAll('.tab-btn-min');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentOfferingTab = btn.dataset.type;
        loadOfferings(currentOfferingTab);
      });
    });
  }

  function init() {
    setupEventListeners();
    
    // Initial fetch
    loadOfferings('ipo-general');
    
    // Auto-refresh using Smart Refresh if available, otherwise fallback to manual
    if (window.smartRefresh) {
      window.smartRefresh.register('dashboard-offerings', () => loadOfferings(currentOfferingTab), 300000, false);
      console.log('Offerings: Using Smart Refresh (market-hours only)');
    } else {
      setInterval(() => {
        loadOfferings(currentOfferingTab);
      }, 300000);
      console.log('Offerings: Using manual refresh (always on)');
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', offeringsModule.init);

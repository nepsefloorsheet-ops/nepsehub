const apiService = (() => {
    // New Distributed Base URLs
    const CORE_URL = 'https://nepsehub-production.up.railway.app';
    const TECH_URL = 'https://nepsehub-production-99c1.up.railway.app';
    const CHARTS_URL = 'https://nepsehub-production-ad9e.up.railway.app';
    const INFO_URL = 'https://nepsehub-production-58b6.up.railway.app';
    
    // Ticker/External Base (If still needed, keeping original as fallback)
    const tickerBaseURL = 'https://nepseapi-production-9edf.up.railway.app';

    const cache = new Map();
    const pendingRequests = new Map();
    
    const cacheDuration = {
        '/homepage-data': 30000,
        '/announcements': 120000,
        '/market-turnover': 1000,
        '/live-nepse': 2500,
        '/stock-chart/index/1D': 60000,
        '/stock-chart/NEPSE': 60000,
        '/ipo/general': 300000,
        '/ipo/local': 300000,
        '/ipo/foreign': 300000,
        '/right-share': 300000,
        '/fpo': 300000,
        '/mutual-fund-offering': 300000,
        '/debenture-offering': 300000
    };

    // Helper to determine the correct Base URL for a given endpoint
    function getBaseURL(endpoint, useTickerBase) {
        if (useTickerBase) return tickerBaseURL;

        // Charts
        if (endpoint.startsWith('/stock-chart')) return CHARTS_URL;

        // Technicals
        if (endpoint.startsWith('/rsi/') || 
            endpoint.startsWith('/ma/') || 
            endpoint === '/rsi/all' ||
            endpoint === '/ma/all' ||
            endpoint.startsWith('/volume-shockers') || 
            endpoint.startsWith('/confluence') || 
            endpoint.startsWith('/crossovers') || 
            endpoint.startsWith('/candlesticks') || 
            endpoint.startsWith('/refresh-technical')) {
            return TECH_URL;
        }

        // Market Info
        if (endpoint.startsWith('/announcements') || 
            endpoint.startsWith('/ipo') || 
            endpoint.startsWith('/right-share') || 
            endpoint.startsWith('/fpo') || 
            endpoint.startsWith('/mutual-fund-offering') || 
            endpoint.startsWith('/debenture-offering')) {
            return INFO_URL;
        }

        // Core (Default)
        return CORE_URL;
    }

    const controller = new AbortController();

    async function request(endpoint, options = {}, useTickerBase = false) {
        const base = getBaseURL(endpoint, useTickerBase);
        const fullURL = `${base}${endpoint}`;
        const cacheKey = `${endpoint}:${JSON.stringify(options)}`;
        
        // Check cache
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < (cacheDuration[endpoint] || 30000)) {
            return cached.data;
        }

        // Deduplicate simultaneous requests
        if (pendingRequests.has(cacheKey)) {
            return pendingRequests.get(cacheKey);
        }

        try {
            const requestPromise = fetch(fullURL, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            }).then(async response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
                }
                return response.json();
            });

            pendingRequests.set(cacheKey, requestPromise);
            const data = await requestPromise;
            
            // Cache successful response
            cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            if (cached && !navigator.onLine) {
                console.warn('Using cached data due to network error:', error.message);
                return cached.data;
            }
            throw error;
        } finally {
            pendingRequests.delete(cacheKey);
        }
    }

    return {
        getMarketData: () => request('/homepage-data'),
        getChartData: (symbol, timePeriod) => {
            if (timePeriod === '1D') {
                return request(`/stock-chart/index/1D/${symbol}`);
            }
            return request(`/stock-chart/${symbol}?time=${timePeriod}`);
        },
        getAnnouncements: () => request('/announcements'),
        getMarketTurnover: () => request('/market-turnover'),
        getLiveNepseData: async () => {
            const res = await request('/live-nepse', {}, true);
            // Ensure data is an array (Object.values if it's a dictionary)
            if (res && res.data && !Array.isArray(res.data)) {
                res.data = Object.values(res.data);
            }
            return res;
        },
        getScripChartData: (symbol, timePeriod = '1W') => request(`/stock-chart/${symbol}?time=${timePeriod}`),
        getAllRsi: () => request('/rsi/all'),
        getRsiByFilter: (min, max) => request(`/rsi/filter?min=${min}&max=${max}`),
        getAllMa: () => request('/ma/all'),
        getMaStatus: () => request('/ma/status'),
        getAllCrossovers: () => request('/crossovers/all'),
        getConfluence: () => request('/confluence/all'),
        getCandlesticks: () => request('/candlesticks/all'),
        getVolumeShockers: () => request('/volume-shockers/all'),
        getIpoGeneral: () => request('/ipo/general'),
        getIpoLocal: () => request('/ipo/local'),
        getIpoForeign: () => request('/ipo/foreign'),
        getRightShares: () => request('/right-share'),
        getFpo: () => request('/fpo'),
        getMutualFundOfferings: () => request('/mutual-fund-offering'),
        getDebentureOfferings: () => request('/debenture-offering'),
        getFloorsheet: (page, size, order) => request(`/floorsheet?page=${page}&size=${size}&order=${order}`),
        getFloorsheetTotals: () => request('/floorsheet/totals'),
        getBrokerSnapshot: () => {
            return request('/broker-snapshot', {}, true);
        },
        getMarketDepth: (symbol) => request(`/market-depth/${symbol}`, {}, true),
        refreshTechnical: () => request('/refresh-technical'),
        clearCache: () => {
            cache.clear();
            pendingRequests.clear();
        }
    };
})();

// Make global
window.apiService = apiService;

// src/js/utils/error-handler.js
const ErrorHandler = {
    showError(element, message, retryCallback = null) {
        // ... (rest of showError logic)
        if (!element) return;
        
        element.innerHTML = `
            <div class="error-state" role="alert">
                <i class="fas fa-exclamation-triangle"></i>
                <p class="error-message">${this.escapeHtml(message)}</p>
                ${retryCallback ? 
                    `<button class="retry-btn" aria-label="Retry loading data">
                        <i class="fas fa-redo"></i> Retry
                    </button>` 
                    : ''
                }
            </div>
        `;
        
        if (retryCallback) {
            element.querySelector('.retry-btn').addEventListener('click', (e) => {
                e.preventDefault();
                element.innerHTML = `
                    <div class="loading-state">
                        <div class="spinner"></div>
                        <p>Retrying...</p>
                    </div>
                `;
                retryCallback();
            });
        }
    },

    showToast(message, type = 'error', duration = 5000) {
        // ... (rest of showToast logic)
        const existing = document.getElementById('global-toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'warning' ? 'fa-exclamation-triangle' : 
                     'fa-exclamation-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span class="toast-message">${this.escapeHtml(message)}</span>
            <button class="toast-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        const timeout = setTimeout(() => toast.remove(), duration);
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(timeout);
            toast.remove();
        });
        
        return toast;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    handleApiError(error, context) {
        console.error(`${context}:`, error);
        if (error.name === 'AbortError') return;
        if (!navigator.onLine) {
            this.showToast('You are offline. Showing cached data.', 'warning');
            return;
        }
        const message = error.message || 'An unexpected error occurred';
        this.showToast(`Failed to ${context}: ${message}`, 'error');
    }
};

window.ErrorHandler = ErrorHandler;

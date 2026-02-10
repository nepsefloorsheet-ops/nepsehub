// src/js/utils/cleanup-manager.js
class CleanupManager {
    constructor() {
        this.intervals = new Set();
        this.timeouts = new Set();
        this.eventListeners = new Map();
        this.controllers = new Set();
    }

    setInterval(fn, delay) {
        const id = setInterval(fn, delay);
        this.intervals.add(id);
        return id;
    }

    setTimeout(fn, delay) {
        const id = setTimeout(fn, delay);
        this.timeouts.add(id);
        return id;
    }

    addEventListener(target, event, handler, options) {
        target.addEventListener(event, handler, options);
        const key = `${target.constructor.name}_${event}`;
        if (!this.eventListeners.has(key)) {
            this.eventListeners.set(key, []);
        }
        this.eventListeners.get(key).push({ target, event, handler });
    }

    registerController(controller) {
        this.controllers.add(controller);
    }

    cleanup() {
        // Clear intervals
        this.intervals.forEach(id => clearInterval(id));
        this.intervals.clear();

        // Clear timeouts
        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts.clear();

        // Remove event listeners
        for (const [, listeners] of this.eventListeners) {
            listeners.forEach(({ target, event, handler }) => {
                target.removeEventListener(event, handler);
            });
        }
        this.eventListeners.clear();

        // Abort controllers
        this.controllers.forEach(controller => {
            if (controller && typeof controller.abort === 'function') {
                controller.abort();
            }
        });
        this.controllers.clear();
    }
}

// Global instance
const cleanupManager = new CleanupManager();

// Setup automatic cleanup
window.addEventListener('beforeunload', () => cleanupManager.cleanup());
window.addEventListener('pagehide', () => cleanupManager.cleanup());

window.cleanupManager = cleanupManager;

// services.js - Enhanced with better error handling and features

class GradServices {
    constructor() {
        this.serviceColumns = [];
        this.isInitialized = false;
        this.currentExpanded = null;
        this.init();
    }

    init() {
        this.waitForElements().then(() => {
            this.initializeServices();
            this.setupEventListeners();
            this.isInitialized = true;
            console.log('GradServices initialized successfully');
        }).catch(error => {
            console.error('Failed to initialize GradServices:', error);
        });
    }

    waitForElements() {
        return new Promise((resolve, reject) => {
            const maxAttempts = 10;
            let attempts = 0;

            const checkElements = () => {
                this.serviceColumns = document.querySelectorAll('.grad-service-column');
                
                if (this.serviceColumns.length > 0) {
                    resolve();
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkElements, 100);
                } else {
                    reject(new Error('Service columns not found after maximum attempts'));
                }
            };

            checkElements();
        });
    }

    initializeServices() {
        // Remove any existing expanded classes
        this.serviceColumns.forEach(column => {
            column.classList.remove('grad-expanded');
        });

        // Expand first service by default
        if (this.serviceColumns.length > 0) {
            this.expandService(this.serviceColumns[0]);
        }

        // Add ARIA attributes for accessibility
        this.serviceColumns.forEach((column, index) => {
            column.setAttribute('role', 'button');
            column.setAttribute('tabindex', '0');
            column.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
            column.setAttribute('aria-label', `Expand ${this.getServiceName(column)} service`);
        });
    }

    setupEventListeners() {
        // Click events
        this.serviceColumns.forEach(column => {
            column.addEventListener('click', () => this.handleServiceClick(column));
        });

        // Keyboard navigation
        this.serviceColumns.forEach(column => {
            column.addEventListener('keydown', (e) => this.handleKeyDown(e, column));
        });

        // Window resize handling
        window.addEventListener('resize', () => this.handleResize());
    }

    handleServiceClick(clickedColumn) {
        if (clickedColumn.classList.contains('grad-expanded')) {
            return; // Already expanded, do nothing
        }

        this.expandService(clickedColumn);
    }

    expandService(column) {
        // Collapse all services
        this.serviceColumns.forEach(col => {
            col.classList.remove('grad-expanded');
            col.setAttribute('aria-expanded', 'false');
        });

        // Expand selected service
        column.classList.add('grad-expanded');
        column.setAttribute('aria-expanded', 'true');
        this.currentExpanded = column;

        // Trigger custom event
        this.dispatchServiceChangeEvent(column);
    }

    handleKeyDown(event, column) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.expandService(column);
        } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            this.navigateServices(event.key);
        }
    }

    navigateServices(direction) {
        const currentIndex = Array.from(this.serviceColumns).indexOf(this.currentExpanded);
        let newIndex;

        if (direction === 'ArrowRight') {
            newIndex = (currentIndex + 1) % this.serviceColumns.length;
        } else {
            newIndex = (currentIndex - 1 + this.serviceColumns.length) % this.serviceColumns.length;
        }

        this.expandService(this.serviceColumns[newIndex]);
    }

    handleResize() {
        // Add any resize-specific logic here
        if (window.innerWidth <= 768) {
            // Mobile-specific adjustments
            this.serviceColumns.forEach(column => {
                if (column.classList.contains('grad-expanded')) {
                    column.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }
    }

    getServiceName(column) {
        const serviceType = column.getAttribute('data-service');
        return serviceType ? serviceType.replace(/-/g, ' ') : 'Unknown Service';
    }

    dispatchServiceChangeEvent(column) {
        const event = new CustomEvent('serviceChanged', {
            detail: {
                service: this.getServiceName(column),
                element: column
            }
        });
        document.dispatchEvent(event);
    }

    // Public method to expand specific service by index
    expandServiceByIndex(index) {
        if (index >= 0 && index < this.serviceColumns.length) {
            this.expandService(this.serviceColumns[index]);
        }
    }

    // Public method to expand specific service by data attribute
    expandServiceByType(serviceType) {
        const service = document.querySelector(`[data-service="${serviceType}"]`);
        if (service) {
            this.expandService(service);
        }
    }

    // Public method to check if services are initialized
    getInitializationStatus() {
        return this.isInitialized;
    }
}

// Initialize services with error handling
function initializeGradServices() {
    try {
        if (!window.gradServices) {
            window.gradServices = new GradServices();
        }
        return window.gradServices;
    } catch (error) {
        console.error('Error initializing Grad Services:', error);
        return null;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGradServices);
} else {
    initializeGradServices();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GradServices, initializeGradServices };
}

// Global access
window.initializeGradServices = initializeGradServices;
window.GradServices = GradServices;
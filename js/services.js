// services.js - Updated for single expanded service functionality

function initializeGradServices() {
    console.log('Initializing Grad Services with single expanded service...');
    
    const serviceColumns = document.querySelectorAll('.grad-service-column');
    console.log('Found service columns:', serviceColumns.length);
    
    if (serviceColumns.length === 0) {
        console.error('No service columns found!');
        return;
    }
    
    // Expand first service by default
    if (!document.querySelector('.grad-expanded')) {
        serviceColumns[0].classList.add('grad-expanded');
    }
    
    // Add click event listeners to all service columns
    serviceColumns.forEach(column => {
        column.addEventListener('click', function() {
            console.log('Service column clicked');
            
            // Remove expanded class from all columns
            serviceColumns.forEach(col => col.classList.remove('grad-expanded'));
            
            // Add expanded class to clicked column
            this.classList.add('grad-expanded');
        });
    });
    
    console.log('Grad Services single expanded service functionality initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGradServices);
} else {
    initializeGradServices();
}

// Make function available globally for dynamic loading
window.initializeGradServices = initializeGradServices;
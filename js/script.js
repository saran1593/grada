// ================================
// Configuration
// ================================
window.ignoreHashReplace = false;
window.isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');

// ================================
// Path Utilities for Production
// ================================
function getCorrectPath(filePath) {
    if (!window.isProduction) {
        return filePath;
    }
    
    // Handle different path structures in production
    if (filePath.startsWith('components/')) {
        return filePath;
    }
    if (filePath.startsWith('../')) {
        return filePath.replace('../', '');
    }
    return filePath;
}

function getBasePath() {
    if (!window.isProduction) {
        return '';
    }
    // Adjust base path for production if needed
    return '';
}

// ================================
// Main Initialization
// ================================
document.addEventListener("DOMContentLoaded", () => {
    console.log('🚀 Initializing application...');
    
    // Initialize core features first
    document.documentElement.classList.add('loaded');
    navbarShrink();
    initMobileNavigation();
    preserveImageSizes();
    forceLogoSizeReduction();

    // Load components with better error handling
    initializeApplication();
});

function initializeApplication() {
    const loadSequence = [
        { id: "home", file: "components/home.html", type: "static" },
        { id: "about", file: "components/about.html", type: "static" },
        { id: "philosophy", file: "components/philosophy.html", type: "static" },
        {
            id: "services",
            file: "components/services.html",
            type: "hidden",
            callback: () => {
                hideSection('services');
                initializeServicesManager();
            }
        },
        {
            id: "projects",
            file: "components/projects1.html",
            type: "hidden",
            callback: () => {
                hideSection('projects');
            }
        },
        {
            id: "careers",
            file: "components/careers.html",
            type: "hidden",
            callback: () => {
                hideSection('careers');
                initializeCareersForm();
            }
        },
        {
            id: "contact",
            file: "components/contact.html",
            type: "hidden",
            callback: () => {
                hideSection('contact');
                initializeContactForm();
            }
        },
        {
            id: "footer",
            file: "components/footer.html",
            type: "static",
            callback: () => {
                setTimeout(() => {
                    initializeFooterNavigation();
                }, 100);
            }
        },
        {
            id: "footer1",
            file: "components/footer1.html",
            type: "hidden",
            callback: () => {
                hideSection('footer1');
                initializeFooterComponents();
            }
        },
    ];

    loadComponentsSequentially(loadSequence, 0);
}

function loadComponentsSequentially(sequence, index) {
    if (index >= sequence.length) {
        console.log('✅ All components loaded');
        finalizeInitialization();
        return;
    }

    const item = sequence[index];
    const correctedPath = getCorrectPath(item.file);
    
    loadComponent(item.id, correctedPath, () => {
        if (item.callback) {
            try {
                item.callback();
            } catch (error) {
                console.error(`Error in callback for ${item.id}:`, error);
            }
        }
        
        // Load next component with minimal delay
        setTimeout(() => {
            loadComponentsSequentially(sequence, index + 1);
        }, 30);
    });
}

function finalizeInitialization() {
    initNavigationHandlers();
    
    // Handle stored navigation
    const storedSection = sessionStorage.getItem('scrollToSection');
    if (storedSection) {
        handleStoredNavigation(storedSection);
    } else {
        initScrollSpy();
    }

    // Initialize additional features
    setTimeout(() => {
        initScrollFeatures();
        enhanceResponsiveDesign();
        initializeAllForms();
        removeEmptySpace();
        
        console.log('🎉 Application fully initialized');
    }, 150);
}

function handleStoredNavigation(sectionId) {
    console.log('🎯 Handling stored navigation to:', sectionId);
    
    sessionStorage.removeItem('scrollToSection');
    window.ignoreHashReplace = true;
    
    setTimeout(() => {
        const navLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
        
        if (navLink) {
            handleNavigationClick(sectionId, navLink);
            setTimeout(() => {
                scrollToSection(sectionId);
                setTimeout(() => {
                    window.ignoreHashReplace = false;
                    if (typeof initScrollSpy === 'function') {
                        initScrollSpy();
                    }
                }, 100);
            }, 100);
        } else {
            console.warn('⚠️ Could not find nav link for:', sectionId);
            window.ignoreHashReplace = false;
            initScrollSpy();
        }
    }, 100);
}

// ================================
// Section Management
// ================================
function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'none';
        section.classList.add('hidden-section');
    }
}

function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        section.classList.remove('hidden-section');
        // Reset any positioning
        section.style.position = '';
        section.style.top = '';
        section.style.left = '';
        section.style.transform = '';
    }
}

function hideAllHiddenSections() {
    const hiddenSections = ['services', 'projects', 'careers', 'contact', 'footer1'];
    hiddenSections.forEach(sectionId => {
        hideSection(sectionId);
    });
}

function hideStaticSections() {
    const staticSections = ['home', 'about', 'philosophy', 'footer'];
    staticSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    });
}

function showStaticSections() {
    const staticSections = ['home', 'about', 'philosophy', 'footer'];
    staticSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
    });
}

// ================================
// Navigation Handlers
// ================================
function initNavigationHandlers() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        // Remove existing listeners
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // Add new listener
        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                handleNavigationClick(targetId, this);
            } else if (href && href.includes('index.html#')) {
                // Handle links from project pages
                const targetId = href.split('#')[1];
                sessionStorage.setItem('scrollToSection', targetId);
                window.location.href = getBasePath() + 'index.html';
            }
        });
    });
}

function handleNavigationClick(targetId, clickedLink) {
    console.log('🔄 Navigation to:', targetId);
    
    // Reset all sections first
    hideAllHiddenSections();
    hideStaticSections();
    
    // Show appropriate sections based on target
    if (['home', 'about', 'philosophy'].includes(targetId)) {
        showStaticSections();
        setActiveNavLink(clickedLink);
        
        setTimeout(() => {
            initScrollSpy();
            scrollToSection(targetId);
        }, 100);
    } 
    else if (targetId === 'services') {
        showSection('services');
        showSection('projects');
        showSection('footer1');
        setActiveNavLink(clickedLink);
        
        setTimeout(() => {
            scrollToSection('services');
        }, 50);
    } 
    else if (targetId === 'projects') {
        showSection('services');
        showSection('projects');
        showSection('footer1');
        setActiveNavLink(clickedLink);
        
        setTimeout(() => {
            scrollToSection('projects');
        }, 50);
    } 
    else if (targetId === 'careers') {
        showSection('careers');
        setActiveNavLink(clickedLink);
        
        setTimeout(() => {
            scrollToSection('careers');
        }, 50);
    } 
    else if (targetId === 'contact') {
        showSection('contact');
        setActiveNavLink(clickedLink);
        
        setTimeout(() => {
            scrollToSection('contact');
        }, 50);
    } 
    else if (targetId === 'footer') {
        showStaticSections();
        setActiveNavLink(clickedLink);
        scrollToSection('footer');
    }
}

function setActiveNavLink(activeLink) {
    const allNavLinks = document.querySelectorAll('.navbar-nav .nav-link');
    allNavLinks.forEach(link => {
        link.classList.remove('active');
    });
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const offsetTop = section.offsetTop - navbarHeight;

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        // Update URL hash
        try {
            window.history.replaceState(null, null, `#${sectionId}`);
        } catch (e) {
            console.warn('Could not update history state:', e);
        }
    }
}

// ================================
// Component Loading
// ================================
function loadComponent(sectionId, filePath, callback) {
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`❌ Section ${sectionId} not found`);
        if (callback) callback();
        return;
    }

    section.classList.add('component-loading');

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} for ${filePath}`);
            }
            return response.text();
        })
        .then(data => {
            section.innerHTML = data;
            section.classList.remove('component-loading');
            section.classList.add('loaded');

            // Initialize component-specific features
            setTimeout(() => {
                initScrollFeatures();
                navbarShrink();
                
                if (sectionId === 'careers' || sectionId === 'contact') {
                    initializeFormsForSection(sectionId);
                }
            }, 50);

            if (callback) callback();
        })
        .catch(error => {
            console.error(`Error loading ${filePath}:`, error);
            section.classList.remove('component-loading');
            section.innerHTML = `
                <div class="alert alert-warning">
                    <strong>Content Loading Failed</strong><br>
                    Please refresh the page or contact support if the problem persists.
                    <br><small>Error: ${error.message}</small>
                </div>
            `;
            if (callback) callback();
        });
}

// ================================
// Form Initialization
// ================================
function initializeAllForms() {
    initializeCareersForm();
    initializeContactForm();
    initializeFooterForm();
}

function initializeServicesManager() {
    const initServices = () => {
        console.log("🔄 Initializing services...");
        if (typeof ServicesManager !== 'undefined') {
            window.servicesManager = new ServicesManager();
        } else if (typeof initializeServices !== 'undefined') {
            window.servicesManager = initializeServices();
        } else if (typeof initializeGradServices !== 'undefined') {
            window.servicesManager = initializeGradServices();
        } else {
            setTimeout(initServices, 200);
        }
    };
    setTimeout(initServices, 100);
}

function initializeCareersForm() {
    const form = document.getElementById('careerForm');
    if (!form) {
        setTimeout(initializeCareersForm, 200);
        return;
    }

    // Clone to remove existing listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    const currentForm = document.getElementById('careerForm');
    
    currentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleCareersFormSubmit(currentForm);
    });
}

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) {
        setTimeout(initializeContactForm, 200);
        return;
    }

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    const currentForm = document.getElementById('contactForm');
    
    currentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleContactFormSubmit(currentForm);
    });
}

function initializeFooterForm() {
    const form = document.getElementById('projectForm');
    if (!form) {
        setTimeout(initializeFooterForm, 200);
        return;
    }

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    const currentForm = document.getElementById('projectForm');
    
    currentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleFooterFormSubmit(currentForm);
    });
}

function initializeFooterComponents() {
    initializeFooterForm();
    initializeFooterNavigation();
}

// ================================
// Form Submission Handlers
// ================================
async function handleContactFormSubmit(form) {
    const name = document.getElementById('contactName')?.value.trim() || '';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const phone = document.getElementById('contactPhone')?.value.trim() || '';
    const message = document.getElementById('contactMessage')?.value.trim() || '';

    if (!name || !email || !phone || !message) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }

    const submitBtn = form.querySelector('.grad-contact-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
    submitBtn.disabled = true;

    try {
        await saveToGoogleSheets({ name, email, phone, message, type: 'contact' });
        showToast('Thank you for your message! We will get back to you soon.');
        form.reset();
    } catch (error) {
        console.error('Form submission error:', error);
        showAlert('There was an error submitting your form. Please try again or contact us directly.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function handleFooterFormSubmit(form) {
    const name = document.getElementById('projectName')?.value.trim() || '';
    const email = document.getElementById('projectEmail')?.value.trim() || '';
    const phone = document.getElementById('projectPhone')?.value.trim() || '';
    const message = document.getElementById('projectMessage')?.value.trim() || '';

    if (!name || !email || !phone || !message) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }

    const submitBtn = form.querySelector('.footer-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
    submitBtn.disabled = true;

    try {
        await saveToGoogleSheets({ name, email, phone, message, type: 'project' });
        showToast('Thank you for your message! We will get back to you soon.');
        form.reset();
    } catch (error) {
        console.error('Form submission error:', error);
        showAlert('There was an error submitting your form. Please try again or contact us directly.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function handleCareersFormSubmit(form) {
    const name = document.getElementById('careerName')?.value.trim() || '';
    const phone = document.getElementById('careerPhone')?.value.trim() || '';
    const email = document.getElementById('careerEmail')?.value.trim() || '';
    const message = document.getElementById('careerMessage')?.value.trim() || '';

    // Validation
    if (!name || !phone || !email || !message) {
        showAlert("Please fill in all fields.", "error");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert("Please enter a valid email address.", "error");
        return;
    }

    const subject = `Career Application - ${name}`;
    const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nThis message was sent from the Grad Architects Careers page.`;

    const mailtoLink = `mailto:barathbalag@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const submitBtn = form.querySelector('.grad-careers-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Opening Email...';
    submitBtn.disabled = true;

    setTimeout(() => {
        window.open(mailtoLink, '_blank');
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showAlert("Thank you for your application! Please send the pre-filled email to complete your application.", "success");
        }, 2000);
    }, 1000);
}

// ================================
// UI Utilities
// ================================
function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function showAlert(message, type = "info") {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert alert-${type === 'error' ? 'danger' : 'success'} fade show`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 500px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    alertDiv.innerHTML = `
        <strong>${type === 'error' ? 'Error!' : 'Success!'}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// ================================
// Google Sheets Integration
// ================================
async function saveToGoogleSheets(formData) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx0NylMw9o6v3LhJbrgc9yy-63GtAENElbt3f75FyNgy1R-F94i0Ujq-WD_7ZBJkno/exec';

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "no-cors"
        });
        
        showToast("Thank you! Your information has been saved.");
        return true;
    } catch (error) {
        console.error('Google Sheets error:', error);
        throw error;
    }
}

// ================================
// Additional Initialization Functions
// ================================
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    let isScrolling = false;

    function updateActiveNavLink() {
        if (isScrolling) return;
        isScrolling = true;

        const scrollPosition = window.scrollY + 200;
        let currentSectionId = '';

        sections.forEach(section => {
            if (section.style.display === 'none') return;

            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });

            if (!window.ignoreHashReplace && window.location.hash !== `#${currentSectionId}`) {
                history.replaceState(null, null, `#${currentSectionId}`);
            }
        }

        setTimeout(() => { isScrolling = false; }, 50);
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavLink, 50);
    });
    
    updateActiveNavLink();
}

function initMobileNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);

                handleNavigationClick(targetId, link);

                if (window.innerWidth < 768) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) ||
                        new bootstrap.Collapse(navbarCollapse, { toggle: false });
                    bsCollapse.hide();
                }
            });
        });
    }
}

function initializeFooterNavigation() {
    const footerLinks = document.querySelectorAll('.footer-links a');

    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }

            if (href === '#') {
                e.preventDefault();
                showAlert('This page is under construction. Please check back later.', 'info');
                return;
            }

            if (href.includes('#')) {
                e.preventDefault();
                const section = href.split('#')[1];

                const currentPath = window.location.pathname;
                const isOnProjectPage = currentPath.includes('/project/') || 
                                      (currentPath.includes('/components/') && !currentPath.includes('index.html'));

                if (isOnProjectPage) {
                    sessionStorage.setItem('scrollToSection', section);
                    window.location.href = getBasePath() + '../../index.html';
                } else {
                    const mainNavLink = document.querySelector(`.navbar-nav .nav-link[href="#${section}"]`);
                    if (mainNavLink) {
                        handleNavigationClick(section, mainNavLink);
                    } else {
                        console.error('❌ Could not find navbar link for section:', section);
                    }
                }
            }
        });
    });
}

function navbarShrink() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const shrinkNavbar = () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    shrinkNavbar();
    window.addEventListener("scroll", shrinkNavbar);
}

function forceLogoSizeReduction() {
    const navbarLogo = document.querySelector('.navbar-logo');
    if (navbarLogo) {
        navbarLogo.style.height = '25px';
        navbarLogo.style.maxHeight = '25px';
        navbarLogo.style.width = 'auto';
    }

    const philosophyLogo = document.querySelector('.philosophy-logo');
    if (philosophyLogo) {
        philosophyLogo.style.height = '35px';
        philosophyLogo.style.maxHeight = '35px';
        philosophyLogo.style.width = 'auto';
    }

    // Responsive adjustments
    if (window.innerWidth <= 768) {
        if (navbarLogo) navbarLogo.style.height = '20px';
        if (philosophyLogo) philosophyLogo.style.height = '28px';
    }
    if (window.innerWidth <= 576) {
        if (navbarLogo) navbarLogo.style.height = '18px';
        if (philosophyLogo) philosophyLogo.style.height = '25px';
    }
    if (window.innerWidth <= 400) {
        if (navbarLogo) navbarLogo.style.height = '16px';
        if (philosophyLogo) philosophyLogo.style.height = '22px';
    }
}

function preserveImageSizes() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.maxWidth = '100%';
        img.loading = 'lazy';
    });
}

function removeEmptySpace() {
    document.body.style.minHeight = '100vh';
    document.documentElement.style.minHeight = '100vh';

    const footer = document.getElementById('footer');
    if (footer) {
        footer.style.marginTop = 'auto';
    }

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.minHeight = 'auto';
    });
}

function initScrollFeatures() {
    console.log("Initializing scroll features...");
}

function enhanceResponsiveDesign() {
    console.log("Enhancing responsive design...");
}

function initializeFormsForSection(sectionId) {
    if (sectionId === 'careers') {
        initializeCareersForm();
    } else if (sectionId === 'contact') {
        initializeContactForm();
    }
}

// ================================
// Global Exports
// ================================
window.initializeFooterNavigation = initializeFooterNavigation;
window.initializeCareersForm = initializeCareersForm;
window.initializeContactForm = initializeContactForm;
window.handleNavigationClick = handleNavigationClick;
window.hideSection = hideSection;
window.showSection = showSection;
window.hideAllHiddenSections = hideAllHiddenSections;
window.hideStaticSections = hideStaticSections;
window.showStaticSections = showStaticSections;
window.setActiveNavLink = setActiveNavLink;
window.scrollToSection = scrollToSection;
window.saveToGoogleSheets = saveToGoogleSheets;
window.showToast = showToast;
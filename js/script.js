// ================================
// Main Initialization
// ================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, starting to load components...");

    // Mark HTML as loaded to prevent FOUC
    document.documentElement.classList.add('loaded');

    // Initialize core features first
    navbarShrink();
    initMobileNavigation();
    preserveImageSizes();
    forceLogoSizeReduction();

    const loadSequence = [
        { id: "home", file: "components/home.html", type: "static" },
        { id: "about", file: "components/about.html", type: "static" },
        { id: "philosophy", file: "components/philosophy.html", type: "static" },
        {
            id: "services",
            file: "components/services.html",
            type: "hidden",
            callback: () => {
                console.log("✅ Services component loaded successfully");
                hideSection('services');

                const initServices = () => {
                    console.log("🔄 Force initializing services...");
                    if (typeof ServicesManager !== 'undefined') {
                        window.servicesManager = new ServicesManager();
                    } else if (typeof initializeServices !== 'undefined') {
                        window.servicesManager = initializeServices();
                    } else if (typeof initializeGradServices !== 'undefined') {
                        window.servicesManager = initializeGradServices();
                    } else {
                        setTimeout(initServices, 500);
                    }
                };
                setTimeout(initServices, 300);
            }
        },

        {
            id: "projects",
            file: "components/projects1.html", // Changed from projects.html to projects1.html
            type: "hidden",
            callback: () => {
                console.log("Projects component loaded successfully");
                hideSection('projects');
                // Remove this line if it causes issues: setTimeout(initializeProjects, 100);
            }
        },
        {
            id: "careers",
            file: "components/careers.html",
            type: "hidden",
            callback: () => {
                console.log("Careers component loaded successfully");
                hideSection('careers');

                const initCareers = () => {
                    if (typeof initializeCareersForm === 'function') {
                        initializeCareersForm();
                    } else {
                        setTimeout(initCareers, 300);
                    }
                };
                setTimeout(initCareers, 200);
            }
        },
        {
            id: "contact",
            file: "components/contact.html",
            type: "hidden",
            callback: () => {
                console.log("Contact component loaded successfully");
                hideSection('contact');

                const initContact = () => {
                    if (typeof initializeContactForm === 'function') {
                        initializeContactForm();
                    } else {
                        setTimeout(initContact, 300);
                    }
                };
                setTimeout(initContact, 200);
            }
        },
        {
            id: "footer",
            file: "components/footer.html",
            type: "static",
            callback: () => {
                console.log("Footer component loaded successfully");
                setTimeout(() => {
                    initializeFooterNavigation();
                }, 200);
            }
        },
        {
            id: "footer1",
            file: "components/footer1.html",
            type: "hidden",
            callback: () => {
                console.log("Footer1 component loaded successfully");
                hideSection('footer1');
                setTimeout(() => {
                    initializeFooterNavigation();
                }, 200);
            }
        },

    ];
    // Load components sequentially
    function loadNextComponent(index) {
        if (index >= loadSequence.length) {
            console.log("All components loaded");
            initNavigationHandlers();
            setTimeout(() => {
                initScrollFeatures();
                enhanceResponsiveDesign();
                initializeAllForms();
                removeEmptySpace(); // Remove extra space at bottom
            }, 500);
            return;
        }

        const item = loadSequence[index];
        loadComponent(item.id, item.file, item.callback);
        setTimeout(() => loadNextComponent(index + 1), 100);
    }

    // Start loading sequence
    loadNextComponent(0);
});

// ================================
// NEW: Remove empty space at bottom
// ================================
function removeEmptySpace() {
    // Set body and html to full height
    document.body.style.minHeight = '100vh';
    document.documentElement.style.minHeight = '100vh';

    // Ensure footer is at bottom
    const footer = document.getElementById('footer');
    if (footer) {
        footer.style.marginTop = 'auto';
    }

    // Remove any extra padding/margin from main sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.minHeight = 'auto';
    });

    console.log("✅ Removed empty space at bottom");
}

// ================================
// SECTION VISIBILITY FUNCTIONS
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
// NAVIGATION HANDLERS
// ================================

function initNavigationHandlers() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            handleNavigationClick(targetId, this);
        });
    });
}

function handleNavigationClick(targetId, clickedLink) {
    console.log("Navigation clicked:", targetId);

    const staticSections = ['home', 'about', 'philosophy', 'footer'];
    const hiddenSections = ['services', 'projects', 'careers', 'contact', 'footer1'];

    // If clicking a STATIC section (HOME, ABOUT, PHILOSOPHY)
    if (['home', 'about', 'philosophy'].includes(targetId)) {
        // Show all static sections, hide all hidden sections
        showStaticSections();
        hideAllHiddenSections();
        setActiveNavLink(clickedLink);
        scrollToSection(targetId);
    }
    // If clicking SERVICES - Show SERVICES + PROJECTS + FOOTER1 (combined page)
    else if (targetId === 'services') {
        // Hide static sections and other hidden sections
        hideStaticSections();
        hideAllHiddenSections();

        // Show the combined services page
        showSection('services');
        showSection('projects');
        showSection('footer1');

        setActiveNavLink(clickedLink);
        scrollToSection('services');
    }
    // If clicking PROJECTS - Also show combined page (same as services)
    else if (targetId === 'projects') {
        // Hide static sections and other hidden sections
        hideStaticSections();
        hideAllHiddenSections();

        // Show the combined services page
        showSection('services');
        showSection('projects');
        showSection('footer1');

        setActiveNavLink(clickedLink);
        scrollToSection('projects');
    }
    // If clicking CAREERS - Show only careers page
    else if (targetId === 'careers') {
        // Hide static sections and other hidden sections
        hideStaticSections();
        hideAllHiddenSections();

        // Show only careers
        showSection('careers');

        setActiveNavLink(clickedLink);
        scrollToSection('careers');
    }
    // If clicking CONTACT - Show only contact page
    else if (targetId === 'contact') {
        // Hide static sections and other hidden sections
        hideStaticSections();
        hideAllHiddenSections();

        // Show only contact
        showSection('contact');

        setActiveNavLink(clickedLink);
        scrollToSection('contact');
    }
    // If clicking FOOTER (from static pages)
    else if (targetId === 'footer') {
        setActiveNavLink(clickedLink);
        scrollToSection('footer');
    }
}

function setActiveNavLink(activeLink) {
    const allNavLinks = document.querySelectorAll('.navbar-nav .nav-link');
    allNavLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
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

        window.history.pushState(null, null, `#${sectionId}`);
    }
}

// ================================
// MOBILE NAVIGATION
// ================================

function initMobileNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);

                // Handle the navigation click
                handleNavigationClick(targetId, link);

                // Close mobile menu
                if (window.innerWidth < 768) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) ||
                        new bootstrap.Collapse(navbarCollapse, { toggle: false });
                    bsCollapse.hide();
                }
            });
        });
    }
}

// ================================
// EXISTING FUNCTIONS (NO CHANGES)
// ================================

function loadComponent(sectionId, filePath, callback) {
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`Section ${sectionId} not found`);
        return;
    }

    section.classList.add('component-loading');

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            section.innerHTML = data;
            section.classList.remove('component-loading');
            section.classList.add('loaded');

            setTimeout(() => {
                initScrollFeatures();
                navbarShrink();
                if (sectionId === 'careers' || sectionId === 'contact') {
                    initializeFormsForSection(sectionId);
                }
            }, 100);

            if (callback) callback();
        })
        .catch(error => {
            console.error("Error loading " + filePath, error);
            section.classList.remove('component-loading');
            section.innerHTML = `<div class="alert alert-warning">Failed to load content. Please refresh the page.</div>`;
        });
}

function initializeAllForms() {
    console.log("🔄 Initializing all forms...");
    initializeCareersForm();
    initializeContactForm();
}

function initializeFormsForSection(sectionId) {
    console.log(`🔄 Initializing forms for section: ${sectionId}`);
    if (sectionId === 'careers') {
        initializeCareersForm();
    } else if (sectionId === 'contact') {
        initializeContactForm();
    }
}

// KEEP ALL YOUR EXISTING FUNCTIONS EXACTLY AS THEY WERE:
function initializeCareersForm() {
    const form = document.getElementById('careerForm');
    if (!form) {
        console.log("❌ Career form not found");
        return;
    }

    console.log("✅ Career form found, attaching event listener");
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    const currentForm = document.getElementById('careerForm');

    currentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log("✅ Careers form submit triggered");

        const name = document.getElementById('careerName') ? document.getElementById('careerName').value.trim() : '';
        const phone = document.getElementById('careerPhone') ? document.getElementById('careerPhone').value.trim() : '';
        const email = document.getElementById('careerEmail') ? document.getElementById('careerEmail').value.trim() : '';
        const message = document.getElementById('careerMessage') ? document.getElementById('careerMessage').value.trim() : '';

        if (!name || !phone || !email || !message) {
            showAlert("Please fill in all fields.", "error");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert("Please enter a valid email address.", "error");
            return;
        }

        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            showAlert("Please enter a valid phone number.", "error");
            return;
        }

        const subject = `Career Application - ${name}`;
        const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nThis message was sent from the Grad Architects Careers page.`;

        const mailtoLink = `mailto:barathbalag@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        console.log("📨 Opening mail client:", mailtoLink);

        const submitBtn = currentForm.querySelector('.grad-careers-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Opening Email...';
        submitBtn.disabled = true;

        setTimeout(() => {
            window.open(mailtoLink, '_blank');
            setTimeout(() => {
                currentForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showAlert("Thank you for your application! Please send the pre-filled email to complete your application.", "success");
            }, 2000);
        }, 1000);
    });

    console.log("✅ Careers form handler attached successfully");
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.log("❌ Contact form not found");
        return;
    }

    console.log("✅ Contact form found, attaching event listener");
    const newForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newForm, contactForm);
    const currentForm = document.getElementById('contactForm');

    currentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log("✅ Contact form submit triggered");

        const name = document.getElementById('contactName') ? document.getElementById('contactName').value.trim() : '';
        const email = document.getElementById('contactEmail') ? document.getElementById('contactEmail').value.trim() : '';
        const phone = document.getElementById('contactPhone') ? document.getElementById('contactPhone').value.trim() : '';
        const message = document.getElementById('contactMessage') ? document.getElementById('contactMessage').value.trim() : '';

        if (!name || !email || !phone || !message) {
            showAlert('Please fill in all required fields.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Please enter a valid email address.', 'error');
            return;
        }

        const whatsappMessage = `Hello Grad Architects!\n\nI would like to get in touch with you:\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n\n*Message:*\n${message}\n\n---\nThis message was sent from your website contact form.`;
        const whatsappNumber = '919840904236';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        console.log("📱 WhatsApp URL:", whatsappUrl);

        const submitBtn = currentForm.querySelector('.grad-contact-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Opening WhatsApp...';
        submitBtn.disabled = true;

        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            setTimeout(() => {
                currentForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showAlert("Thank you for your message! WhatsApp should open with a pre-filled message. Please send it to complete your inquiry.", "success");
            }, 2000);
        }, 1000);
    });

    console.log("✅ Contact form handler attached successfully");
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
// Add this new function to script.js (add it after initializeContactForm function)

function initializeFooterNavigation() {
    console.log("🔄 Initializing footer navigation...");

    // Initialize project form in footer
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        console.log("✅ Footer project form found");

        // Remove any existing event listeners by cloning
        const newForm = projectForm.cloneNode(true);
        projectForm.parentNode.replaceChild(newForm, projectForm);
        const currentForm = document.getElementById('projectForm');

        currentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log("✅ Footer project form submit triggered");

            const name = document.getElementById('projectName')?.value.trim() || '';
            const phone = document.getElementById('projectPhone')?.value.trim() || '';
            const message = document.getElementById('projectMessage')?.value.trim() || '';

            if (!name || !phone || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            const subject = `New Project Inquiry from ${name}`;
            const body = `Name: ${name}%0D%0APhone: ${phone}%0D%0AMessage: ${message}`;
            const mailtoLink = `mailto:info@gradarchitects.com?subject=${encodeURIComponent(subject)}&body=${body}`;

            window.location.href = mailtoLink;

            setTimeout(() => {
                currentForm.reset();
            }, 1000);
        });

        console.log("✅ Footer project form handler attached");
    } else {
        console.log("❌ Footer project form not found");
    }

    // Initialize footer navigation links
    const footerLinks = document.querySelectorAll('.footer-links a');
    console.log(`📍 Found ${footerLinks.length} footer links`);

    footerLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            console.log('🔗 Footer link clicked:', href);

            // Skip external links
            if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                console.log('⏭️ External link, allowing default behavior');
                return;
            }

            // Handle placeholder links
            if (href === '#') {
                e.preventDefault();
                alert('This page is under construction. Please check back later.');
                return;
            }

            // Handle section navigation
            if (href.includes('#')) {
                e.preventDefault();
                const section = href.split('#')[1];
                console.log('📍 Navigating to section:', section);

                // Check if on project page
                const currentPath = window.location.pathname;
                const isOnProjectPage = currentPath.includes('/project/') ||
                    (currentPath.includes('/components/') &&
                        !currentPath.includes('index.html'));

                if (isOnProjectPage) {
                    console.log('📄 On project page, redirecting to index');
                    sessionStorage.setItem('scrollToSection', section);
                    window.location.href = '../../index.html#' + section;
                } else {
                    console.log('🏠 On index page, triggering navigation');

                    // Find the navbar link
                    const mainNavLink = document.querySelector(`.navbar-nav .nav-link[href="#${section}"]`);

                    if (mainNavLink) {
                        console.log('✅ Found navbar link, triggering handleNavigationClick');
                        handleNavigationClick(section, mainNavLink);
                    } else {
                        console.error('❌ Could not find navbar link for section:', section);
                    }
                }
            }
        });
    });

    console.log('✅ Footer navigation initialized');
}

// Make it globally available
window.initializeFooterNavigation = initializeFooterNavigation;

function forceLogoSizeReduction() {
    console.log('Forcing logo size reduction...');
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

function navbarShrink() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) {
        console.log("Navbar not found");
        return;
    }

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

function preserveImageSizes() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.maxWidth = '100%';
        img.loading = 'lazy';
    });
}

function initializeProjects() {
    const projectImages = document.querySelectorAll('.project-img');
    projectImages.forEach(img => {
        img.style.objectFit = 'cover';
        img.style.width = '100%';
        img.style.height = '100%';
    });
}

function initScrollFeatures() {
    console.log("Initializing scroll features...");
    // Modified to only work with visible sections
}

function enhanceResponsiveDesign() {
    console.log("Enhancing responsive design...");
}

// Make functions available globally
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

console.log('✅ Navigation functions made globally accessible');
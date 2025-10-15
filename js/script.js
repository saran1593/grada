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

    // Define section types
    const staticSections = ['home', 'about', 'philosophy', 'footer'];
    const hiddenSections = ['services', 'projects', 'careers', 'contact'];

    // Load components with proper sequencing
    const loadSequence = [
        { id: "home", file: "components/home.html" },
        { id: "about", file: "components/about.html" },
        { id: "philosophy", file: "components/philosophy.html" },
        {
            id: "services",
            file: "components/services.html",
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
            file: "components/projects.html",
            callback: () => {
                console.log("Projects component loaded successfully");
                hideSection('projects');
                setTimeout(initializeProjects, 100);
            }
        },
        {
            id: "careers",
            file: "components/careers.html",
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
            callback: () => {
                console.log("Footer component loaded successfully");
            }
        }
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
    const hiddenSections = ['services', 'projects', 'careers', 'contact'];
    hiddenSections.forEach(sectionId => {
        hideSection(sectionId);
    });
}

// ================================
// NAVIGATION HANDLERS
// ================================

function initNavigationHandlers() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            handleNavigationClick(targetId, this);
        });
    });
}

function handleNavigationClick(targetId, clickedLink) {
    console.log("Navigation clicked:", targetId);
    
    const staticSections = ['home', 'about', 'philosophy', 'footer'];
    const hiddenSections = ['services', 'projects', 'careers', 'contact'];
    
    // If clicking a STATIC section (HOME, ABOUT, PHILOSOPHY, FOOTER)
    if (staticSections.includes(targetId)) {
        // Hide ALL hidden sections
        hideAllHiddenSections();
        setActiveNavLink(clickedLink);
        scrollToSection(targetId);
    }
    // If clicking a HIDDEN section (SERVICES, PROJECTS, CAREERS, CONTACT)
    else if (hiddenSections.includes(targetId)) {
        // Hide all other hidden sections first
        hideAllHiddenSections();
        // Show only the clicked section
        showSection(targetId);
        setActiveNavLink(clickedLink);
        scrollToSection(targetId);
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
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    navLinks.forEach(link => link.classList.remove("active"));

    if (sections.length === 0) {
        console.warn("No sections found for intersection observer");
        return;
    }

    const projectSubSections = [
        'project-categories',
        'in-residence',
        'soft-minimal',
        'objects-of-desire',
        'projects-content'
    ];

    const observer = new IntersectionObserver(
        (entries) => {
            let mostVisibleSection = null;
            let highestRatio = 0;

            entries.forEach((entry) => {
                let sectionId = entry.target.id;
                if (sectionId.endsWith('-content')) {
                    sectionId = sectionId.replace('-content', '');
                }
                if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
                    highestRatio = entry.intersectionRatio;
                    mostVisibleSection = entry.target.id;
                }
            });

            if (mostVisibleSection && highestRatio > 0.1) {
                let activeNavId = mostVisibleSection;
                
                if (projectSubSections.includes(mostVisibleSection)) {
                    activeNavId = 'projects';
                }
                
                if (!document.getElementById(activeNavId)?.classList.contains('hidden-section')) {
                    navLinks.forEach(link => {
                        const linkHref = link.getAttribute('href').substring(1);
                        if (linkHref === activeNavId) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            }
        },
        {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '-20% 0px -20% 0px'
        }
    );

    sections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });
}

function enhanceResponsiveDesign() {
    console.log("Enhancing responsive design...");
}

// Make functions available globally
window.initializeCareersForm = initializeCareersForm;
window.initializeContactForm = initializeContactForm;
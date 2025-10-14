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
                
                // Force services initialization with multiple fallbacks
                const initServices = () => {
                    console.log("🔄 Force initializing services...");
                    
                    if (typeof ServicesManager !== 'undefined') {
                        console.log("🎯 Using ServicesManager class");
                        window.servicesManager = new ServicesManager();
                    } else if (typeof initializeServices !== 'undefined') {
                        console.log("🎯 Using initializeServices function");
                        window.servicesManager = initializeServices();
                    } else if (typeof initializeGradServices !== 'undefined') {
                        console.log("🎯 Using initializeGradServices function");
                        window.servicesManager = initializeGradServices();
                    } else {
                        console.log("❌ Services functions not found, retrying...");
                        setTimeout(initServices, 500);
                    }
                };
                
                // Try multiple times with increasing delays
                setTimeout(initServices, 300);
                setTimeout(initServices, 1000);
                setTimeout(initServices, 2000);
            }
        },
        {
            id: "projects", 
            file: "components/projects.html", 
            callback: () => {
                console.log("Projects component loaded successfully");
                setTimeout(initializeProjects, 100);
            }
        },
        {
            id: "careers", 
            file: "components/careers.html", 
            callback: () => {
                console.log("Careers component loaded successfully");
                // Initialize careers form with retry mechanism
                const initCareers = () => {
                    if (typeof initializeCareersForm === 'function') {
                        console.log("✅ Initializing careers form");
                        initializeCareersForm();
                    } else {
                        console.log("🔄 Careers form function not ready, retrying...");
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
                // Initialize contact form with retry mechanism
                const initContact = () => {
                    if (typeof initializeContactForm === 'function') {
                        console.log("✅ Initializing contact form");
                        initializeContactForm();
                    } else {
                        console.log("🔄 Contact form function not ready, retrying...");
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
      
    


    // Load components sequentially to avoid race conditions
    function loadNextComponent(index) {
        if (index >= loadSequence.length) {
            console.log("All components loaded");
            // Final initialization after all components are loaded
            setTimeout(() => {
                initScrollFeatures();
                enhanceResponsiveDesign();
                initializeAllForms(); // Ensure all forms are initialized
            }, 500);
            return;
        }

        const item = loadSequence[index];
        loadComponent(item.id, item.file, item.callback);

        // Load next component after a short delay
        setTimeout(() => loadNextComponent(index + 1), 100);
    }

    // Start loading sequence
    loadNextComponent(0);
});

// ================================
// Function to load HTML components into sections
// ================================
function loadComponent(sectionId, filePath, callback) {
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`Section ${sectionId} not found`);
        return;
    }

    // Add loading state
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

            // Add the section ID to the loaded content's main container
            const container = section.querySelector('div[class*="section"], section[class*="section"]');
            if (container && !container.id) {
                container.id = sectionId + '-content';
            }

            // Re-initialize navigation after content loads
            setTimeout(() => {
                initScrollFeatures();
                navbarShrink();
                
                // Initialize forms for this section
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

// ================================
// Form Initialization Functions
// ================================
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

// ================================
// Careers Form Handler (Email)
// ================================
function initializeCareersForm() {
    const form = document.getElementById('careerForm');

    if (!form) {
        console.log("❌ Career form not found (may not be on current page)");
        return;
    }

    console.log("✅ Career form found, attaching event listener");

    // Remove any existing event listeners to prevent duplicates
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    const currentForm = document.getElementById('careerForm');

    currentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log("✅ Careers form submit triggered");

        // Get form values
        const name = document.getElementById('careerName') ? document.getElementById('careerName').value.trim() : '';
        const phone = document.getElementById('careerPhone') ? document.getElementById('careerPhone').value.trim() : '';
        const email = document.getElementById('careerEmail') ? document.getElementById('careerEmail').value.trim() : '';
        const message = document.getElementById('careerMessage') ? document.getElementById('careerMessage').value.trim() : '';

        // Validation
        if (!name || !phone || !email || !message) {
            showAlert("Please fill in all fields.", "error");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert("Please enter a valid email address.", "error");
            return;
        }

        // Phone validation
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            showAlert("Please enter a valid phone number.", "error");
            return;
        }

        // Create mailto link
        const subject = `Career Application - ${name}`;
        const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nThis message was sent from the Grad Architects Careers page.`;
        
        const mailtoLink = `mailto:barathbalag@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        console.log("📨 Opening mail client:", mailtoLink);
        
        // Show loading state
        const submitBtn = currentForm.querySelector('.grad-careers-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Opening Email...';
        submitBtn.disabled = true;

        // Open default email client in new tab
        setTimeout(() => {
            window.open(mailtoLink, '_blank');
            
            // Reset form and button after a delay
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

// ================================
// Contact Form Handler (WhatsApp)
// ================================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.log("❌ Contact form not found (may not be on current page)");
        return;
    }
    
    console.log("✅ Contact form found, attaching event listener");

    // Remove any existing event listeners
    const newForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newForm, contactForm);
    const currentForm = document.getElementById('contactForm');

    currentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("✅ Contact form submit triggered");
        
        const name = document.getElementById('contactName') ? document.getElementById('contactName').value.trim() : '';
        const email = document.getElementById('contactEmail') ? document.getElementById('contactEmail').value.trim() : '';
        const phone = document.getElementById('contactPhone') ? document.getElementById('contactPhone').value.trim() : '';
        const message = document.getElementById('contactMessage') ? document.getElementById('contactMessage').value.trim() : '';
        
        // Validation
        if (!name || !email || !phone || !message) {
            showAlert('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Please enter a valid email address.', 'error');
            return;
        }

        // Create WhatsApp message
        const whatsappMessage = `Hello Grad Architects!\n\nI would like to get in touch with you:\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n\n*Message:*\n${message}\n\n---\nThis message was sent from your website contact form.`;
        
        // WhatsApp phone number (replace with your actual number)
        const whatsappNumber = '919840904236'; // Remove any + or spaces
        
        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        console.log("📱 WhatsApp URL:", whatsappUrl);
        
        // Show loading state
        const submitBtn = currentForm.querySelector('.grad-contact-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Opening WhatsApp...';
        submitBtn.disabled = true;

        // Open WhatsApp in new tab
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            
            // Reset form and button after a delay
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

// ================================
// Alert System
// ================================
function showAlert(message, type = "info") {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert element
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

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// ================================
// FORCE LOGO SIZE REDUCTION
// ================================
function forceLogoSizeReduction() {
    console.log('Forcing logo size reduction...');

    // Force navbar logo size
    const navbarLogo = document.querySelector('.navbar-logo');
    if (navbarLogo) {
        navbarLogo.style.height = '25px';
        navbarLogo.style.maxHeight = '25px';
        navbarLogo.style.width = 'auto';
        console.log('Navbar logo size forced to 25px');
    }

    // Force philosophy logo size
    const philosophyLogo = document.querySelector('.philosophy-logo');
    if (philosophyLogo) {
        philosophyLogo.style.height = '35px';
        philosophyLogo.style.maxHeight = '35px';
        philosophyLogo.style.width = 'auto';
        console.log('Philosophy logo size forced to 35px');
    }

    // Apply responsive sizes
    if (window.innerWidth <= 768) {
        if (navbarLogo) {
            navbarLogo.style.height = '20px';
            navbarLogo.style.maxHeight = '20px';
        }
        if (philosophyLogo) {
            philosophyLogo.style.height = '28px';
            philosophyLogo.style.maxHeight = '28px';
        }
    }

    if (window.innerWidth <= 576) {
        if (navbarLogo) {
            navbarLogo.style.height = '18px';
            navbarLogo.style.maxHeight = '18px';
        }
        if (philosophyLogo) {
            philosophyLogo.style.height = '25px';
            philosophyLogo.style.maxHeight = '25px';
        }
    }

    if (window.innerWidth <= 400) {
        if (navbarLogo) {
            navbarLogo.style.height = '16px';
            navbarLogo.style.maxHeight = '16px';
        }
        if (philosophyLogo) {
            philosophyLogo.style.height = '22px';
            philosophyLogo.style.maxHeight = '22px';
        }
    }
}

// ================================
// Navbar shrink on scroll
// ================================
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

    // Initial check
    shrinkNavbar();

    // Listen for scroll events
    window.addEventListener("scroll", shrinkNavbar);
}

// ================================
// Mobile Navigation Handler - UPDATED
// ================================
function initMobileNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        // Get all navigation links
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        // Add click event to each navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // Close mobile menu first
                    if (window.innerWidth < 768) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) ||
                            new bootstrap.Collapse(navbarCollapse, { toggle: false });
                        bsCollapse.hide();
                    }

                    // Update active link
                    const allNavLinks = document.querySelectorAll('.navbar-nav .nav-link');
                    allNavLinks.forEach(navLink => navLink.classList.remove('active'));
                    link.classList.add('active');

                    // Wait for menu to close, then scroll to section
                    setTimeout(() => {
                        const navbarHeight = document.querySelector('.navbar').offsetHeight;
                        const targetPosition = targetSection.offsetTop - navbarHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        // Update URL
                        window.history.pushState(null, null, `#${targetId}`);
                    }, 300); // Wait for collapse animation
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 768 &&
                navbarCollapse.classList.contains('show') &&
                !navbarToggler.contains(e.target) &&
                !navbarCollapse.contains(e.target)) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) ||
                    new bootstrap.Collapse(navbarCollapse, { toggle: false });
                bsCollapse.hide();
            }
        });

        // Handle menu show/hide events
        navbarCollapse.addEventListener('show.bs.collapse', function () {
            console.log('Mobile menu opened');
        });

        navbarCollapse.addEventListener('hide.bs.collapse', function () {
            console.log('Mobile menu closed');
        });
    }
}

// ================================
// Preserve Original Image Sizes
// ================================
function preserveImageSizes() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Remove any forced dimensions and let images display at natural size
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.maxWidth = '100%';

        // Add loading optimization
        img.loading = 'lazy';
    });
}

// ================================
// Projects Section Initialization
// ================================
function initializeProjects() {
    const projectImages = document.querySelectorAll('.project-img');
    projectImages.forEach(img => {
        // Ensure project images maintain aspect ratio
        img.style.objectFit = 'cover';
        img.style.width = '100%';
        img.style.height = '100%';
    });
}

// ================================
// Scroll Features
// ================================
function initScrollFeatures() {
    console.log("Initializing scroll features...");

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    console.log("Sections found:", sections.length);
    console.log("Nav links found:", navLinks.length);

    // Remove active class from all links initially
    navLinks.forEach(link => link.classList.remove("active"));

    if (sections.length === 0) {
        console.warn("No sections found for intersection observer");
        return;
    }

    // SINGLE IntersectionObserver to avoid conflicts
    const observer = new IntersectionObserver(
        (entries) => {
            let mostVisibleSection = null;
            let highestRatio = 0;

            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
                    highestRatio = entry.intersectionRatio;
                    mostVisibleSection = entry.target.id;
                }
            });

            if (mostVisibleSection && highestRatio > 0.3) {
                console.log("Most visible section:", mostVisibleSection);

                navLinks.forEach(link => {
                    const linkHref = link.getAttribute("href");
                    if (linkHref === `#${mostVisibleSection}`) {
                        // Remove active from all links
                        navLinks.forEach(l => l.classList.remove("active"));
                        // Add active to current link
                        link.classList.add("active");
                        console.log("Active link set to:", linkHref);
                    }
                });
            }
        },
        {
            threshold: [0.1, 0.3, 0.5, 0.7],
            rootMargin: '-80px 0px -80px 0px'
        }
    );

    // Observe all sections that have IDs
    sections.forEach(section => {
        if (section.id && section.id !== '') {
            observer.observe(section);
            console.log("Observing section:", section.id);
        }
    });

    // Smooth scroll for nav links - SIMPLIFIED
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            console.log("Nav link clicked, target:", targetId);

            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Update active class immediately
                navLinks.forEach(l => l.classList.remove("active"));
                this.classList.add("active");

                // Smooth scroll to section
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

                // Update URL hash
                window.history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

// ================================
// Handle page refresh and direct anchor links
// ================================
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetId = hash.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            setTimeout(() => {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active link
                const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === hash) {
                        link.classList.add('active');
                    }
                });
            }, 800);
        }
    }
});

// ================================
// Handle browser back/forward navigation
// ================================
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            setTimeout(() => {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});

// ================================
// Enhanced Responsive Design
// ================================
function enhanceResponsiveDesign() {
    // Improve mobile navigation
    improveMobileNav();

    // Enhance image responsiveness
    enhanceImageResponsiveness();

    // Improve touch interactions
    improveTouchInteractions();

    // Optimize performance on mobile
    optimizeMobilePerformance();
}

function improveMobileNav() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    if (window.innerWidth <= 768) {
        // Add mobile-specific classes
        navbar.classList.add('mobile-nav');

        // Improve touch targets
        navLinks.forEach(link => {
            link.style.padding = '12px 15px';
            link.style.minHeight = '44px'; // Apple's recommended minimum touch target
        });
    }
}

function enhanceImageResponsiveness() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        // Ensure images are responsive
        img.style.maxWidth = '100%';
        img.style.height = 'auto';

        // Add loading optimization
        if (!img.getAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

function improveTouchInteractions() {
    // Improve button touch targets
    const buttons = document.querySelectorAll('button, .btn, [role="button"]');

    buttons.forEach(button => {
        if (window.innerWidth <= 768) {
            button.style.minHeight = '44px';
            button.style.minWidth = '44px';
        }
    });
}

function optimizeMobilePerformance() {
    // Reduce animations on low-performance devices
    if (window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.documentElement.style.setProperty('--transition-speed', '0.2s');
    }
}

// ================================
// Mobile viewport height fix for iOS
// ================================
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// ================================
// Event Listeners
// ================================
window.addEventListener('resize', () => {
    forceLogoSizeReduction();
    setViewportHeight();
    enhanceResponsiveDesign();
});

window.addEventListener('orientationchange', setViewportHeight);

// Initial viewport height setup
setViewportHeight();

// ================================
// Error handling for missing components
// ================================
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// ================================
// Make functions available globally
// ================================
window.initializeCareersForm = initializeCareersForm;
window.initializeContactForm = initializeContactForm;
window.initializeAllForms = initializeAllForms;
window.initializeFormsForSection = initializeFormsForSection;
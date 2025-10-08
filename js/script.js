document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, starting to load components...");
    
    // Mark HTML as loaded to prevent FOUC
    document.documentElement.classList.add('loaded');
    
    // Initialize core features first
    navbarShrink();
    initMobileNavigation();
    preserveImageSizes();
    forceLogoSizeReduction();
    
    // Load components
    loadComponent("home", "components/home.html");
    loadComponent("about", "components/about.html");
    loadComponent("philosophy", "components/philosophy.html");
    loadComponent("services", "components/services.html");
    loadComponent("careers", "components/careers.html", () => {
        console.log("Careers component loaded successfully");
    });
    loadComponent("projects", "components/projects.html", () => {
        console.log("Projects component loaded successfully");
        setTimeout(initializeProjects, 100);
    });
    loadComponent("contact", "components/contact.html", () => {
        console.log("Contact component loaded successfully");
    });
    
    // Initialize features after components are loaded
    setTimeout(() => {
        initScrollFeatures();
        console.log("All components loaded and features initialized");
    }, 800);
});




// Add this to the loadComponent calls
loadComponent("careers", "components/careers.html", () => {
    console.log("Careers component loaded successfully");
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
// Load all components on page load
// ================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, starting to load components...");
    
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
        { id: "services", file: "components/services.html" },
        { id: "projects", file: "components/projects.html", callback: () => {
            console.log("Projects component loaded successfully");
            setTimeout(initializeProjects, 100);
        }},
        { id: "careers", file: "components/careers.html", callback: () => {
            console.log("Careers component loaded successfully");
        }},
        { id: "contact", file: "components/contact.html", callback: () => {
            console.log("Contact component loaded successfully");
        }}
    ];

    // Load components sequentially to avoid race conditions
    function loadNextComponent(index) {
        if (index >= loadSequence.length) {
            console.log("All components loaded");
            // Final initialization after all components are loaded
            setTimeout(() => {
                initScrollFeatures();
                enhanceResponsiveDesign();
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
// Mobile Navigation Handler
// ================================
function initMobileNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 768 && 
                navbarCollapse.classList.contains('show') && 
                !navbarToggler.contains(e.target) && 
                !navbarCollapse.contains(e.target)) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
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

    // REMOVED: The duplicate scroll event listener that was causing conflicts
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
// Error handling for missing components
// ================================
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// ================================
// Mobile viewport height fix for iOS
// ================================
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Listen for window resize to update logo sizes
window.addEventListener('resize', () => {
    forceLogoSizeReduction();
    setViewportHeight();
});

window.addEventListener('orientationchange', setViewportHeight);
setViewportHeight();


// Enhanced responsive design for all sections
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

// Call this function in your main initialization
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    
    // Add responsive enhancements
    enhanceResponsiveDesign();
    
    // Re-run on resize
    window.addEventListener('resize', enhanceResponsiveDesign);
});

// Add to your loadComponent function to handle dynamically loaded content
function loadComponent(sectionId, filePath, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.innerHTML = data;
                
                // Add the section ID to the loaded content's main container
                const container = section.querySelector('div[class*="section"], section[class*="section"]');
                if (container && !container.id) {
                    container.id = sectionId + '-content';
                }
                
                // Apply responsive enhancements to new content
                setTimeout(() => {
                    enhanceResponsiveDesign();
                    // Trigger custom event for slider initialization
                    const event = new CustomEvent('componentLoaded', { detail: { sectionId } });
                    document.dispatchEvent(event);
                }, 100);
                
                if (callback) callback();
            }
        })
        .catch(error => console.error("Error loading " + filePath, error));
}
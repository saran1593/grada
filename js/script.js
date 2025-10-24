// ================================
// Main Initialization
// ================================
window.ignoreHashReplace = false;
document.addEventListener("DOMContentLoaded", () => {
    const targetSection = sessionStorage.getItem('scrollToSection');
    if (targetSection) {
        console.log('🎯 Found target section in sessionStorage:', targetSection);
    }
    document.documentElement.classList.add('loaded');
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
                        setTimeout(initServices, 200);
                    }
                };
                setTimeout(initServices, 50);
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

                const initCareers = () => {
                    if (typeof initializeCareersForm === 'function') {
                        initializeCareersForm();
                    } else {
                        setTimeout(initCareers, 200);
                    }
                };
                setTimeout(initCareers, 50);
            }
        },
        {
            id: "contact",
            file: "components/contact.html",
            type: "hidden",
            callback: () => {
                hideSection('contact');

                const initContact = () => {
                    if (typeof initializeContactForm === 'function') {
                        initializeContactForm();
                    } else {
                        setTimeout(initContact, 200);
                    }
                };
                setTimeout(initContact, 20);
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
                console.log("🔄 Loading footer1, initializing form...");
                setTimeout(() => {
                    initializeFooterForm();
                    initializeFooterNavigation();
                }, 100);
            }
        },
    ];
    function loadNextComponent(index) {
        if (index >= loadSequence.length) {
            initNavigationHandlers();
            const storedSection = sessionStorage.getItem('scrollToSection');
            if (storedSection) {
                sessionStorage.removeItem('scrollToSection');
                window.ignoreHashReplace = true;
                setTimeout(() => {
                    const navLink = document.querySelector(`.navbar-nav .nav-link[href="#${storedSection}"]`);

                    if (navLink) {
                        handleNavigationClick(storedSection, navLink);
                        setTimeout(() => {
                            scrollToSection(storedSection);
                            setTimeout(() => {
                                window.ignoreHashReplace = false;
                                if (typeof initScrollSpy === 'function') {
                                    initScrollSpy();
                                }
                            }, 50);
                        }, 50);
                    } else {
                        window.ignoreHashReplace = false;
                    }
                }, 50);
            } else {
                initScrollSpy();
            }

            setTimeout(() => {
                initScrollFeatures();
                enhanceResponsiveDesign();
                initializeAllForms();
                removeEmptySpace();
            }, 100);
            return;
        }

        const item = loadSequence[index];
        loadComponent(item.id, item.file, item.callback);
        setTimeout(() => loadNextComponent(index + 1), 50);
    }
    loadNextComponent(0);
});
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

            if (!window.ignoreHashReplace) {
                if (window.location.hash !== `#${currentSectionId}`) {
                    history.replaceState(null, null, `#${currentSectionId}`);
                }
            }
        }

        isScrolling = false;
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavLink, 50);
    });
    updateActiveNavLink();
}

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

    if (['home', 'about', 'philosophy'].includes(targetId)) {
        showStaticSections();
        hideAllHiddenSections();
        setActiveNavLink(clickedLink);

        setTimeout(() => {
            initScrollSpy();
            scrollToSection(targetId);
        }, 100);
    }

    else if (targetId === 'services') {
        hideStaticSections();
        hideAllHiddenSections();

        showSection('services');
        showSection('projects');
        showSection('footer1');

        setActiveNavLink(clickedLink);

        setTimeout(() => {
            scrollToSection('services');
        }, 50);
    }

    else if (targetId === 'projects') {
        hideStaticSections();
        hideAllHiddenSections();

        showSection('services');
        showSection('projects');
        showSection('footer1');

        setActiveNavLink(clickedLink);

        setTimeout(() => {
            scrollToSection('projects');
        }, 50);
    }

    else if (targetId === 'careers') {
        hideStaticSections();
        hideAllHiddenSections();

        showSection('careers');

        setActiveNavLink(clickedLink);

        setTimeout(() => {
            scrollToSection('careers');
        }, 50);
    }

    else if (targetId === 'contact') {
        hideStaticSections();
        hideAllHiddenSections();

        showSection('contact');

        setActiveNavLink(clickedLink);

        setTimeout(() => {
            scrollToSection('contact');
        }, 50);
    }

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

        try {
            window.history.pushState(null, null, `#${sectionId}`);
        } catch (e) {
            window.location.hash = `#${sectionId}`;
        }
    }
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


function loadComponent(sectionId, filePath, callback) {
    const section = document.getElementById(sectionId);
    if (!section) {
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
    initializeCareersForm();
    initializeContactForm();

}
function initializeFooterForm() {
    const form = document.getElementById('projectForm');

    if (!form) {
        console.error("❌ Footer form not found in initializeFooterForm");
        setTimeout(initializeFooterForm, 200);
        return;
    }

    // Remove existing event listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    const currentForm = document.getElementById('projectForm');

    currentForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("📝 Footer form submitted");

        const name = document.getElementById('projectName').value.trim();
        const email = document.getElementById('projectEmail').value.trim();
        const phone = document.getElementById('projectPhone').value.trim();
        const message = document.getElementById('projectMessage').value.trim();

        if (!name || !email || !phone || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        const submitBtn = currentForm.querySelector('.footer-submit-btn');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
        submitBtn.disabled = true;

        try {
            await saveToGoogleSheets({ name, email, phone, message });
            showToast('Thank you for your message! We will get back to you soon.');
            currentForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your form. Please try again or contact us directly.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    console.log("✅ Footer form initialized successfully");
}

function initializeFormsForSection(sectionId) {
    if (sectionId === 'careers') {
        initializeCareersForm();
    } else if (sectionId === 'contact') {
        initializeContactForm();
    }
}

function initializeCareersForm() {
    const form = document.getElementById('careerForm');
    if (!form) {
        return;
    }
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    const currentForm = document.getElementById('careerForm');

    currentForm.addEventListener('submit', function (e) {
        e.preventDefault();

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

}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function initializeContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) {
        console.error("❌ Contact form not found");
        return;
    }

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    const currentForm = document.getElementById('contactForm');

    currentForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        // Validation
        if (!name || !email || !phone || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Show loading state
        const submitBtn = currentForm.querySelector('.grad-contact-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
        submitBtn.disabled = true;

        try {
            await saveToGoogleSheets({ name, email, phone, message });
            showToast('Thank you for your message! We will get back to you soon.');
            currentForm.reset();

        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your form. Please try again or contact us directly.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

async function saveToGoogleSheets(formData) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx0NylMw9o6v3LhJbrgc9yy-63GtAENElbt3f75FyNgy1R-F94i0Ujq-WD_7ZBJkno/exec';

    const response = await fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: "no-cors"
    });
    showToast("data saved!");
    return true;
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

function initializeFooterNavigation() {

    const form = document.getElementById('projectForm');

    if (!form) {
        console.error("❌ Contact form not found");
        return;
    }

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    const currentForm = document.getElementById('projectForm');

    currentForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('projectName').value.trim();
        const email = document.getElementById('projectEmail').value.trim();
        const phone = document.getElementById('projectPhone').value.trim();
        const message = document.getElementById('projectMessage').value.trim();

        if (!name || !email || !phone || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        const submitBtn = currentForm.querySelector('.footer-submit-btn');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
        submitBtn.disabled = true;

        try {
            await saveToGoogleSheets({ name, email, phone, message });

            showToast('Thank you for your message! We will get back to you soon.');
            currentForm.reset();

        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your form. Please try again or contact us directly.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    const footerLinks = document.querySelectorAll('.footer-links a');

    footerLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }

            if (href === '#') {
                e.preventDefault();
                alert('This page is under construction. Please check back later.');
                return;
            }

            if (href.includes('#')) {
                e.preventDefault();
                const section = href.split('#')[1];

                const currentPath = window.location.pathname;
                const isOnProjectPage = currentPath.includes('/project/') ||
                    (currentPath.includes('/components/') &&
                        !currentPath.includes('index.html'));

                if (isOnProjectPage) {
                    sessionStorage.setItem('scrollToSection', section);
                    window.location.href = '../../index.html';
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
}

function enhanceResponsiveDesign() {
    console.log("Enhancing responsive design...");
}

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
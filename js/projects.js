// Projects Page JavaScript
class ProjectsManager {
    constructor() {
        // Check if we're on the main page or projects page
        // Main page has components loaded dynamically, projects page is standalone
        this.isMainPage = window.location.pathname.includes('index.html') || 
                         document.querySelector('section#projects') !== null;
        
        console.log('ProjectsManager initialized - Main page:', this.isMainPage);
        
        if (this.isMainPage) {
            console.log('Projects manager running in main page context - limiting scope to image optimization only');
            // On main page, only optimize images, don't initialize full projects functionality
            this.optimizeImageContainers();
            return;
        }
        
        // Full initialization for standalone projects page
        this.categoryLinks = document.querySelectorAll('.project-category-link');
        this.projectItems = document.querySelectorAll('.project-item-card');
        this.viewAllBtn = document.getElementById('view-all-btn');
        
        // Maps the data-category attribute to the corresponding section ID
        this.sections = {
            'all': 'latest-work',
            'residential': 'in-residence',
            'commercial': 'hospitality-projects', 
            'institutional': 'in-residence',
            'interiors': 'objects-of-desire'
        };
        
        this.init();
    }
    
    init() {
        console.log('Initializing full ProjectsManager functionality');
        this.setupCategoryNavigation();
        this.setupAnimations();
        this.setupScrollSpy();
        this.optimizeImageContainers();
        this.setupViewAllButton();
    }
    
    // Setup View All button functionality
    setupViewAllButton() {
        if (this.viewAllBtn) {
            this.viewAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToCategory('all');
                this.setActiveCategoryLink(this.viewAllBtn);
            });
        }
    }
    
    // Optimize image container sizes based on actual image dimensions
    optimizeImageContainers() {
        const projectImages = document.querySelectorAll('.project-img');
        console.log('Optimizing image containers:', projectImages.length);
        
        projectImages.forEach(img => {
            // Check if image is already loaded
            if (img.complete) {
                this.adjustImageContainer(img);
            } else {
                img.addEventListener('load', () => {
                    this.adjustImageContainer(img);
                });
            }
            
            // Fallback for images that might fail to load
            img.addEventListener('error', () => {
                console.warn('Image failed to load:', img.src);
                // Apply default styling for broken images
                img.style.objectFit = 'cover';
            });
        });
    }
    
    // Adjust image container based on actual image dimensions
    adjustImageContainer(img) {
        const container = img.closest('.project-item-image');
        const card = img.closest('.project-item-card');
        
        if (!container || !card) return;
        
        // Ensure consistent image display
        img.style.objectFit = 'cover';
        img.style.width = '100%';
        img.style.height = '100%';
        
        // Only proceed with advanced adjustments if we have natural dimensions
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
            console.warn('Image natural dimensions not available:', img.src);
            return;
        }
        
        const imgAspectRatio = img.naturalWidth / img.naturalHeight;
        const containerAspectRatio = container.offsetWidth / container.offsetHeight;
        
        // If image is significantly smaller than container, adjust display
        if (img.naturalWidth < container.offsetWidth * 0.8) {
            container.classList.add('auto-size');
            card.classList.add('auto-height');
        }
        
        // Apply object-fit based on aspect ratio for better visual results
        if (imgAspectRatio > containerAspectRatio * 1.2) {
            img.style.objectFit = 'cover';
        } else if (imgAspectRatio < containerAspectRatio * 0.8) {
            img.style.objectFit = 'cover';
        } else {
            img.style.objectFit = 'cover';
        }
    }
    
    // Handles clicks on the category navigation buttons
    setupCategoryNavigation() {
        this.categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                console.log('Category navigation clicked:', category);
                this.navigateToCategory(category);
                this.setActiveCategoryLink(link);
            });
        });
    }
    
    // Scrolls smoothly to the target section
    navigateToCategory(category) {
        const targetSectionId = this.sections[category];
        if (targetSectionId) {
            console.log('Navigating to section:', targetSectionId);
            this.scrollToSection(targetSectionId);
        } else {
            console.warn('No section found for category:', category);
        }
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            // Calculate the position, leaving a small offset from the top
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            const offsetTop = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        } else {
            console.warn('Section not found:', sectionId);
        }
    }
    
    // Automatically highlights the category link corresponding to the section in view
    setupScrollSpy() {
        const sections = document.querySelectorAll('.latest-work-section, .residence-section, .objects-section');
        console.log('Setting up scroll spy for sections:', sections.length);
        
        const observerOptions = {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    console.log('Section in view:', sectionId);
                    this.updateActiveNavLink(sectionId);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            if (section.id) {
                observer.observe(section);
            }
        });
    }
    
    updateActiveNavLink(activeSectionId) {
        this.resetActiveCategoryLinks();
        
        // Find all categories that link to the currently active section
        const correspondingCategories = Object.keys(this.sections).filter(
            key => this.sections[key] === activeSectionId
        );

        console.log('Active section:', activeSectionId, 'Corresponding categories:', correspondingCategories);

        // Activate the link for each corresponding category
        correspondingCategories.forEach(category => {
            const activeLink = document.querySelector(`.project-category-link[data-category="${category}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                console.log('Activated category link:', category);
            }
        });
        
        // Special case for "all" category when viewing latest-work
        if (activeSectionId === 'latest-work') {
            const allLink = document.querySelector('.project-category-link[data-category="all"]');
            if (allLink) {
                allLink.classList.add('active');
            }
        }
    }
    
    // Sets the visual "active" state on a clicked link
    setActiveCategoryLink(activeLink) {
        this.resetActiveCategoryLinks();
        activeLink.classList.add('active');
        console.log('Manually activated link:', activeLink.textContent);
    }
    
    // Removes the "active" class from all category links
    resetActiveCategoryLinks() {
        this.categoryLinks.forEach(link => {
            link.classList.remove('active');
        });
        if (this.viewAllBtn) {
            this.viewAllBtn.classList.remove('active');
        }
    }
    
    // Sets up the fade-in animation for project cards as they are scrolled into view
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.projectItems.forEach(item => {
            item.classList.add('project-fade-in');
            observer.observe(item);
        });
    }
    
    // Cleanup method to remove event listeners if needed
    destroy() {
        if (this.categoryLinks) {
            this.categoryLinks.forEach(link => {
                link.removeEventListener('click', this.categoryClickHandler);
            });
        }
        
        if (this.viewAllBtn) {
            this.viewAllBtn.removeEventListener('click', this.viewAllClickHandler);
        }
    }
}

// Initialize the script once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize ProjectsManager if we're on a page that needs it
    const projectsSection = document.getElementById('projects');
    const projectsPage = document.querySelector('body.projects-page') || 
                        window.location.pathname.includes('projects.html') ||
                        document.querySelector('.project-categories-section') !== null;
    
    if (projectsSection || projectsPage) {
        console.log('Initializing ProjectsManager');
        window.projectsManager = new ProjectsManager();
    } else {
        console.log('ProjectsManager not needed on this page');
    }
});

// Handle dynamic loading in main site
document.addEventListener('componentLoaded', function(event) {
    if (event.detail.sectionId === 'projects') {
        console.log('Projects component loaded dynamically');
        setTimeout(() => {
            window.projectsManager = new ProjectsManager();
        }, 100);
    }
});

// CSS for animations - add this to your projects.css if not already present
const style = document.createElement('style');
style.textContent = `
    .project-fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .project-fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .project-category-link.active {
        color: #000000 !important;
        font-weight: 600;
    }
    
    .project-view-all-btn.active {
        background: #000000 !important;
        color: white !important;
    }
    
    /* Image optimization classes */
    .auto-size img {
        object-fit: contain !important;
    }
    
    .auto-height {
        height: auto !important;
    }
`;
document.head.appendChild(style);
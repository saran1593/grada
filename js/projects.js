// Projects Page JavaScript
class ProjectsManager {
    constructor() {
        this.categoryLinks = document.querySelectorAll('.project-category-link');
        this.projectItems = document.querySelectorAll('.project-item-card');
        
        // Maps the data-category attribute to the corresponding section ID
        this.sections = {
            'all': 'latest-work',
            'residential': 'in-residence',
            'commercial': 'hospitality-projects', 
            'institutional': 'in-residence', // Both residential and institutional link to the same section
            'interiors': 'objects-of-desire'
        };
        
        this.init();
    }
    
    init() {
        this.setupCategoryNavigation();
        this.setupAnimations();
        this.setupScrollSpy();
        this.optimizeImageContainers();
    }
    
    // Optimize image container sizes based on actual image dimensions
    optimizeImageContainers() {
        const projectImages = document.querySelectorAll('.project-img');
        
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
            });
        });
    }
    
    // Adjust image container based on actual image dimensions
    adjustImageContainer(img) {
        const container = img.closest('.project-item-image');
        const card = img.closest('.project-item-card');
        
        if (!container || !card) return;
        
        const imgAspectRatio = img.naturalWidth / img.naturalHeight;
        const containerAspectRatio = container.offsetWidth / container.offsetHeight;
        
        // If image is significantly smaller than container, adjust display
        if (img.naturalWidth < container.offsetWidth * 0.8) {
            container.classList.add('auto-size');
            card.classList.add('auto-height');
        }
        
        // Apply object-fit based on aspect ratio
        if (imgAspectRatio > containerAspectRatio) {
            img.style.objectFit = 'cover';
        } else {
            img.style.objectFit = 'contain';
        }
    }
    
    // Handles clicks on the category navigation buttons
    setupCategoryNavigation() {
        this.categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                this.navigateToCategory(category);
                this.setActiveCategoryLink(link);
            });
        });
    }
    
    // Scrolls smoothly to the target section
    navigateToCategory(category) {
        const targetSectionId = this.sections[category];
        if (targetSectionId) {
            this.scrollToSection(targetSectionId);
        }
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            // Calculates the position, leaving a small offset from the top
            const offsetTop = section.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Automatically highlights the category link corresponding to the section in view
    setupScrollSpy() {
        const sections = document.querySelectorAll('.section-target');
        const observerOptions = {
            rootMargin: '-20% 0px -70% 0px', // Defines when a section is considered "active"
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveNavLink(sectionId);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    updateActiveNavLink(activeSectionId) {
        this.resetActiveCategoryLinks();
        
        // Find all categories that link to the currently active section
        const correspondingCategories = Object.keys(this.sections).filter(
            key => this.sections[key] === activeSectionId
        );

        // Activate the link for each corresponding category
        correspondingCategories.forEach(category => {
            const activeLink = document.querySelector(`.project-category-link[data-category="${category}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        });
    }
    
    // Sets the visual "active" state on a clicked link
    setActiveCategoryLink(activeLink) {
        this.resetActiveCategoryLinks();
        activeLink.classList.add('active');
    }
    
    // Removes the "active" class from all category links
    resetActiveCategoryLinks() {
        this.categoryLinks.forEach(link => {
            link.classList.remove('active');
        });
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
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            });
        }, observerOptions);
        
        this.projectItems.forEach(item => {
            item.classList.add('project-fade-in');
            observer.observe(item);
        });
    }
}

// Initialize the script once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    new ProjectsManager();
});
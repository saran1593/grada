// Fixed Sidebar functionality with Active Selection
document.addEventListener('DOMContentLoaded', function() {
    const sidebarCategories = document.getElementById('sidebarCategories');
    const categories = document.querySelectorAll('.sidebar-category');
    
    // Set Residential as default active category
    let activeCategory = 'residential';
    
    // Category switching with active state management
    categories.forEach(category => {
        category.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the category type
            const categoryType = this.getAttribute('data-category');
            
            // Only proceed if clicking a different category
            if (categoryType !== activeCategory) {
                // Remove active class from all categories
                categories.forEach(cat => cat.classList.remove('active'));
                
                // Add active class to clicked category
                this.classList.add('active');
                
                // Update active category
                activeCategory = categoryType;
                
                // Hide all category contents
                document.querySelectorAll('.category-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Show the selected category content
                const categoryContent = document.getElementById(categoryType);
                if (categoryContent) {
                    categoryContent.classList.add('active');
                }
                
                // Clear search when switching categories
                clearSearch();
                
                // Scroll to top when changing categories
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
        
        // Hover effects management
        category.addEventListener('mouseenter', function() {
            if (this.classList.contains('active')) {
                sidebarCategories.classList.add('hovering-active');
            }
        });
        
        category.addEventListener('mouseleave', function() {
            sidebarCategories.classList.remove('hovering-active');
        });
    });
    
    // Add animation on scroll for project items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Apply animation to project items
    document.querySelectorAll('.project-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    let allProjectItems = [];
    
    // Collect all project items once the page loads
    function initializeSearch() {
        allProjectItems = document.querySelectorAll('.project-item');
    }
    
    // Clear search function
    function clearSearch() {
        searchInput.value = '';
        showAllProjects();
    }
    
    // Show all projects
    function showAllProjects() {
        allProjectItems.forEach(item => {
            item.style.display = 'block';
            // Remove highlight
            const projectName = item.querySelector('.project-name');
            const projectDescription = item.querySelector('.project-description');
            
            if (projectName) {
                projectName.innerHTML = projectName.textContent;
            }
            if (projectDescription) {
                projectDescription.innerHTML = projectDescription.textContent;
            }
        });
        
        // Remove any no-results message
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }
    
    // Highlight search term in text
    function highlightText(text, searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm.length > 0) {
            let foundResults = false;
            
            allProjectItems.forEach(item => {
                const projectName = item.querySelector('.project-name');
                const projectDescription = item.querySelector('.project-description');
                
                if (projectName && projectDescription) {
                    const nameText = projectName.textContent.toLowerCase();
                    const descText = projectDescription.textContent.toLowerCase();
                    
                    if (nameText.includes(searchTerm) || descText.includes(searchTerm)) {
                        item.style.display = 'block';
                        foundResults = true;
                        
                        // Highlight matching text
                        projectName.innerHTML = highlightText(projectName.textContent, searchTerm);
                        projectDescription.innerHTML = highlightText(projectDescription.textContent, searchTerm);
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
            
            // Show no results message if no matches found
            const activeCategoryContent = document.querySelector('.category-content.active');
            let noResults = activeCategoryContent.querySelector('.no-results');
            
            if (!foundResults) {
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.className = 'no-results';
                    noResults.textContent = `No projects found matching "${searchTerm}"`;
                    activeCategoryContent.appendChild(noResults);
                }
            } else if (noResults) {
                noResults.remove();
            }
            
        } else {
            showAllProjects();
        }
    });
    
    // Initialize search when page loads
    initializeSearch();
});

// projects.js - Handles projects section functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize projects functionality when projects section is loaded
    function initializeProjects() {
        // Add smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#' || !targetId.startsWith('#')) return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Add animation on scroll for project items
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Apply animation to project items
        document.querySelectorAll('.project-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(item);
        });
        
        // Handle Residential link click in project navigation
        const residentialLinks = document.querySelectorAll('.residential-link');
        residentialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Show interior section
                if (window.interiorModule) {
                    window.interiorModule.showInteriorSection();
                }
            });
        });
    }
    
    // Initialize when DOM is ready
    initializeProjects();
    
    // Export initialization function for dynamic loading
    window.projectsModule = {
        initialize: initializeProjects
    };
});
// Shared Sidebar Navigation for All Category Pages
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebarNavigation();
});

// Main initialization function
function initializeSidebarNavigation() {
    const sidebarCategories = document.getElementById('sidebarCategories');
    const categories = document.querySelectorAll('.sidebar-category');
    const searchInput = document.querySelector('.search-input');
    
    // Initialize category navigation if elements exist
    if (categories.length > 0 && sidebarCategories) {
        initializeCategoryNavigation(categories, sidebarCategories);
    }
    
    // Initialize search functionality if search input exists
    if (searchInput) {
        initializeSearchFunctionality(searchInput);
    }
    
    // Initialize project animations
    initializeProjectAnimations();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
}

// Category navigation functionality
function initializeCategoryNavigation(categories, sidebarCategories) {
    const currentPage = window.location.pathname.split('/').pop();
    
    categories.forEach(category => {
        // Click event for navigation
        category.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            const categoryType = this.getAttribute('data-category');
            
            if (targetPage && targetPage !== currentPage) {
                window.location.href = targetPage;
            } else if (categoryType) {
                // Handle category switching within same page
                switchCategory(categoryType, categories);
            }
        });
        
        // Hover effects
        category.addEventListener('mouseenter', function() {
            if (this.classList.contains('active') && sidebarCategories) {
                sidebarCategories.classList.add('hovering-active');
            }
        });
        
        category.addEventListener('mouseleave', function() {
            if (sidebarCategories) {
                sidebarCategories.classList.remove('hovering-active');
            }
        });
    });
}

// Category switching logic
function switchCategory(categoryType, categories) {
    const activeCategory = document.querySelector('.sidebar-category.active');
    
    // Only proceed if clicking a different category
    if (!activeCategory || activeCategory.getAttribute('data-category') !== categoryType) {
        // Remove active class from all categories
        categories.forEach(cat => cat.classList.remove('active'));
        
        // Add active class to clicked category
        const clickedCategory = document.querySelector(`[data-category="${categoryType}"]`);
        if (clickedCategory) {
            clickedCategory.classList.add('active');
        }
        
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
        
        // Re-initialize animations for new content
        setTimeout(initializeProjectAnimations, 100);
    }
}

// Search functionality
function initializeSearchFunctionality(searchInput) {
    let allProjectItems = [];
    
    function initializeSearch() {
        const activeCategory = document.querySelector('.category-content.active');
        allProjectItems = activeCategory ? 
            activeCategory.querySelectorAll('.project-item') : 
            document.querySelectorAll('.project-item');
    }
    
    function clearSearch() {
        if (searchInput) {
            searchInput.value = '';
        }
        showAllProjects();
    }
    
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
    
    function highlightText(text, searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    function handleSearchInput(e) {
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
            const mainContent = document.querySelector('.main-content');
            const container = activeCategoryContent || mainContent;
            
            if (container && !foundResults) {
                let noResults = container.querySelector('.no-results');
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.className = 'no-results';
                    noResults.textContent = `No projects found matching "${searchTerm}"`;
                    container.appendChild(noResults);
                }
            } else {
                const noResults = document.querySelector('.no-results');
                if (noResults) {
                    noResults.remove();
                }
            }
            
        } else {
            showAllProjects();
        }
    }
    
    // Initialize search when page loads
    initializeSearch();
    
    // Add event listener only if searchInput exists
    searchInput.addEventListener('input', handleSearchInput);
    
    // Re-initialize search when categories change
    document.addEventListener('categoryChanged', initializeSearch);
}

// Project animations
function initializeProjectAnimations() {
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
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        // Only initialize if not already animated
        if (!item.hasAttribute('data-animation-initialized')) {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.setAttribute('data-animation-initialized', 'true');
            observer.observe(item);
        }
    });
}

// Smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
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

// Export functions for global access
window.sidebarNavigation = {
    initialize: initializeSidebarNavigation,
    switchCategory: switchCategory,
    clearSearch: function() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
        }
    }
};

// Custom event for category changes
function dispatchCategoryChangeEvent(categoryType) {
    const event = new CustomEvent('categoryChanged', {
        detail: { category: categoryType }
    });
    document.dispatchEvent(event);
}
// kent-slider.js - Auto-changing image slider for Kent Avenue Penthouse (Home Section Style)
class KentSlider {
    constructor() {
        this.sliderContainer = document.querySelector('.kent-slider-container');
        this.slides = [];
        this.currentSlide = 0;
        this.slideInterval = null;
        this.intervalTime = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        // Only initialize if we're on the Kent Avenue section
        if (!this.sliderContainer) return;
        
        this.createSlider();
        this.startSlider();
        this.addEventListeners();
    }
    
    createSlider() {
        // Kent Avenue Penthouse images
        this.slides = [
            '/images/P1/1.jpg',
            '/images/P2/1.jpg',
            '/images/P3/1.jpg',
            '/images/P4/1.jpg',
        ];
        
        // Create slider HTML structure matching home section style
        this.sliderContainer.innerHTML = `
            <div id="kentCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
                <!-- Indicators -->
                <div class="carousel-indicators">
                    ${this.slides.map((_, index) => `
                        <button type="button" data-bs-target="#kentCarousel" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}"></button>
                    `).join('')}
                </div>
                
                <!-- Slides -->
                <div class="carousel-inner">
                    ${this.slides.map((slide, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${slide}" class="d-block w-100" alt="Kent Avenue Penthouse View ${index + 1}">
                        </div>
                    `).join('')}
                </div>
                
                <!-- Controls -->
                <button class="carousel-control-prev" type="button" data-bs-target="#kentCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#kentCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                </button>
            </div>
        `;
        
        // Initialize Bootstrap carousel
        this.initializeBootstrapCarousel();
    }
    
    initializeBootstrapCarousel() {
        // Bootstrap will handle the carousel functionality automatically
        // due to the data-bs-ride and data-bs-interval attributes
    }
    
    startSlider() {
        // Bootstrap handles auto-sliding automatically
    }
    
    addEventListeners() {
        // Bootstrap handles all interactions automatically
    }
    
    destroy() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }
}

// Initialize the slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new KentSlider();
});

// Also initialize when projects section is loaded dynamically
document.addEventListener('componentLoaded', function() {
    setTimeout(() => {
        new KentSlider();
    }, 500);
});
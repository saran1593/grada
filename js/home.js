

function initializeSlider() {
    const slides = document.querySelectorAll('.slider-image');
    
    // If no slider images are found on the page, do nothing.
    if (slides.length === 0) {
        return null; // Return null if slider doesn't exist
    }

    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function nextSlide() {
        // Hide current slide
        if (slides[currentSlide]) {
            slides[currentSlide].classList.remove('active');
        }
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Show new slide
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }
    }

    // Start with first slide visible
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }

    // Return the interval ID so it can be managed by the main script
    return setInterval(nextSlide, slideInterval);
}

// This checks if the slider functionality is already defined to avoid errors
if (typeof window.initializeSlider === 'undefined') {
    window.initializeSlider = initializeSlider;
}
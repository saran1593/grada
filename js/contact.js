// Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            if (name && email && phone && service && message) {
                // Here you would typically send the form data to a server
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
    
    // Add social media link handlers
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('mailto:')) {
                // Mail link - let it work naturally
                return true;
            }
            if (this.getAttribute('href').startsWith('tel:')) {
                // Phone link - let it work naturally
                return true;
            }
            // For other links, you might want to track analytics
            console.log('Social link clicked:', this.getAttribute('href'));
        });
    });
});
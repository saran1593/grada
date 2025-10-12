// // Contact Form JavaScript - Enhanced version
// document.addEventListener('DOMContentLoaded', function() {
//     console.log("✅ Contact JS Loaded");
//     initializeContactForm();
// });

// function initializeContactForm() {
//     const contactForm = document.getElementById('contactForm');
    
//     if (!contactForm) {
//         console.error("❌ Contact form not found");
//         setTimeout(initializeContactForm, 500);
//         return;
//     }
    
//     console.log("✅ Contact form found, attaching event listener");

//     // Remove any existing event listeners
//     contactForm.replaceWith(contactForm.cloneNode(true));
//     const newForm = document.getElementById('contactForm');

//     newForm.addEventListener('submit', function(e) {
//         e.preventDefault();
//         console.log("✅ Contact form submit triggered");
        
//         const name = document.getElementById('name').value.trim();
//         const email = document.getElementById('email').value.trim();
//         const phone = document.getElementById('phone').value.trim();
//         const message = document.getElementById('message').value.trim();
        
//         // Validation
//         if (!name || !email || !phone || !message) {
//             alert('Please fill in all required fields.');
//             return;
//         }

//         // Email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             alert('Please enter a valid email address.');
//             return;
//         }

//         // Create mailto link for contact form
//         const subject = `Contact Form Submission - ${name}`;
//         const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}\n\n---\nThis message was sent from the Grad Architects Contact page.`;
        
//         const mailtoLink = `mailto:info@gradarchitects.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
//         console.log("📨 Opening mail client for contact:", mailtoLink);
        
//         // Show loading state
//         const submitBtn = newForm.querySelector('.grad-contact-submit-btn');
//         const originalText = submitBtn.innerHTML;
//         submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
//         submitBtn.disabled = true;

//         // Open default email client
//         setTimeout(() => {
//             window.location.href = mailtoLink;
            
//             // Reset button after a delay
//             setTimeout(() => {
//                 submitBtn.innerHTML = originalText;
//                 submitBtn.disabled = false;
//                 alert("Thank you for your message! Please check your email client to complete the submission.");
//             }, 2000);
//         }, 1000);
//     });
    
//     console.log("✅ Contact form handler attached successfully");
// }

// // Make function available globally
// window.initializeContactForm = initializeContactForm;

// // Initialize if contact section is loaded dynamically
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', initializeContactForm);
// } else {
//     initializeContactForm();
// }
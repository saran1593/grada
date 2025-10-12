// // ✅ Careers JavaScript - Enhanced version
// document.addEventListener('DOMContentLoaded', function () {
//     console.log("✅ Careers JS Loaded");
//     initializeCareersForm();
// });

// function initializeCareersForm() {
//     const form = document.getElementById('careerForm');

//     if (!form) {
//         console.error("❌ Career form not found. Check ID.");
//         // Try again after a delay in case of dynamic loading
//         setTimeout(initializeCareersForm, 500);
//         return;
//     }

//     console.log("✅ Career form found, attaching event listener");

//     // Remove any existing event listeners to prevent duplicates
//     form.replaceWith(form.cloneNode(true));
//     const newForm = document.getElementById('careerForm');

//     newForm.addEventListener('submit', function (e) {
//         e.preventDefault();
//         console.log("✅ Form submit triggered");

//         // Get form values
//         const name = document.getElementById('name').value.trim();
//         const phone = document.getElementById('phone').value.trim();
//         const email = document.getElementById('email').value.trim();
//         const message = document.getElementById('message').value.trim();

//         // Validation
//         if (!name || !phone || !email || !message) {
//             showAlert("Please fill in all fields.", "error");
//             return;
//         }

//         // Email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             showAlert("Please enter a valid email address.", "error");
//             return;
//         }

//         // Phone validation
//         const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
//         if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
//             showAlert("Please enter a valid phone number.", "error");
//             return;
//         }

//         // Create mailto link
//         const subject = `Career Application - ${name}`;
//         const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nThis message was sent from the Grad Architects Careers page.`;
        
//         const mailtoLink = `mailto:barathbalag@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
//         console.log("📨 Opening mail client:", mailtoLink);
        
//         // Show loading state
//         const submitBtn = newForm.querySelector('.grad-careers-submit-btn');
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
//                 showAlert("Thank you for your application! Please check your email client to complete the submission.", "success");
//             }, 2000);
//         }, 1000);
//     });

//     console.log("✅ Careers form handler attached successfully");
// }

// function showAlert(message, type = "info") {
//     // Remove any existing alerts
//     const existingAlert = document.querySelector('.custom-alert');
//     if (existingAlert) {
//         existingAlert.remove();
//     }

//     // Create alert element
//     const alertDiv = document.createElement('div');
//     alertDiv.className = `custom-alert alert alert-${type === 'error' ? 'danger' : 'success'} fade show`;
//     alertDiv.style.cssText = `
//         position: fixed;
//         top: 100px;
//         right: 20px;
//         z-index: 9999;
//         min-width: 300px;
//         max-width: 500px;
//     `;
//     alertDiv.innerHTML = `
//         <strong>${type === 'error' ? 'Error!' : 'Success!'}</strong> ${message}
//         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//     `;

//     document.body.appendChild(alertDiv);

//     // Auto remove after 5 seconds
//     setTimeout(() => {
//         if (alertDiv.parentNode) {
//             alertDiv.remove();
//         }
//     }, 5000);
// }

// // Make function available globally for dynamic loading
// window.initializeCareersForm = initializeCareersForm;

// // Initialize if careers section is loaded dynamically
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', initializeCareersForm);
// } else {
//     initializeCareersForm();
// }
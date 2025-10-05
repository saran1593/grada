// js/careers.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if the career form is on the page to avoid errors
    const careerForm = document.getElementById('careerForm');
    
    if (careerForm) {
        careerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const interest = document.getElementById('interest').value;
            
            if (name && phone && interest) {
                alert('Thank you for your application! We will be in touch soon.');
                careerForm.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
});
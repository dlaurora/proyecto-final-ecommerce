// Ensure the script waits for the DOM to be fully loaded
window.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fs-frm');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const popupClose = document.getElementById('popup-close');

    // Function to show the popup
    function showPopup(message) {
        popupMessage.textContent = message;
        popup.style.display = 'flex'; // Display the popup
    }

    // Function to close the popup
    popupClose.addEventListener('click', function() {
        popup.style.display = 'none'; // Hide the popup
    });

    // Close popup if clicked outside the popup content
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    // Check if the form exists
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Create FormData object from the form
            const formData = new FormData(form);

            // Send form data using Fetch API
            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // Clear the form and show success message
                    form.reset();
                    showPopup('Message sent. Thank you for contacting us!');
                } else {
                    showPopup('Something went wrong. Please try again.');
                }
            }).catch(error => {
                // Handle network errors or other issues
                showPopup('Something went wrong. Please try again.');
            });
        });
    } else {
        console.error('Form element not found!');
    }
});

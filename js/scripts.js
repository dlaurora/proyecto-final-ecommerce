// Ensure the script waits for the DOM to be fully loaded
window.addEventListener('DOMContentLoaded', function() {
    // Variables for common elements
    const cartPopup = document.getElementById('cart-popup');
    const cartLink = document.querySelector('.cart-link');
    const cartCloseBtn = document.querySelector('.popup-close');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');

    // Toggle Cart Popup Visibility
    if (cartLink) {
        cartLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent link navigation
            cartPopup.style.display = 'flex'; // Show the cart popup
        });
    }

    // Close the cart popup
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', function() {
            cartPopup.style.display = 'none'; // Hide the cart popup
        });
    }

    // Close cart popup when clicking outside of the cart content
    window.addEventListener('click', function(event) {
        if (event.target === cartPopup) {
            cartPopup.style.display = 'none'; // Hide the cart popup
        }
    });

    // Add event listeners to quantity buttons in cart items
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let currentValue = parseInt(input.value);
            
            if (this.textContent === '+') {
                input.value = currentValue + 1; // Increase quantity
            } else if (this.textContent === '-' && currentValue > 1) {
                input.value = currentValue - 1; // Decrease quantity
            }

            updateCartTotal();
        });
    });

    // Remove items from the cart
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            this.parentElement.remove(); // Remove cart item
            updateCartTotal(); // Update cart total after removing
        });
    });

    // Update the total price of items in the cart
    function updateCartTotal() {
        const cartItems = document.querySelectorAll('.cart-item');
        let total = 0;
        cartItems.forEach(function(item) {
            const priceElement = item.querySelector('.item-price');
            const quantityInput = item.querySelector('.quantity-input');
            const price = parseFloat(priceElement.textContent.replace('$', ''));
            const quantity = parseInt(quantityInput.value);
            total += price * quantity;
        });

        // Ensure total price and summary details elements exist before updating
        const totalPriceElement = document.querySelector('.total-price p:last-child');
        const summaryDetailsElement = document.querySelector('.summary-details p:last-child');

        if (totalPriceElement) {
            totalPriceElement.textContent = '$ ' + total.toFixed(2);
        }

        if (summaryDetailsElement) {
            summaryDetailsElement.textContent = '$ ' + total.toFixed(2);
        }
    }

    // Add more interactivity for the give code input and shipping options
    const discountInput = document.getElementById('discount-code');
    const shippingOptions = document.getElementById('shipping');

    if (discountInput && shippingOptions) {
        shippingOptions.addEventListener('change', updateCartTotal); // Update total on shipping change
        discountInput.addEventListener('input', function() {
            // Optional: handle discount application logic here
            updateCartTotal(); // Recalculate total with discount
        });
    }

    // Common Popup Handling for Notifications (Optional Feature)
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const popupClose = document.getElementById('popup-close');

    // Function to show a popup with a message
    function showPopup(message) {
        popupMessage.textContent = message;
        popup.style.display = 'flex'; // Display the popup
    }

    // Close popup event listener
    if (popupClose) {
        popupClose.addEventListener('click', function() {
            popup.style.display = 'none'; // Hide the popup
        });
    }

    // Close popup when clicking outside the popup content
    window.addEventListener('click', function(event) {
        if (popup && event.target === popup) {
            popup.style.display = 'none';
        }
    });
});

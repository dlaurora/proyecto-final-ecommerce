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

    // Cart items array to store the products added
    let cartItems = [];

    // Function to add a product to the cart
    function addToCart(productName, productPrice, productImage) {
        const existingProduct = cartItems.find(item => item.name === productName);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cartItems.push({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }

        updateCartPopup();
    }

    // Function to update the cart popup display
    function updateCartPopup() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cd-cart__count li:first-child');

        cartItemsContainer.innerHTML = '';

        cartItems.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="item-price">$${item.price}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn" onclick="changeQuantity('${item.name}', -1)">-</button>
                        <input type="number" value="${item.quantity}" class="quantity-input" readonly>
                        <button class="quantity-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.name}')">×</button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        cartCount.textContent = cartItems.length;
        updateCartTotal();
    }

    // Function to change quantity of a product in the cart
    function changeQuantity(productName, change) {
        const product = cartItems.find(item => item.name === productName);

        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                removeFromCart(productName);
            } else {
                updateCartPopup();
            }
        }
    }

    // Function to remove a product from the cart
    function removeFromCart(productName) {
        cartItems = cartItems.filter(item => item.name !== productName);
        updateCartPopup();
    }

    // Function to update the total price in the cart
    function updateCartTotal() {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.quantity;
        });

        const totalPriceElement = document.querySelector('.total-price p:last-child');
        const summaryDetailsElement = document.querySelector('.summary-details p:last-child');

        if (totalPriceElement) {
            totalPriceElement.textContent = '$' + total.toFixed(2);
        }

        if (summaryDetailsElement) {
            summaryDetailsElement.textContent = '$' + total.toFixed(2);
        }
    }

    // Populate products from online mock data
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) {
        console.error('Error: .products-grid element not found in the DOM.');
    } else {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                data.forEach(product => {
                    const productHTML = `
                        <div class="product-item">
                            <img src="${product.image}" alt="${product.title}">
                            <h3>${product.title}</h3>
                            <p class="price">$${product.price}</p>
                            <p class="description">${product.description}</p>
                            <a href="#" class="btn-primary" onclick="addToCart('${product.title}', ${product.price}, '${product.image}')">Add to Cart</a>
                        </div>
                    `;
                    productsGrid.insertAdjacentHTML('beforeend', productHTML);
                });
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    // Carousel logic for 20 images from the folder
    const carouselItems = document.querySelector('.carousel-items');
    if (!carouselItems) {
        console.error('Error: .carousel-items element not found in the DOM.');
    } else {
        const images = [...Array(20)].map((_, i) => `assets/images/carousel/${i + 1}.png`);

        images.forEach(imgSrc => {
            const imgHTML = `<div class="carousel-item"><img src="${imgSrc}" alt="Carousel Image"></div>`;
            carouselItems.insertAdjacentHTML('beforeend', imgHTML);
        });

        let currentSlide = 0;

        function showSlide(index) {
            const slides = document.querySelectorAll('.carousel-item');
            carouselItems.style.transition = 'transform 0.5s ease-in-out';
            carouselItems.style.transform = `translateX(-${index * 100}%)`;
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % images.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + images.length) % images.length;
            showSlide(currentSlide);
        }

        // Event listeners for next and previous buttons
        const nextButton = document.querySelector('.carousel-next');
        const prevButton = document.querySelector('.carousel-prev');

        if (nextButton && prevButton) {
            nextButton.addEventListener('click', nextSlide);
            prevButton.addEventListener('click', prevSlide);
        }

        // Auto slide every 3 seconds
        setInterval(nextSlide, 3000); // Change slide every 3 seconds

        // Initialize carousel by showing the first slide
        showSlide(currentSlide);
    }
});

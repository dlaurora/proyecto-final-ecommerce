// script.js - Unified and improved

document.addEventListener('DOMContentLoaded', () => {
    // Global cart state from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Update cart count in navbar
    function updateCartCount() {
        const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
    }
    updateCartCount();

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartCount();
    }

    // Popup message function
    function showPopupMessage(message) {
        const popupMessage = document.getElementById('popup-message');
        if (!popupMessage) return;
        popupMessage.textContent = message;
        popupMessage.style.display = 'block';
        // Hide after 2 seconds
        setTimeout(() => {
            popupMessage.style.display = 'none';
        }, 2000);
    }

    // Toggle Mobile Menu
    window.toggleMenu = function() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('active');
        }
    };

    // Cart Popup on index (if any)
    const cartPopup = document.getElementById('cart-popup');
    const cartLink = document.querySelector('.cart-link');
    const closeCartBtn = cartPopup ? cartPopup.querySelector('.close-btn') : null;

    if (cartLink && window.location.pathname.includes('index.html')) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }

    function toggleCart() {
        if (cartPopup) {
            cartPopup.style.display = cartPopup.style.display === 'flex' ? 'none' : 'flex';
            updateCartDisplayPopup();
        }
    }

    function closeCartPopup() {
        if (cartPopup) cartPopup.style.display = 'none';
    }

    function updateCartDisplayPopup() {
        if (!cartPopup) return;
        const cartItemsList = document.getElementById('cart-items-list');
        const cartTotalPrice = document.getElementById('cart-total-price');

        if (!cartItemsList || !cartTotalPrice) return;

        cartItemsList.innerHTML = '';
        let total = 0;

        cartItems.forEach(item => {
            total += item.price * item.quantity;
            const itemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Price: $${item.price.toFixed(2)}</p>
                        <p>Quantity: 
                            <button class="quantity-btn" onclick="changeQuantityPopup('${item.name}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="changeQuantityPopup('${item.name}', 1)">+</button>
                        </p>
                    </div>
                    <button class="remove-item" onclick="removeFromCartPopup('${item.name}')">×</button>
                </div>
            `;
            cartItemsList.insertAdjacentHTML('beforeend', itemHTML);
        });

        cartTotalPrice.innerHTML = `<p>Total: $${total.toFixed(2)}</p>`;
    }

    window.removeFromCartPopup = function(productName) {
        cartItems = cartItems.filter(item => item.name !== productName);
        saveCart();
        updateCartDisplayPopup();
    };

    window.changeQuantityPopup = function(productName, change) {
        const product = cartItems.find(item => item.name === productName);
        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                removeFromCartPopup(productName);
            } else {
                saveCart();
                updateCartDisplayPopup();
            }
        }
    };

    window.checkout = function() {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
        } else {
            // Show popup "Thank you for your purchase"
            showPopupMessage("Thank you for your purchase");
            // Clear cart after checkout for demo
            cartItems = [];
            saveCart();
            if (window.location.pathname.includes('cart.html')) {
                updateCartPageDisplay();
            }
        }
    };

    // Add to cart function
    window.addToCart = function(productName, productPrice, productImage) {
        const existingProduct = cartItems.find(item => item.name === productName);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cartItems.push({
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: 1
            });
        }
        saveCart();
        // Show popup: product added
        showPopupMessage("Product has been added to your bucket");
    };

    window.changeQuantity = function(productName, change) {
        const product = cartItems.find(item => item.name === productName);
        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                cartItems = cartItems.filter(item => item.name !== productName);
            }
            saveCart();
            if (window.location.pathname.includes('cart.html')) {
                updateCartPageDisplay();
            }
        }
    };

    window.removeFromCart = function(productName) {
        cartItems = cartItems.filter(item => item.name !== productName);
        saveCart();
        if (window.location.pathname.includes('cart.html')) {
            updateCartPageDisplay();
        }
    };

    function updateCartPageDisplay() {
        if (!window.location.pathname.includes('cart.html')) return;
        const cartItemsList = document.getElementById('cart-items-list');
        const cartSummary = document.getElementById('cart-summary');
        const totalPriceElement = document.getElementById('total-price');
        const shippingSelect = document.getElementById('shipping');

        cartItemsList.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        cartItems.forEach(item => {
            total += item.price * item.quantity;
            itemCount += item.quantity;
            const itemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Price: $${item.price.toFixed(2)}</p>
                        <p>Quantity: 
                            <button class="quantity-btn" onclick="changeQuantity('${item.name}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
                        </p>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.name}')">×</button>
                </div>
            `;
            cartItemsList.insertAdjacentHTML('beforeend', itemHTML);
        });

        cartSummary.innerHTML = `<p>Items: ${itemCount}</p><p>Subtotal: $${total.toFixed(2)}</p>`;

        function updateTotalPrice() {
            const selectedShipping = shippingSelect.value;
            const shippingCost = parseFloat(selectedShipping.split('-')[1]);
            const grandTotal = total + shippingCost;
            totalPriceElement.innerHTML = `<p>Total Price: $${grandTotal.toFixed(2)}</p>`;
        }

        shippingSelect.addEventListener('change', updateTotalPrice);
        updateTotalPrice();

        window.applyDiscount = function() {
            const discountCode = document.getElementById('discount-code').value;
            const priceText = totalPriceElement.textContent.replace('Total Price: $','');
            let displayedPrice = parseFloat(priceText);

            if (discountCode === 'DISCOUNT20') {
                const discount = displayedPrice * 0.2;
                displayedPrice = displayedPrice - discount;
                totalPriceElement.innerHTML = `<p>Total Price (with discount): $${displayedPrice.toFixed(2)}</p>`;
            } else {
                alert('Invalid discount code');
            }
        };
    }

    updateCartPageDisplay();

    // Shop page product fetching and filtering
    if (window.location.pathname.includes('shop.html')) {
        const productList = document.getElementById('product-list');
        const productSearch = document.getElementById('product-search');
        const productCategory = document.getElementById('product-category');
        const searchBtn = document.getElementById('search-btn');
        let products = [];

        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                products = data;
                displayProducts(products);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                productList.innerHTML = '<p>Error loading products. Please try again later.</p>';
            });

        function displayProducts(list) {
            productList.innerHTML = list.map(product => `
                <div class="product-item">
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p class="price">$${product.price}</p>
                    <p class="description">${product.description.slice(0, 100)}...</p>
                    <button class="btn-primary" onclick="addToCart('${product.title.replace(/'/g,"\\'")}', ${product.price}, '${product.image}')">Add to Cart</button>
                </div>
            `).join('');
        }

        function filterProducts() {
            const searchTerm = productSearch.value.toLowerCase().trim();
            const category = productCategory.value;
            const filtered = products.filter(p => {
                const inCategory = category === 'all' || p.category.toLowerCase().includes(category.toLowerCase()) || (category === 'fashion' && (p.category.toLowerCase().includes('men')||p.category.toLowerCase().includes('women')));
                const inSearch = p.title.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm);
                return inCategory && inSearch;
            });
            displayProducts(filtered);
        }

        productSearch.addEventListener('input', filterProducts);
        productCategory.addEventListener('change', filterProducts);
        searchBtn.addEventListener('click', filterProducts);
    }

    // Contact form submission handled by Formspree (already integrated), no change needed
});

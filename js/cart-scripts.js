document.addEventListener('DOMContentLoaded', () => {
    let cartItems = [];

    function updateCartDisplay() {
        const cartItemsList = document.getElementById('cart-items-list');
        const cartSummary = document.getElementById('cart-summary');
        const totalPrice = document.getElementById('total-price');

        if (!cartItemsList || !cartSummary || !totalPrice) return;

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
        updateTotalPrice(total);
    }

    function updateTotalPrice(subtotal) {
        const shippingCost = parseFloat(document.getElementById('shipping').value.split('-')[1].trim());
        const totalPriceElement = document.getElementById('total-price');
        const total = subtotal + shippingCost;

        totalPriceElement.innerHTML = `<p>Total Price: $${total.toFixed(2)}</p>`;
    }

    function changeQuantity(productName, change) {
        const product = cartItems.find(item => item.name === productName);
        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                removeFromCart(productName);
            } else {
                updateCartDisplay();
            }
        }
    }

    function removeFromCart(productName) {
        cartItems = cartItems.filter(item => item.name !== productName);
        updateCartDisplay();
    }

    function checkout() {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
        } else {
            alert('Checkout process not implemented yet. Cart items:\n' + JSON.stringify(cartItems, null, 2));
        }
    }

    function applyDiscount() {
        const discountCode = document.getElementById('discount-code').value;
        // Here you would normally validate the discount code against a backend
        if (discountCode === 'DISCOUNT20') {
            let total = parseFloat(document.querySelector('.total-price p').textContent.slice(13)); // Assuming format "Total Price: $XX.XX"
            let discount = total * 0.20;
            let newTotal = total - discount;

            document.getElementById('total-price').innerHTML = `<p>Total Price (with discount): $${newTotal.toFixed(2)}</p>`;
        } else {
            alert('Invalid discount code');
        }
    }

    // Event listeners for shipping selection
    document.getElementById('shipping').addEventListener('change', () => {
        updateTotalPrice(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
    });

    // Initial cart display
    updateCartDisplay();

    // Adding some mock data to simulate items in cart
    cartItems = [
        { name: "Laptop", price: 999.99, image: "assets/images/laptop.jpg", quantity: 1 },
        { name: "Headphones", price: 149.99, image: "assets/images/headphones.jpg", quantity: 2 }
    ];
    updateCartDisplay();
});
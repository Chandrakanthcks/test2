// Sample product data
const products = [
    {
        id: 1,
        name: "Apple iPhone 14",
        price: 69999,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
        desc: "128 GB ROM, 6.1 inch Super Retina XDR Display, 12MP Dual Camera",
        rating: 4.6
    },
    {
        id: 2,
        name: "Samsung Galaxy S23",
        price: 64999,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
        desc: "256 GB ROM, 6.1 inch Dynamic AMOLED 2X, 50MP Triple Camera",
        rating: 4.5
    },
    {
        id: 3,
        name: "Sony WH-1000XM4 Headphones",
        price: 19990,
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80",
        desc: "Industry Leading Noise Cancellation, 30 Hours Battery Life",
        rating: 4.7
    },
    {
        id: 4,
        name: "HP Pavilion Laptop",
        price: 55999,
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
        desc: "Intel i5 12th Gen, 16GB RAM, 512GB SSD, 15.6 inch FHD",
        rating: 4.4
    },
    {
        id: 5,
        name: "Nike Revolution 5 Running Shoes",
        price: 3499,
        image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
        desc: "Lightweight, Breathable, Cushioned for Comfort",
        rating: 4.3
    }
];

let cart = [];

function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/140?text=No+Image';">
            <div class="product-title">${product.name}</div>
            <div class="product-rating">${product.rating} ★</div>
            <div class="product-desc">${product.desc}</div>
            <div class="product-price">₹${product.price.toLocaleString()}</div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function showCart() {
    document.getElementById('cart-modal').classList.add('active');
    renderCartItems();
}

function hideCart() {
    document.getElementById('cart-modal').classList.remove('active');
}

function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} x${item.qty}</span>
            <span>₹${(item.price * item.qty).toLocaleString()}</span>
            <button class="remove-item" data-id="${item.id}">Remove</button>
        `;
        cartItems.appendChild(li);
        total += item.price * item.qty;
    });
    document.getElementById('cart-total').textContent = total.toLocaleString();
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();

    document.getElementById('products-container').addEventListener('click', e => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === id);
            const cartItem = cart.find(item => item.id === id);
            if (cartItem) {
                cartItem.qty += 1;
            } else {
                cart.push({ ...product, qty: 1 });
            }
            updateCartCount();
        }
    });

    document.getElementById('cartBtn').addEventListener('click', showCart);
    document.getElementById('closeCart').addEventListener('click', hideCart);
    document.getElementById('cart-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('cart-modal')) hideCart();
    });
    document.getElementById('cart-items').addEventListener('click', e => {
        if (e.target.classList.contains('remove-item')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            cart = cart.filter(item => item.id !== id);
            renderCartItems();
            updateCartCount();
        }
    });
}); 
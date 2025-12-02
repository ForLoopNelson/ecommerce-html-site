


// Assuming you have buttons with a class 'add-to-cart-btn' and data attributes for product info
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productPrice = parseFloat(button.dataset.productPrice); // Convert to number
        const quantityInput = document.getElementById(`quantity-${productId}`); // Optional: if you have a quantity input
        const selectedQuantity = quantityInput ? parseInt(quantityInput.value) : 1;
        const img = button.dataset.productImg;

        addToCart(productId, productName, productPrice, selectedQuantity, img);
    });
});

// Load cart from localStorage or create empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart back to storage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add item to cart
function addToCart(id, name, price, quantity = 1, img) {
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id, name, price, quantity, img });
    }

    saveCart();
    updateCartUI();
    updateCartIcon();
    showToast(`${name} added to cart!`);
}


function showToast(message = "Added to cart!") {
    const toast = document.getElementById("cart-toast");
    toast.textContent = message;
    toast.style.display = "block";
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.transition = "opacity 0.6s";
        toast.style.opacity = "0";
    }, 1200);

    setTimeout(() => {
        toast.style.display = "none";
        toast.style.transition = "";
    }, 1800);
}

function updateCartIcon() {
    const cartCount = document.getElementById("cart-count");
    if (!cartCount) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems > 0 ? totalItems : "";
}


// Render cart into cart.html
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return; // so products page doesn't break

    cartItemsContainer.innerHTML = '';

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        const div = document.createElement("div");
        div.classList.add("d-flex", "justify-content-between", "align-items-center", "border-bottom", "py-2");

         div.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:6px; margin-right:10px;">
                <div>
                    <strong>${item.name}</strong><br>
                    $${item.price.toFixed(2)} x ${item.quantity}
                </div>
            </div>

            <button class="btn btn-danger btn-sm remove-btn" data-id="${item.id}">
                Remove
            </button>
        `;

        cartItemsContainer.appendChild(div);
    });

    // Tax is 8% (change if needed)
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    document.getElementById("cart-subtotal").textContent = "$" + subtotal.toFixed(2);
    document.getElementById("cart-tax").textContent = "$" + tax.toFixed(2);
    document.getElementById("cart-total").textContent = "$" + total.toFixed(2);

    enableRemoveButtons();
}

function enableRemoveButtons() {
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            cart = cart.filter(item => item.id !== id);
            saveCart();
            updateCartUI()
            updateCartIcon();
        });
    });
}

// Run on page load
updateCartUI();

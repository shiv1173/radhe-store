const products = [
  {
    id: 1,
    name: 'Urban Smart Watch',
    category: 'electronics',
    price: 3499,
    emoji: '⌚',
    tag: 'Best Seller',
    rating: '4.9',
    description: 'Track fitness, calls, and style with a sporty AMOLED display.'
  },
  {
    id: 2,
    name: 'Classic Bluetooth Speaker',
    category: 'electronics',
    price: 2199,
    emoji: '🔊',
    tag: 'New',
    rating: '4.8',
    description: 'Rich sound and premium bass for your everyday vibe.'
  },
  {
    id: 3,
    name: 'Cotton Everyday Tee',
    category: 'fashion',
    price: 799,
    emoji: '👕',
    tag: 'Popular',
    rating: '4.7',
    description: 'A soft, breathable essential designed for all-day comfort.'
  },
  {
    id: 4,
    name: 'Heritage Leather Bag',
    category: 'fashion',
    price: 2499,
    emoji: '👜',
    tag: 'Premium',
    rating: '4.9',
    description: 'Minimal, durable, and crafted to match your outfit effortlessly.'
  },
  {
    id: 5,
    name: 'Minimal Desk Lamp',
    category: 'home',
    price: 1699,
    emoji: '💡',
    tag: 'Home Pick',
    rating: '4.8',
    description: 'Warm ambient light for calm evenings and productive work.'
  },
  {
    id: 6,
    name: 'Premium Throw Pillow Set',
    category: 'home',
    price: 1299,
    emoji: '🛋️',
    tag: 'Comfort',
    rating: '4.7',
    description: 'Soft textures and cozy colors to elevate your space.'
  },
  {
    id: 7,
    name: 'Travel Bottle Kit',
    category: 'home',
    price: 899,
    emoji: '🧴',
    tag: 'Utility',
    rating: '4.6',
    description: 'A sleek, reusable everyday kit for hydration and convenience.'
  },
  {
    id: 8,
    name: 'Signature Hoodie',
    category: 'fashion',
    price: 1899,
    emoji: '🧥',
    tag: 'Trending',
    rating: '4.9',
    description: 'Warm, relaxed fit that balances comfort and streetwear style.'
  }
];

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const state = {
  filter: 'all',
  cart: JSON.parse(localStorage.getItem('radhe-store-cart') || '[]')
};

const productGrid = document.getElementById('productGrid');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const deliveryEl = document.getElementById('delivery');
const totalEl = document.getElementById('total');
const toast = document.getElementById('toast');

function formatPrice(n) {
  return currency.format(n);
}

function saveCart() {
  localStorage.setItem('radhe-store-cart', JSON.stringify(state.cart));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 1600);
}

function renderProducts() {
  const items = state.filter === 'all'
    ? products
    : products.filter((product) => product.category === state.filter);

  productGrid.innerHTML = items
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-visual" aria-label="${product.name}">${product.emoji}</div>
          <div class="product-body">
            <div class="product-meta">
              <span class="product-tag">${product.tag}</span>
              <span class="product-rating">★ ${product.rating}</span>
            </div>
            <h4 class="product-name">${product.name}</h4>
            <p class="product-desc">${product.description}</p>
            <div class="product-footer">
              <span class="product-price">${formatPrice(product.price)}</span>
              <button class="add-btn" data-id="${product.id}">Add</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.add-btn').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.id)));
  });
}

function addToCart(productId) {
  const existing = state.cart.find((item) => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    const product = products.find((item) => item.id === productId);
    state.cart.push({ id: product.id, qty: 1, name: product.name, emoji: product.emoji, price: product.price });
  }

  saveCart();
  renderCart();
  showToast('Added to cart');
}

function updateCartItem(productId, delta) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== productId);
  }

  saveCart();
  renderCart();
}

function renderCart() {
  if (!state.cart.length) {
    cartItems.innerHTML = '<p style="color: var(--muted); margin: 0;">Your cart is empty.</p>';
  } else {
    cartItems.innerHTML = state.cart
      .map(
        (item) => `
          <div class="cart-item">
            <div class="emoji">${item.emoji}</div>
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p>${formatPrice(item.price * item.qty)}</p>
              <div class="qty-control">
                <button data-action="decrease" data-id="${item.id}">−</button>
                <span>${item.qty}</span>
                <button data-action="increase" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        `
      )
      .join('');
  }

  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal > 0 ? (subtotal >= 999 ? 0 : 99) : 0;
  const total = subtotal + delivery;

  cartCount.textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);
  subtotalEl.textContent = formatPrice(subtotal);
  deliveryEl.textContent = formatPrice(delivery);
  totalEl.textContent = formatPrice(total);

  document.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      updateCartItem(id, action === 'increase' ? 1 : -1);
    });
  });
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.filter = button.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.toggle('active', btn === button));
      renderProducts();
    });
  });
}

function initCartToggle() {
  document.getElementById('cartToggle').addEventListener('click', () => {
    cartPanel.classList.toggle('open');
  });

  document.getElementById('cartClose').addEventListener('click', () => {
    cartPanel.classList.remove('open');
  });

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (!state.cart.length) {
      showToast('Cart is empty');
      return;
    }
    showToast('Checkout started');
  });
}

renderProducts();
renderCart();
initFilters();
initCartToggle();

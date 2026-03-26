/* ====================================
   LUMORA HOME — E-Commerce Script
   ==================================== */

'use strict';

/* ---- PRODUCT CATALOG ---- */
const PRODUCTS = [
  {
    id: 'cedarwood-candle',
    name: 'Cedarwood & Amber Candle',
    price: 24.00,
    category: 'Candles',
    image: '1602607202436-d1b8db3b7b32',
    slug: 'product-cedarwood-candle.html',
    badge: null
  },
  {
    id: 'knit-throw-blanket',
    name: 'Chunky Knit Throw Blanket',
    price: 68.00,
    category: 'Textiles',
    image: '1674475760738-8c7af859f821',
    slug: 'product-knit-throw-blanket.html',
    badge: null
  },
  {
    id: 'ceramic-mug',
    name: 'Handmade Ceramic Mug',
    price: 22.00,
    category: 'Ceramics',
    image: '1657395348189-a19abe13fb1e',
    slug: 'product-ceramic-mug.html',
    badge: 'Bestseller'
  },
  {
    id: 'storage-basket',
    name: 'Seagrass Storage Basket',
    price: 48.00,
    category: 'Storage',
    image: '1668783071383-43f4602af5cb',
    slug: 'product-storage-basket.html',
    badge: null
  },
  {
    id: 'reed-diffuser',
    name: 'Bamboo Reed Diffuser',
    price: 36.00,
    category: 'Aromatherapy',
    image: '1590595536952-b41d04eb7b08',
    slug: 'product-reed-diffuser.html',
    badge: null
  },
  {
    id: 'wall-clock',
    name: 'Oak & Brass Wall Clock',
    price: 74.00,
    category: 'Home Decor',
    image: '1645241910531-d32735b412a2',
    slug: 'product-wall-clock.html',
    badge: 'New'
  },
  {
    id: 'wool-rug',
    name: 'Hand-Loomed Wool Rug',
    price: 128.00,
    category: 'Rugs',
    image: '1629949009765-40fc74c9ec21',
    slug: 'product-wool-rug.html',
    badge: null
  },
  {
    id: 'serving-board',
    name: 'Acacia Serving Board',
    price: 38.00,
    category: 'Kitchen',
    image: '1660002561318-6ef0a0ae1f04',
    slug: 'product-serving-board.html',
    badge: null
  },
  {
    id: 'towel-set',
    name: 'Honeycomb Towel Set',
    price: 52.00,
    category: 'Textiles',
    image: '1511401139252-f158d3209c17',
    slug: 'product-towel-set.html',
    badge: null
  },
  {
    id: 'botanical-prints',
    name: 'Botanical Print Set',
    price: 32.00,
    category: 'Wall Art',
    image: '1704026438363-11504e77bfe7',
    slug: 'product-botanical-prints.html',
    badge: null
  }
];

/* ---- CART UTILITIES ---- */
const CART_KEY = 'lumora_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 10);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: qty,
      image: product.image
    });
  }
  saveCart(cart);
  showToast(`"${product.name}" added to cart`);
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  if (typeof renderCart === 'function') renderCart();
}

function updateCartQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, Math.min(item.qty + delta, 10));
  saveCart(cart);
  if (typeof renderCart === 'function') renderCart();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

/* ---- CART BADGE ---- */
function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count > 0 ? count : '';
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

/* ---- TOAST ---- */
let toastTimer;
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast toast--success';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ---- SCROLL ANIMATIONS ---- */
function initFadeUp() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

/* ---- NAV BEHAVIORS ---- */
function initNav() {
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }
  // Mobile burger
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) mobileMenu.classList.remove('open');
    });
  }
}

/* ---- COOKIE CONSENT ---- */
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;
  if (!localStorage.getItem('lumora_cookie')) {
    setTimeout(() => banner.classList.add('show'), 1200);
  }
  banner.querySelector('.cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('lumora_cookie', 'accepted');
    banner.classList.remove('show');
  });
  banner.querySelector('.cookie-decline')?.addEventListener('click', () => {
    localStorage.setItem('lumora_cookie', 'declined');
    banner.classList.remove('show');
  });
}

/* ---- NEWSLETTER ---- */
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const success = form.nextElementSibling;
    if (success && success.classList.contains('newsletter__success')) {
      form.style.display = 'none';
      success.style.display = 'block';
    }
  });
}

/* ---- PRODUCT PAGE: QTY SELECTOR ---- */
function initQtySelector() {
  const qtyInput = document.querySelector('.qty-input');
  if (!qtyInput) return;
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      let v = parseInt(qtyInput.value) || 1;
      if (btn.dataset.action === 'plus') v = Math.min(v + 1, 10);
      if (btn.dataset.action === 'minus') v = Math.max(v - 1, 1);
      qtyInput.value = v;
    });
  });
}

/* ---- PRODUCT PAGE: THUMBNAIL GALLERY ---- */
function initThumbnails() {
  const mainImg = document.querySelector('.product-detail__main-img img');
  document.querySelectorAll('.product-detail__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (mainImg) mainImg.src = thumb.querySelector('img').src.replace('w=120', 'w=800');
      document.querySelectorAll('.product-detail__thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

/* ---- ADD TO CART BUTTON (product page) ---- */
function initAddToCartBtn() {
  const btn = document.querySelector('.add-to-cart-btn');
  const qtyInput = document.querySelector('.qty-input');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const productId = btn.dataset.productId;
    const qty = parseInt(qtyInput?.value) || 1;
    addToCart(productId, qty);
    btn.textContent = 'Added to Cart!';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.classList.remove('added');
    }, 2200);
  });
}

/* ---- CHECKOUT PAGE ---- */
function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const emptyCart = document.getElementById('empty-cart');
  const checkoutBtn = document.getElementById('place-order-btn');
  const formWrap = document.getElementById('checkout-form-wrap');
  const cart = getCart();

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '';
    if (emptyCart) emptyCart.style.display = 'block';
    if (formWrap) formWrap.style.opacity = '0.5';
    if (checkoutBtn) checkoutBtn.disabled = true;
    document.getElementById('order-subtotal').textContent = '$0.00';
    document.getElementById('order-shipping').textContent = 'Free';
    document.getElementById('order-total').textContent = '$0.00';
    return;
  }

  if (emptyCart) emptyCart.style.display = 'none';
  if (formWrap) formWrap.style.opacity = '1';
  if (checkoutBtn) checkoutBtn.disabled = false;

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__img">
        <img src="https://images.unsplash.com/photo-${item.image}?w=140&q=80&fit=crop" alt="${item.name}" loading="lazy" />
      </div>
      <div>
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__qty">Qty: ${item.qty}</div>
        <button class="cart-item__remove" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
      <div class="cart-item__price">$${(item.price * item.qty).toFixed(2)}</div>
    </div>
  `).join('');

  const subtotal = getCartTotal();
  const shipping = subtotal >= 75 ? 0 : 8.99;
  document.getElementById('order-subtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('order-shipping').textContent = shipping === 0 ? 'Free' : '$' + shipping.toFixed(2);
  document.getElementById('order-total').textContent = '$' + (subtotal + shipping).toFixed(2);
}

/* ---- CHECKOUT FORM ---- */
function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;
  renderCart();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateCheckoutForm(form)) return;

    const modal = document.getElementById('order-modal');
    const orderNum = 'LH-' + Math.floor(1000 + Math.random() * 9000);
    const name = form.querySelector('[name="fullname"]').value;
    const city = form.querySelector('[name="city"]').value;
    const state = form.querySelector('[name="state"]').value;

    document.getElementById('order-number-display').textContent = orderNum;
    document.getElementById('modal-name').textContent = name;
    document.getElementById('modal-address').textContent = `${city}, ${state}`;

    if (modal) modal.classList.add('open');
    clearCart();
  });

  document.getElementById('modal-close-btn')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

function validateCheckoutForm(form) {
  let valid = true;
  const required = form.querySelectorAll('[required]');
  required.forEach(field => {
    const group = field.closest('.form-group');
    if (!field.value.trim()) {
      if (group) group.classList.add('has-error');
      field.classList.add('error');
      valid = false;
    } else {
      if (group) group.classList.remove('has-error');
      field.classList.remove('error');
    }
  });
  // Consent
  const consent = form.querySelector('[name="consent"]');
  if (consent && !consent.checked) {
    showToast('Please accept the terms to continue.');
    valid = false;
  }
  if (!valid) showToast('Please fill in all required fields.');
  return valid;
}

/* ---- HOMEPAGE: ADD TO CART from grid ---- */
function initGridAddToCart() {
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(btn.dataset.addToCart, 1);
    });
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initNav();
  initFadeUp();
  initCookieBanner();
  initNewsletter();
  initQtySelector();
  initThumbnails();
  initAddToCartBtn();
  initCheckoutForm();
  initGridAddToCart();
});

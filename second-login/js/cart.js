
   // =============== CART MANAGEMENT ===============
// Helper: Safely get element — avoids null errors
function $(id) {
  return document.getElementById(id);
}

// Load cart safely
function loadCart() {
  const saved = localStorage.getItem('cart');
  if (!saved) return [];
  try {
    const cart = JSON.parse(saved);
    // Ensure all prices are numbers (critical fix!)
    return cart.map(item => ({
      ...item,
      price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[₦,]/g, '')) || 0,
      qty: typeof item.qty === 'number' ? item.qty : parseInt(item.qty) || 1
    })).filter(item => item.qty > 0 && item.price >= 0);
  } catch (e) {
    console.warn('⚠️ Invalid cart data — resetting.', e);
    return [];
  }
}

let cart = loadCart();

// =============== RENDERING ===============
function renderCart() {
  const cartItemsContainer = $('cart-items');
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x" style="font-size: 3rem; color: #aaa;"></i>
        <h4 class="mt-3">Your cart is empty</h4>
        <p class="text-muted">Looks like you haven't added anything yet.</p>
        <a href="/second-login/public/product2.html" class="btn btn-primary mt-3">
          <i class="bi bi-bag-plus"></i> Browse Products
        </a>
      </div>
    `;
    updateSummary(0, 0);
    return;
  }

  let html = '';
  let totalItems = 0;
  let subtotal = 0;

  cart.forEach((item, index) => {
    // Recalculate in case of stale data
    const itemTotal = item.price * item.qty;
    totalItems += item.qty;
    subtotal += itemTotal;

    const imgUrl = getProductImage(item.name);

    html += `
      <div class="card mb-3 cart-item-card">
        <div class="card-body d-flex align-items-center">
          <img src="${imgUrl}" alt="${item.name}" class="product-img me-3" width="80" height="80">
          
          <div class="flex-grow-1">
            <h6 class="mb-1">${item.name}</h6>
            <p class="text-muted mb-1">
              <strong>${item.qty} ×</strong> ₦${item.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div class="text-end">
            <div class="fw-bold">₦${itemTotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <button class="btn remove-btn p-0 text-danger" onclick="removeItem(${index})">
              <i class="bi bi-trash"></i> Remove
            </button>
          </div>
        </div>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = html;
  updateSummary(totalItems, subtotal);
}

// =============== IMAGE MAP ===============
function getProductImage(name) {
  const imageMap = {
    'CRN Prevention': '/second-login/assets/img/medi-1.jpg',
    'Anadin Extra': '/second-login/assets/img/medi-2.jpg',
    'Maxirich Gold': '/second-login/assets/img/medi-3.jpg',
    'Cloreto de Magnésio': '/second-login/assets/img/medi-4.jpg',
    'Perioclean Sem': '/second-login/assets/img/medi-5.jpg',
    'Biorela® MagneBiotic': '/second-login/assets/img/medi-6.jpg',
    'Melatonina': '/second-login/assets/img/medi-7.jpg',
    'Hytos Plus': '/second-login/assets/img/medi-8.jpg',
    'Alkagel 6% + 4%': '/second-login/assets/img/medi-9.jpg',
    'Herbion Pharma': '/second-login/assets/img/medi-10.jpg',
    'Fowler\'s® Digestive': '/second-login/assets/img/medi-11.jpg',
    'Mounjaro Bests': '/second-login/assets/img/medi-12.jpg',
    'BalanceFrom GoCloud': '/second-login/assets/img/fit-3.jpg',
    'Bala Bangles/Ankle': '/second-login/assets/img/fit-4.jpg',
    'Bala Bangles': '/second-login/assets/img/fit-5.jpg',
    '20lb Decorative Weight': '/second-login/assets/img/fit-6.jpg',
    'modern kettlebells': '/second-login/assets/img/fit-7.jpg',
    'Fitvii smart watch': '/second-login/assets/img/fit-8.jpg',
    'New Et585 ECG Smart Watch': '/second-login/assets/img/fit-9.jpg',
    'Sleep Monitor 1.39" HD Blt': '/second-login/assets/img/fit-10.jpg',
    'Electric Rehab Trainer': '/second-login/assets/img/fit-11.jpg',
    'Fitbit Fitness Tracker': '/second-login/assets/img/fit-12.jpg',
    'Vibration Plate': '/second-login/assets/img/fit-13.jpg',
    'Neoprene Dumbbell Set': '/second-login/assets/img/fit-14.jpg'
  };
  return imageMap[name] || '/second-login/assets/img/placeholder.jpg';
}

// =============== SUMMARY UPDATE (SAFE) ===============
function updateSummary(totalItems, subtotal) {
  // Update badges & counts
  const setText = (id, text) => { const el = $(id); if (el) el.textContent = text; };

  setText('item-count-badge', `${totalItems} item${totalItems !== 1 ? 's' : ''}`);
  setText('summary-count', totalItems);
  setText('subtotal-amount', `₦${subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

  // Shipping logic: ₦0 over ₦20,000, else ₦2,000
  const shipping = subtotal >= 20000 ? 0 : 2000;
  const total = subtotal + shipping;

  setText('shipping-amount', shipping === 0 ? 'Free' : `₦${shipping.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  setText('total-amount', `₦${total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

  // Optional: Update navbar cart count globally
  const navCount = document.querySelector('.cart-count');
  if (navCount) navCount.textContent = totalItems;
}

// =============== CART OPERATIONS ===============
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  // Optional: dispatch event for cross-page sync (advanced)
  window.dispatchEvent(new Event('cartUpdated'));
}

function removeItem(index) {
  if (index < 0 || index >= cart.length) return;
  if (!confirm(`🗑️ Remove "${cart[index].name}" from cart?`)) return;

  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function clearCart() {
  if (!confirm('🧹 Are you sure you want to clear your cart?')) return;
  cart = [];
  saveCart();
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    alert('🛒 Your cart is empty! Add some wellness products first.');
    return;
  }

  const btn = document.querySelector('.btn-success, .btn-primary');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Processing...';
  }

  setTimeout(() => {
    window.location.href = '/second-login/public/payment2.html';
  }, 500);
}

// =============== EXTERNAL SYNC (e.g., from product page) ===============
// Listen for manual updates (e.g., if cart modified elsewhere)
window.addEventListener('storage', () => {
  cart = loadCart();
  renderCart();
});

// Optional: Allow external scripts to trigger refresh
window.refreshCart = () => {
  cart = loadCart();
  renderCart();
};

// =============== INITIALIZE ===============
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  
  // Optional: If cart changes in another tab
  window.addEventListener('focus', () => {
    const currentCart = loadCart();
    if (JSON.stringify(currentCart) !== JSON.stringify(cart)) {
      cart = currentCart;
      renderCart();
    }
  });
});
  

// ✅ 1. LOAD CART FROM localStorage (critical fix!)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ✅ 2. Helper: Clean price to number (defensive)
function cleanPrice(price) {
  if (typeof price === 'number') return price;
  return parseFloat(String(price).replace(/[₦,₦\s]/g, '')) || 0;
}

// ✅ 3. Nigerian formatter
const nairaFormat = (amount) => 
  `₦${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ✅ 4. Render summary — now safe & synced with cart page
function renderOrderSummary() {
  // Get elements (safe)
  const $ = id => document.getElementById(id);
  const itemsContainer = $('order-items');
  const subtotalDisplay = $('subtotal-display');
  const shippingDisplay = $('shipping-display');
  const taxDisplay = $('tax-display');
  const totalDisplay = $('total-display');
  const payAmount = $('pay-amount');
  const payButton = $('pay-button');
  const cartBadge = $('cart-badge');

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p class="text-muted">No items in cart.</p>';
    if (subtotalDisplay) subtotalDisplay.textContent = '₦0.00';
    if (shippingDisplay) shippingDisplay.textContent = 'Free';
    if (taxDisplay) taxDisplay.textContent = '₦0.00';
    if (totalDisplay) totalDisplay.textContent = '₦0.00';
    if (payAmount) payAmount.textContent = 'Pay ₦0.00';
    if (cartBadge) cartBadge.textContent = '0';
    if (payButton) payButton.disabled = true;
    return;
  }

  // Calculate
  let subtotal = 0;
  cart.forEach(item => {
    const price = cleanPrice(item.price);
    const qty = item.qty > 0 ? item.qty : 1;
    subtotal += price * qty;
  });

  const shipping = subtotal >= 20000 ? 0 : 2000;
  const tax = 0; // set to subtotal * 0.075 if needed
  const total = subtotal + shipping + tax;

  const totalCount = cart.reduce((sum, item) => sum + (item.qty > 0 ? item.qty : 1), 0);

  // Update badge
  if (cartBadge) cartBadge.textContent = totalCount;

  // Items list
  let itemsHTML = '';
  cart.forEach(item => {
    const price = cleanPrice(item.price);
    const qty = item.qty > 0 ? item.qty : 1;
    const itemTotal = price * qty;
    itemsHTML += `
      <div class="d-flex justify-content-between mb-2">
        <span>${qty} × ${item.name}</span>
        <span>${nairaFormat(itemTotal)}</span>
      </div>
    `;
  });
  if (itemsContainer) itemsContainer.innerHTML = itemsHTML;

  // Amounts
  if (subtotalDisplay) subtotalDisplay.textContent = nairaFormat(subtotal);
  if (shippingDisplay) shippingDisplay.textContent = shipping === 0 ? 'Free' : nairaFormat(shipping);
  if (taxDisplay) taxDisplay.textContent = nairaFormat(tax);
  if (totalDisplay) totalDisplay.textContent = nairaFormat(total);
  if (payAmount) payAmount.textContent = `Pay ${nairaFormat(total)}`;
  if (payButton) payButton.disabled = false;
}

// ✅ 5. Card formatting (unchanged — works)
document.getElementById('cardNumber')?.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  let formatted = '';
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += ' ';
    formatted += value[i];
  }
  e.target.value = formatted.substring(0, 19);
});

document.getElementById('expiry')?.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '').substring(0, 4);
  if (value.length >= 2) {
    e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
  } else {
    e.target.value = value;
  }
});

// ✅ 6. Form submit
document.getElementById('paymentForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const card = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
  const expiry = document.getElementById('expiry')?.value;
  const cvc = document.getElementById('cvc')?.value;
  const zip = document.getElementById('zip')?.value;
  const name = document.getElementById('name')?.value;
  
  // Validation
  if (!card || card.length < 13 || card.length > 19) {
    alert('⚠️ Please enter a valid card number.');
    return;
  }
  if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
    alert('⚠️ Expiry must be in MM/YY format (e.g., 12/28).');
    return;
  }
  if (!cvc || !/^\d{3,4}$/.test(cvc)) {
    alert('⚠️ CVC must be 3 or 4 digits.');
    return;
  }
  if (!zip || zip.length < 5) {
    alert('⚠️ Please enter a valid ZIP/postal code.');
    return;
  }
  if (!name || !name.trim()) {
    alert('⚠️ Please enter the name on the card.');
    return;
  }
  if (!document.getElementById('terms')?.checked) {
    alert('⚠️ You must agree to the Terms and Privacy Policy.');
    return;
  }

  // ✅ Success
  const totalDisplay = document.getElementById('total-display');
  const amount = totalDisplay?.textContent || '₦0.00';
  alert(`✅ Payment of ${amount} processed!\n\nThank you for supporting your wellness journey with TrueVitality.`);
  
  // Optional: clear cart & redirect
  // localStorage.removeItem('cart');
  // window.location.href = '/second-login/public/order-confirmation.html';
});

// ✅ 7. INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
  renderOrderSummary();
  
  // Optional: refresh if cart changed in another tab
  window.addEventListener('storage', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderOrderSummary();
  });
});
  
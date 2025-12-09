// let totall = document.getElementById("all-result");
// result = 0;



// function addnum() {
//     result += 1
//     totall.textContent = result
// }


// function substract() {
//     if (result > 0) {
//         result -= 1
//     }
//     totall.textContent = result;
// }





// let totall2 = document.getElementById("all2");
// result2 = 0;



// function addnum2() {
//     result2 += 1
//     totall2.textContent = result2
// }


// function substract2() {
//     if (result2 > 0) {
//         result2 -= 1
//     }
//     totall2.textContent = result2;
// }


// let totall3 = document.getElementById("all3");
// result3 = 0;



// function addnum3() {
//     result3 += 1
//     totall3.textContent = result3
// }


// function substract3() {
//     if (result3 > 0) {
//         result3 -= 1
//     }
//     totall3.textContent = result3;
// }



// let totall4 = document.getElementById("all4");
// result4 = 0;



// function addnum4() {
//     result4 += 1
//     totall4.textContent = result4
// }


// function substract4() {
//     if (result4 > 0) {
//         result4 -= 1
//     }
//     totall4.textContent = result4;
// }




// let totall5 = document.getElementById("all-5");
// result5 = 0;



// function addnum5() {
//     result5 += 1
//     totall5.textContent = result5
// }


// function substract5() {
//     if (result5 > 0) {
//         result5 -= 1
//     }
//     totall5.textContent = result5;
// }






// Simple cart counter — counts total number of items added (by quantity)
// Get cart from localStorage or initialize empty
// let cart = JSON.parse(localStorage.getItem('cart')) || [];

// function updateAmount(element) {
//   const snippet = element.closest('.snippet');
//   if (!snippet) return;

//   const qtyLabel = snippet.querySelector('.all');
//   const amountLabel = snippet.querySelector('.amount'); // ← this shows "$X.XX"
  
//   let qty = parseInt(qtyLabel.textContent);
//   const price = parseFloat(snippet.getAttribute('data-price'));

//   if (element.classList.contains('plus')) {
//     qty++;
//   } else if (element.classList.contains('minus') && qty > 1) {
//     qty--;
//   }

//   // ✅ Update quantity
//   qtyLabel.textContent = qty;

//   // ✅ Update displayed line total: qty × unit price
//   const lineTotal = qty * price;
//   amountLabel.textContent = '$' + lineTotal.toFixed(2); // e.g., "$32.97"
// }

// function addToCart(button) {
//   const productCard = button.closest('.product-item-2');
//   if (!productCard) {
//     alert('⚠️ Product not found');
//     return;
//   }

//   const name = productCard.querySelector('h4')?.textContent?.trim() || 'Unknown Product';
//   const snippet = productCard.querySelector('.snippet');
//   const price = parseFloat(snippet.getAttribute('data-price'));
//   const qty = parseInt(productCard.querySelector('.all').textContent) || 1;

//   // ✅ Use *current* unit price — not line total
//   // (Because .amount may show "$32.97", but unit price is still $10.99)
//   cart.push({ name, price, qty });

//   localStorage.setItem('cart', JSON.stringify(cart));

//   const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
//   document.querySelector('.cart-count').textContent = totalCount;

//   // Optional: reset qty to 1 after adding
//   productCard.querySelector('.all').textContent = '1';
//   // Also reset line total to unit price
//   productCard.querySelector('.amount').textContent = '$' + price.toFixed(2);

//   alert(`✅ Added ${qty} × "${name}" to cart`);
// }










// =============== CART SYSTEM ===============
// ✅ Works on ALL pages — product, home, about, etc.

// Get cart from localStorage (safe fallback)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart badge — runs on EVERY page
 function updateCartCount() {
  // Always recalculate from localStorage (most reliable)
  const savedCart = localStorage.getItem('cart');
  const currentCart = savedCart ? JSON.parse(savedCart) : [];
  const totalCount = currentCart.reduce((sum, item) => sum + (item.qty || 0), 0);
  
  // Update all cart-count elements (navbar, mobile, etc.)
  const countElements = document.querySelectorAll('.cart-count');
  countElements.forEach(el => {
    if (el) el.textContent = totalCount;
  });
}

// Run on every page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateCartCount);
} else {
  updateCartCount(); // page already loaded
}

// =============== PRODUCT PAGE FUNCTIONS (only needed there) ===============
// ⚠️ These will only work where .product-item-2 exists (e.g., product2.html)

function updateAmount(element) {
  const snippet = element.closest('.snippet');
  if (!snippet) return;

  const qtyLabel = snippet.querySelector('.all');
  const amountLabel = snippet.querySelector('.amount');
  
  let qty = parseInt(qtyLabel.textContent) || 1;
  const price = parseFloat(snippet.getAttribute('data-price')) || 0;

  if (element.classList.contains('plus')) {
    qty++;
  } else if (element.classList.contains('minus') && qty > 1) {
    qty--;
  }

  qtyLabel.textContent = qty;
  amountLabel.textContent = '₦' + (qty * price).toFixed(2);
}

function addToCart(button) {
  const productCard = button.closest('.product-item-2');
  if (!productCard) {
    console.error('⚠️ Product card not found');
    return;
  }

  const name = productCard.querySelector('h4')?.textContent?.trim() || 'Product';
  const snippet = productCard.querySelector('.snippet');
  const price = parseFloat(snippet.getAttribute('data-price')) || 0;
  const qty = parseInt(productCard.querySelector('.all')?.textContent) || 1;

  if (price <= 0) {
    alert('⚠️ Invalid price. Check data-price attribute.');
    return;
  }

  // Add to cart
  cart.push({ name, price, qty });
  localStorage.setItem('cart', JSON.stringify(cart));

  // ✅ Use shared updater — works everywhere
  updateCartCount();

  // Reset UI
  productCard.querySelector('.all').textContent = '1';
  productCard.querySelector('.amount').textContent = '$' + price.toFixed(2);

  alert(`✅ Added ${qty} × "${name}"`);
}
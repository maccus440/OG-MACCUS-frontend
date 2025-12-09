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




let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateAmount(element) {
  const snippet = element.closest('.snippet');
  if (!snippet) return;

  const qtyLabel = snippet.querySelector('.all');
  const amountLabel = snippet.querySelector('.amount'); // ← this shows "$X.XX"
  
  let qty = parseInt(qtyLabel.textContent);
  const price = parseFloat(snippet.getAttribute('data-price'));

  if (element.classList.contains('plus')) {
    qty++;
  } else if (element.classList.contains('minus') && qty > 1) {
    qty--;
  }

  // ✅ Update quantity
  qtyLabel.textContent = qty;

  // ✅ Update displayed line total: qty × unit price
  const lineTotal = qty * price;
  amountLabel.textContent = '$' + lineTotal.toFixed(2); // e.g., "$32.97"
}

function addToCart(button) {
  const productCard = button.closest('.product-item-2');
  if (!productCard) {
    alert('⚠️ Product not found');
    return;
  }

  const name = productCard.querySelector('h4')?.textContent?.trim() || 'Unknown Product';
  const snippet = productCard.querySelector('.snippet');
  const price = parseFloat(snippet.getAttribute('data-price'));
  const qty = parseInt(productCard.querySelector('.all').textContent) || 1;

  // ✅ Use *current* unit price — not line total
  // (Because .amount may show "$32.97", but unit price is still $10.99)
  cart.push({ name, price, qty });

  localStorage.setItem('cart', JSON.stringify(cart));

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelector('.cart-count').textContent = totalCount;

  // Optional: reset qty to 1 after adding
  productCard.querySelector('.all').textContent = '1';
  // Also reset line total to unit price
  productCard.querySelector('.amount').textContent = '$' + price.toFixed(2);

  alert(`✅ Added ${qty} × "${name}" to cart`);
}



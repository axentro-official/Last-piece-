let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!container) return;

  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" />
        <div>
          <h4>${item.name}</h4>
          <p>${item.color} - ${item.size}</p>
          <p>${item.price} EGP</p>
        </div>
        <div class="qty">
          <button onclick="changeQty(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
      </div>
    `;
  });

  totalEl.innerText = total + " EGP";
}

function changeQty(index, delta) {
  cart[index].qty += delta;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  renderCart();
}

renderCart();

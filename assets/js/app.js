const API_URL = "https://script.google.com/macros/s/AKfycbyuLyCqPmG1a2w7Vpgu2hGFFG44tlmW4N9AuNwa-YHRupXRPhxBF-_mEOhPgjpSBwM9/exec";

const IMAGE_BASE = "https://raw.githubusercontent.com/axentro-official/Last-piece/main/assets/images/";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    products = data.filter(p => p.active);

    renderProducts();
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

function renderProducts() {
  const container = document.getElementById("products-container");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(product => {
    const sizes = product.sizes || [];
    const colors = product.colors || [];

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img src="${IMAGE_BASE + product.id}_1.webp" alt="${product.name}">
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>

        <div class="price">
          ${
            product.discount_price
              ? `<span class="old">${product.price} EGP</span>
                 <span class="new">${product.discount_price} EGP</span>`
              : `<span class="new">${product.price} EGP</span>`
          }
        </div>

        <div class="colors">
          ${colors.map(c => `
            <span class="color-circle" style="background:${c}" data-color="${c}"></span>
          `).join("")}
        </div>

        <div class="sizes">
          ${["XS","S","M","L","XL","XXL"].map(size => `
            <span class="size ${sizes.includes(size) ? "active" : "disabled"}" data-size="${size}">
              ${size}
            </span>
          `).join("")}
        </div>

        <button class="add-to-cart">Add To Cart</button>
      </div>
    `;

    const selected = {
      color: null,
      size: null
    };

    // اختيار لون
    card.querySelectorAll(".color-circle").forEach(el => {
      el.addEventListener("click", () => {
        card.querySelectorAll(".color-circle").forEach(e => e.classList.remove("selected"));
        el.classList.add("selected");
        selected.color = el.dataset.color;
      });
    });

    // اختيار مقاس
    card.querySelectorAll(".size.active").forEach(el => {
      el.addEventListener("click", () => {
        card.querySelectorAll(".size").forEach(e => e.classList.remove("selected"));
        el.classList.add("selected");
        selected.size = el.dataset.size;
      });
    });

    // إضافة للسلة
    card.querySelector(".add-to-cart").addEventListener("click", () => {
      if (!selected.color || !selected.size) {
        alert("اختار المقاس واللون");
        return;
      }

      addToCart(product, selected);
    });

    container.appendChild(card);
  });
}

function addToCart(product, selected) {
  const item = {
    id: product.id,
    name: product.name,
    price: product.discount_price || product.price,
    image: IMAGE_BASE + product.id + "_1.webp",
    color: selected.color,
    size: selected.size,
    qty: 1
  };

  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartUI();
}

function updateCartUI() {
  const count = document.getElementById("cart-count");
  if (!count) return;

  count.innerText = cart.length;
}

fetchProducts();
updateCartUI();

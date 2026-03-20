const API = "https://script.google.com/macros/s/AKfycbyuLyCqPmG1a2w7Vpgu2hGFFG44tlmW4N9AuNwa-YHRupXRPhxBF-_mEOhPgjpSBwM9/exec";

let cart = [];

async function loadProducts() {
  const res = await fetch(API + "?type=products");
  const data = await res.json();

  const normal = data.filter(p => !p.discount_price);
  const offers = data.filter(p => p.discount_price);

  render(normal, "productsContainer");
  render(offers, "offersContainer");
}

function render(list, id) {
  const container = document.getElementById(id);
  container.innerHTML = "";

  list.forEach(p => {

    const img = `https://raw.githubusercontent.com/axentro-official/Last-piece-/main/assets/images/${p.id}-1.webp`;

    container.innerHTML += `
      <div class="card fade">
        <img src="${img}">
        <h4>${p.name}</h4>

        ${
          p.discount_price
          ? `<div><span class="old">${p.price}</span> <span class="price">${p.discount_price}</span></div>`
          : `<div class="price">${p.price}</div>`
        }

        <button onclick='addToCart(${JSON.stringify(p)})'>اضف للسلة</button>
      </div>
    `;
  });
}

/* CART */
function addToCart(p) {
  cart.push(p);
  document.getElementById("cartCount").innerText = cart.length;
}

function openCart() {
  document.getElementById("cartModal").style.display = "block";
  renderCart();
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

function renderCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  cart.forEach(p => {
    container.innerHTML += `<p>${p.name}</p>`;
  });
}

/* CHECKOUT */
function checkout() {
  localStorage.setItem("lastOrder", JSON.stringify(cart));
  window.location.href = "thanks.html";
}

/* HERO */
const heroImages = [
  "hero01.webp",
  "hero02.webp",
  "hero03.webp"
];

let current = 0;

function loadHero() {
  const slider = document.getElementById("heroSlider");

  heroImages.forEach((img, i) => {
    slider.innerHTML += `<img src="assets/images/${img}" class="${i===0?'active':''}">`;
  });

  setInterval(() => {
    const imgs = document.querySelectorAll(".slider img");
    imgs[current].classList.remove("active");

    current = (current+1)%imgs.length;

    imgs[current].classList.add("active");
  }, 3000);
}

/* INIT */
loadProducts();
loadHero();

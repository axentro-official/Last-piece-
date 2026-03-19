let heroImages = [];
let heroIndex = 0;

// load images
for (let i = 1; i <= 10; i++) {
  let path = `./assets/images/hero0${i}.webp`;

  let img = new Image();
  img.src = path;

  img.onload = () => {
    heroImages.push(path);
    createDots();
    showHero();
  };
}

function showHero() {
  if (heroImages.length === 0) return;

  document.getElementById("heroImage").src = heroImages[heroIndex];
  updateDots();
}

function nextHero() {
  heroIndex = (heroIndex + 1) % heroImages.length;
  showHero();
}

function prevHero() {
  heroIndex = (heroIndex - 1 + heroImages.length) % heroImages.length;
  showHero();
}

// dots
function createDots() {
  const container = document.getElementById("heroDots");
  container.innerHTML = "";

  heroImages.forEach((_, i) => {
    let dot = document.createElement("span");
    dot.onclick = () => {
      heroIndex = i;
      showHero();
    };
    container.appendChild(dot);
  });
}

function updateDots() {
  let dots = document.querySelectorAll(".hero-dots span");
  dots.forEach((d, i) => {
    d.classList.toggle("active", i === heroIndex);
  });
}

// auto slide
setInterval(nextHero, 6000);


// PRODUCTS (temp)
const products = [
  {
    name: "تيشيرت أوفر سايز",
    code: "LP-TS-001",
    price: 420,
    oldPrice: 480,
    image: "./assets/images/p1.webp",
    sizes: ["S","M","L"]
  },
  {
    name: "تيشيرت زيتوني",
    code: "LP-TS-002",
    price: 430,
    oldPrice: 490,
    image: "./assets/images/p2.webp",
    sizes: ["M","L"]
  }
];

const container = document.getElementById("products");

products.forEach(p => {
  container.innerHTML += `
    <div class="card">
      <img src="${p.image}" />
      <h4>${p.name}</h4>
      <small>${p.code}</small>

      <div>
        <span class="old">${p.oldPrice} ج</span>
        <span class="new">${p.price} ج</span>
      </div>

      <div class="sizes">
        ${p.sizes.map(s => `<span>${s}</span>`).join("")}
      </div>

      <button class="btn">أضف إلى السلة</button>
    </div>
  `;
});

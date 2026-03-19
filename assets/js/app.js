// HERO
let heroImages = [
  "./assets/images/hero01.webp",
  "./assets/images/hero02.webp"
];

let heroIndex = 0;

function showHero() {
  document.getElementById("heroImage").src = heroImages[heroIndex];
}

setInterval(() => {
  heroIndex = (heroIndex + 1) % heroImages.length;
  showHero();
}, 4000);

showHero();


// PRODUCTS
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

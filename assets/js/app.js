let heroImages = [
  "./assets/images/hero01.webp",
  "./assets/images/hero02.webp"
];

let heroIndex = 0;

function showHero() {
  document.getElementById("heroImage").src = heroImages[heroIndex];
}

function nextHero() {
  heroIndex = (heroIndex + 1) % heroImages.length;
  showHero();
}

function prevHero() {
  heroIndex = (heroIndex - 1 + heroImages.length) % heroImages.length;
  showHero();
}

setInterval(nextHero, 4000);
showHero();


const products = [
  {
    id: "ITM-001",
    name: "T-Shirt",
    price: 500,
    discountPrice: 350,
    images: [
      "./assets/images/p1.webp",
      "./assets/images/p2.webp"
    ]
  }
];

const container = document.getElementById("products");

products.forEach(p => {

  let priceHTML = p.discountPrice
    ? `<span class="price-old">${p.price}</span>
       <span class="price-new">${p.discountPrice}</span>`
    : `<span>${p.price}</span>`;

  container.innerHTML += `
    <div class="product">
      <img src="${p.images[0]}" />
      <h3>${p.name}</h3>
      <div>${priceHTML}</div>
      <button class="order-btn">Order</button>
    </div>
  `;
});

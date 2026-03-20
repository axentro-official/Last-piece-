const API = "https://script.google.com/macros/s/AKfycbyuLyCqPmG1a2w7Vpgu2hGFFG44tlmW4N9AuNwa-YHRupXRPhxBF-_mEOhPgjpSBwM9/exec";

let products = [];
let currentFilter = "all";

/* LOAD */
fetch(API)
.then(r=>r.json())
.then(data=>{
  products = data;
  renderProducts();
  initSlider();
});

/* PRODUCTS */
function renderProducts(){
  let html = "";

  products
  .filter(p=>{
    if(currentFilter==="sale") return p.discount_price;
    return true;
  })
  .forEach(p=>{

    html += `
      <div class="card">

        <img src="assets/images/${p.id}_1.webp">

        <h4>${p.name}</h4>

        ${p.discount_price
          ? `<p><del>${p.price}</del> ${p.discount_price}</p>`
          : `<p>${p.price}</p>`
        }

        <div class="colors">
          ${p.colors.map(c=>`<span class="color" style="background:${c}"></span>`).join("")}
        </div>

        <div class="sizes">
          ${["S","M","L","XL"].map(s=>`
            <span class="${p.sizes.includes(s)?'':'size-disabled'}">${s}</span>
          `).join("")}
        </div>

        <button class="btn" onclick="addToCart('${p.id}')">اضف للسلة</button>

      </div>
    `;
  });

  document.getElementById("products").innerHTML = html;
}

/* FILTER */
function filterProducts(type){
  currentFilter = type;
  renderProducts();
}

/* SLIDER */
function initSlider(){
  const container = document.getElementById("slider");
  const dots = document.getElementById("dots");

  let slides = "";
  let dotsHtml = "";

  for(let i=1;i<=7;i++){
    slides += `<img class="slide ${i===1?'active':''}" src="assets/images/hero0${i}.webp">`;
    dotsHtml += `<span class="dot ${i===1?'active':''}"></span>`;
  }

  container.innerHTML = slides;
  dots.innerHTML = dotsHtml;

  let current = 0;
  const allSlides = document.querySelectorAll(".slide");
  const allDots = document.querySelectorAll(".dot");

  setInterval(()=>{
    allSlides[current].classList.remove("active");
    allDots[current].classList.remove("active");

    current = (current+1)%allSlides.length;

    allSlides[current].classList.add("active");
    allDots[current].classList.add("active");

  },2000);
}

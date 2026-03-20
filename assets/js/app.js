const API = "https://script.google.com/macros/s/AKfycbyuLyCqPmG1a2w7Vpgu2hGFFG44tlmW4N9AuNwa-YHRupXRPhxBF-_mEOhPgjpSBwM9/exec";

let products=[],selected={},currentTab="products";

fetch(API).then(r=>r.json()).then(d=>{
  products=d;
  render();
  initHero();
});

function setTab(t){
  currentTab=t;
  document.getElementById("tabProducts").classList.toggle("active",t==="products");
  document.getElementById("tabOffers").classList.toggle("active",t==="offers");
  render();
}

function render(){
  const container=document.getElementById("products");
  container.innerHTML="";

  products.filter(p=> currentTab==="offers"?p.discount_price:!p.discount_price)
  .forEach(p=>{
    container.innerHTML+=`
    <div class="card">

      <img src="assets/images/${p.id}-1.webp">

      <h4>${p.name}</h4>

      ${p.discount_price
        ? `<p><del>${p.price}</del> ${p.discount_price}</p>`
        : `<p>${p.price}</p>`}

      <div class="colors">
        ${p.colors.map(c=>`
          <span class="color ${selected[p.id]?.color===c?'active':''}"
          style="background:${c}"
          onclick="selectColor('${p.id}','${c}')"></span>`).join("")}
      </div>

      <div class="sizes">
        ${["S","M","L","XL"].map(s=>`
          <span class="${p.sizes.includes(s)?'':'size-disabled'} 
          ${selected[p.id]?.size===s?'size-active':''}"
          onclick="selectSize('${p.id}','${s}')">${s}</span>`).join("")}
      </div>

      <div class="qty">
        <button onclick="qty('${p.id}',-1)">-</button>
        ${selected[p.id]?.qty||1}
        <button onclick="qty('${p.id}',1)">+</button>
      </div>

      <button class="btn primary" onclick="addToCart('${p.id}')">أضف</button>

    </div>`;
  });
}

/* selection */
function selectColor(id,c){selected[id]=selected[id]||{};selected[id].color=c;render()}
function selectSize(id,s){selected[id]=selected[id]||{};selected[id].size=s;render()}
function qty(id,d){
  selected[id]=selected[id]||{qty:1};
  selected[id].qty=Math.max(1,(selected[id].qty||1)+d);
  render();
}

/* HERO */
function initHero(){
  let html="",dots="";
  for(let i=1;i<=7;i++){
    html+=`<img class="${i==1?'active':''}" src="assets/images/hero0${i}.webp">`;
    dots+=`<span class="dot ${i==1?'active':''}"></span>`;
  }
  heroSlider.innerHTML=html;
  heroDots.innerHTML=dots;

  let i=0,imgs=document.querySelectorAll(".slider img"),d=document.querySelectorAll(".dot");
  setInterval(()=>{
    imgs[i].classList.remove("active");d[i].classList.remove("active");
    i=(i+1)%imgs.length;
    imgs[i].classList.add("active");d[i].classList.add("active");
  },2000);
}

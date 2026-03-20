const API = "https://script.google.com/macros/s/AKfycbyuLyCqPmG1a2w7Vpgu2hGFFG44tlmW4N9AuNwa-YHRupXRPhxBF-_mEOhPgjpSBwM9/exec";

let cart = [];

async function loadProducts() {
  const res = await fetch(API + "?type=products");
  const data = await res.json();

  render(data.filter(p=>!p.discount_price),"productsContainer");
  render(data.filter(p=>p.discount_price),"offersContainer");
}

function render(list,id){
  const container=document.getElementById(id);
  container.innerHTML="";

  list.forEach(p=>{
    const img=`https://raw.githubusercontent.com/axentro-official/Last-piece-/main/assets/images/${p.id}-1.webp`;

    container.innerHTML+=`
    <div class="card">
      <img src="${img}">
      <div style="padding:10px">
        <h4>${p.name}</h4>

        ${
          p.discount_price
          ? `<span class="old">${p.price}</span> <span class="price">${p.discount_price}</span>`
          : `<span class="price">${p.price}</span>`
        }

        <button onclick='addToCart(${JSON.stringify(p)})'>اضف للسلة</button>
      </div>
    </div>`;
  });
}

/* CART */
function addToCart(p){
  cart.push(p);
  document.getElementById("cartCount").innerText=cart.length;
}

function openCart(){
  document.getElementById("cartModal").style.display="block";
  renderCart();
}

function closeCart(){
  document.getElementById("cartModal").style.display="none";
}

function renderCart(){
  const c=document.getElementById("cartItems");
  c.innerHTML="";

  cart.forEach(p=>{
    c.innerHTML+=`<p>${p.name}</p>`;
  });

  c.innerHTML+=`
  <input placeholder="الاسم" id="name">
  <input placeholder="الموبايل" id="phone">
  <input placeholder="العنوان" id="address">
  `;
}

/* CHECKOUT */
async function checkout(){

  const order={
    name:document.getElementById("name").value,
    phone:document.getElementById("phone").value,
    address:document.getElementById("address").value,
    items:cart
  };

  await fetch(API,{
    method:"POST",
    body:JSON.stringify(order)
  });

  localStorage.setItem("lastOrder",JSON.stringify(cart));

  window.location="thanks.html";
}

/* HERO */
const hero=["hero01.webp","hero02.webp","hero03.webp"];

let i=0;

function loadHero(){
  const s=document.getElementById("heroSlider");

  hero.forEach((h,index)=>{
    s.innerHTML+=`<img src="assets/images/${h}" class="${index==0?'active':''}">`;
  });

  setInterval(()=>{
    const imgs=document.querySelectorAll(".slider img");
    imgs[i].classList.remove("active");
    i=(i+1)%imgs.length;
    imgs[i].classList.add("active");
  },4000);
}

/* INIT */
loadProducts();
loadHero();

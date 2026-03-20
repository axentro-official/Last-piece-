const API_URL = "https://script.google.com/macros/s/AKfycbxdlkIFb_G3t80dP184DH2joRVQ6XTkyJuL7QxZj3QLSHeBPwL-TJLzJy0qplraTWCwIA/exec";

let cart = [];
let selected = {};
let productsData = [];

// ================= LOAD PRODUCTS =================
fetch(API_URL + "?action=products")
.then(res => res.json())
.then(products => {

  productsData = products;

  const container = document.getElementById("products");
  const offers = document.getElementById("offers");

  container.innerHTML = "";
  offers.innerHTML = "";

  products.forEach(p => {

    let images = [];
    for(let i=1;i<=p.image_count;i++){
      images.push(`./assets/images/${p.id}-${i}.webp`);
    }

    let priceHTML = p.has_discount
      ? `<span class="old">${p.price}</span> <span class="new">${p.discount_price}</span>`
      : `<span class="new">${p.price}</span>`;

    let card = `
    <div class="card">

      <div class="img-box">
        <button onclick="prevImg('${p.id}')">‹</button>
        <img id="img-${p.id}" src="${images[0]}"/>
        <button onclick="nextImg('${p.id}')">›</button>
      </div>

      <h4>${p.name}</h4>
      <small>${p.id}</small>

      <div>${priceHTML}</div>

      <div class="sizes">
        ${p.sizes.map(s=>`<span onclick="pickSize('${p.id}',this,'${s}')">${s}</span>`).join("")}
      </div>

      <div class="colors">
        ${p.colors.map(c=>`<span onclick="pickColor('${p.id}',this,'${c}')" style="background:${c}"></span>`).join("")}
      </div>

      <input type="number" value="1" min="1" id="q-${p.id}"/>

      <button onclick="addToCart('${p.id}')" class="btn">أضف للسلة</button>

    </div>`;

    container.innerHTML += card;

    if(p.has_discount) offers.innerHTML += card;
  });
});


// ================= IMAGE SLIDER =================
let imgIndex = {};

function nextImg(id){
  let p = productsData.find(x=>x.id===id);

  imgIndex[id] = (imgIndex[id] || 0) + 1;
  if(imgIndex[id] >= p.image_count) imgIndex[id] = 0;

  document.getElementById("img-"+id).src =
    `./assets/images/${id}-${imgIndex[id]+1}.webp`;
}

function prevImg(id){
  let p = productsData.find(x=>x.id===id);

  imgIndex[id] = (imgIndex[id] || 0) - 1;
  if(imgIndex[id] < 0) imgIndex[id] = p.image_count-1;

  document.getElementById("img-"+id).src =
    `./assets/images/${id}-${imgIndex[id]+1}.webp`;
}


// ================= SELECT =================
function pickSize(id,el,val){
  selected[id] = selected[id] || {};
  selected[id].size = val;

  el.parentElement.querySelectorAll("span").forEach(s=>s.classList.remove("selected"));
  el.classList.add("selected");
}

function pickColor(id,el,val){
  selected[id] = selected[id] || {};
  selected[id].color = val;

  el.parentElement.querySelectorAll("span").forEach(s=>s.classList.remove("selected"));
  el.classList.add("selected");
}


// ================= CART =================
function addToCart(id){

  let p = productsData.find(x=>x.id===id);

  let size = selected[id]?.size;
  let color = selected[id]?.color;

  if(!size || !color){
    alert("اختار المقاس واللون");
    return;
  }

  let qty = document.getElementById("q-"+id).value;

  cart.push({
    ...p,
    size,
    color,
    qty
  });

  document.getElementById("cartCount").innerText = cart.length;
}


// ================= CART VIEW =================
function openCart(){

  let c = document.getElementById("cartItems");
  c.innerHTML = "";

  let total = 0;

  cart.forEach((i,idx)=>{
    let price = i.discount_price || i.price;
    total += price * i.qty;

    c.innerHTML += `
      <div>
        ${i.name} (${i.size}) x${i.qty}
        <button onclick="removeItem(${idx})">❌</button>
      </div>`;
  });

  document.getElementById("total").innerText = "الإجمالي: " + total;

  document.getElementById("cartModal").style.display="block";
}

function removeItem(i){
  cart.splice(i,1);
  openCart();
}

function closeCart(){
  document.getElementById("cartModal").style.display="none";
}


// ================= CHECKOUT =================
function goCheckout(){
  closeCart();
  document.getElementById("checkoutModal").style.display="block";
}

function closeCheckout(){
  document.getElementById("checkoutModal").style.display="none";
}


// ================= ORDER =================
function submitOrder(){

  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let address = document.getElementById("address").value;

  if(!name || !phone || !address){
    alert("اكمل البيانات");
    return;
  }

  cart.forEach(item=>{
    fetch(API_URL,{
      method:"POST",
      body:JSON.stringify({
        product_id:item.id,
        product_name:item.name,
        size:item.size,
        color:item.color,
        price:item.discount_price || item.price,
        customer_name:name,
        phone:phone,
        address:address,
        notes:document.getElementById("notes").value
      })
    });
  });

  // WhatsApp
  window.open(`https://wa.me/201000000000?text=طلب جديد من ${name}`);

  cart=[];
  location.reload();
}

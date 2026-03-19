const API_URL = "PUT_YOUR_SCRIPT_URL";

let cart = [];
let selected = {};

// ================= PRODUCTS =================
fetch(API_URL + "?action=products")
.then(r=>r.json())
.then(products=>{
  const c = document.getElementById("products");
  const offers = document.getElementById("offers");

  products.forEach(p=>{
    let images = [];
    for(let i=1;i<=p.image_count;i++){
      images.push(`./assets/images/${p.id}-${i}.webp`);
    }

    let html = `
    <div class="card">

      <img id="img-${p.id}" src="${images[0]}"/>

      <button onclick="nextImg('${p.id}',${JSON.stringify(images)})">›</button>

      <h4>${p.name}</h4>

      <div>
        ${p.sizes.map(s=>`<span onclick="pickSize('${p.id}',this,'${s}')">${s}</span>`).join("")}
      </div>

      <div>
        ${p.colors.map(c=>`<span onclick="pickColor('${p.id}',this,'${c}')" style="background:${c};width:15px;height:15px;display:inline-block"></span>`).join("")}
      </div>

      <input type="number" value="1" id="q-${p.id}" min="1"/>

      <button onclick='addToCart(${JSON.stringify(p)})' class="btn">أضف للسلة</button>

    </div>`;

    c.innerHTML += html;

    if(p.has_discount) offers.innerHTML += html;
  });
});

// ================= IMAGE SLIDER =================
function nextImg(id, imgs){
  let img = document.getElementById("img-"+id);
  let i = imgs.indexOf(img.src.split("/").pop());
  i = (i+1)%imgs.length;
  img.src = imgs[i];
}

// ================= SELECT =================
function pickSize(id,el,val){
  selected[id] = selected[id] || {};
  selected[id].size = val;
  el.classList.add("selected");
}

function pickColor(id,el,val){
  selected[id] = selected[id] || {};
  selected[id].color = val;
  el.classList.add("selected");
}

// ================= CART =================
function addToCart(p){

  let size = selected[p.id]?.size;
  let color = selected[p.id]?.color;

  if(!size || !color){
    alert("اختار المقاس واللون");
    return;
  }

  let qty = document.getElementById("q-"+p.id).value;

  cart.push({...p,size,color,qty});

  document.getElementById("cartCount").innerText = cart.length;
}

function openCart(){
  let c = document.getElementById("cartItems");
  c.innerHTML = "";

  let total = 0;

  cart.forEach((i,idx)=>{
    let price = i.discount_price || i.price;
    total += price*i.qty;

    c.innerHTML += `
      <div>
        ${i.name} (${i.size}) x${i.qty}
        <button onclick="removeItem(${idx})">❌</button>
      </div>`;
  });

  document.getElementById("total").innerText = "الإجمالي: "+total;
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

  cart.forEach(item=>{
    fetch(API_URL,{
      method:"POST",
      body:JSON.stringify({
        product_id:item.id,
        product_name:item.name,
        size:item.size,
        color:item.color,
        price:item.price,
        customer_name:name,
        phone:phone,
        address:document.getElementById("address").value,
        notes:document.getElementById("notes").value
      })
    });
  });

  // WhatsApp
  window.open(`https://wa.me/201000000000?text=طلب جديد من ${name}`);

  cart=[];
  location.reload();
}

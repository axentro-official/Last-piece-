const API_URL = "https://script.google.com/macros/s/AKfycbxdlkIFb_G3t80dP184DH2joRVQ6XTkyJuL7QxZj3QLSHeBPwL-TJLzJy0qplraTWCwIA/exec";

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let productsData = [];
let selected = {};
let imgIndex = {};

// ================= LOAD =================
fetch(API_URL + "?action=products")
.then(r => r.json())
.then(products => {
  productsData = products;
  renderProducts(products);
  updateCartCount();
});

// ================= RENDER =================
function renderProducts(products){

  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {

    imgIndex[p.id] = 0;

    let priceHTML = p.has_discount
      ? `<span class="old">${p.price}</span> <span class="new">${p.discount_price}</span>`
      : `<span class="new">${p.price}</span>`;

    container.innerHTML += `
      <div class="card">

        <div class="img-box">
          <button onclick="prevImg('${p.id}')">‹</button>
          <img id="img-${p.id}" src="./assets/images/${p.id}-1.webp" onerror="this.src='./assets/images/fallback.webp'">
          <button onclick="nextImg('${p.id}')">›</button>
        </div>

        <h4>${p.name}</h4>

        <div>${priceHTML}</div>

        <div class="sizes">
          ${p.sizes.map(s => `<span onclick="selectSize('${p.id}',this,'${s}')">${s}</span>`).join("")}
        </div>

        <div class="colors">
          ${p.colors.map(c => `<span onclick="selectColor('${p.id}',this,'${c}')" style="background:${c}"></span>`).join("")}
        </div>

        <input type="number" value="1" min="1" id="q-${p.id}"/>

        <button class="btn" onclick="addToCart('${p.id}')">أضف للسلة</button>

      </div>
    `;
  });
}

// ================= SLIDER =================
function nextImg(id){
  let p = productsData.find(x=>x.id===id);

  imgIndex[id]++;
  if(imgIndex[id] >= p.image_count) imgIndex[id] = 0;

  updateImg(id);
}

function prevImg(id){
  let p = productsData.find(x=>x.id===id);

  imgIndex[id]--;
  if(imgIndex[id] < 0) imgIndex[id] = p.image_count-1;

  updateImg(id);
}

function updateImg(id){
  document.getElementById("img-"+id).src =
    `./assets/images/${id}-${imgIndex[id]+1}.webp`;
}

// ================= SELECT =================
function selectSize(id,el,val){
  selected[id] = selected[id] || {};
  selected[id].size = val;

  el.parentElement.querySelectorAll("span").forEach(s=>s.classList.remove("selected"));
  el.classList.add("selected");
}

function selectColor(id,el,val){
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

  let qty = Number(document.getElementById("q-"+id).value);

  cart.push({
    id:p.id,
    name:p.name,
    price:p.discount_price || p.price,
    size,
    color,
    qty
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ================= CART VIEW =================
function updateCartCount(){
  document.getElementById("cartCount").innerText = cart.length;
}

function openCart(){

  let c = document.getElementById("cartItems");
  let total = 0;

  c.innerHTML = "";

  cart.forEach((i,idx)=>{
    total += i.price * i.qty;

    c.innerHTML += `
      <div class="cart-row">
        ${i.name} (${i.size}) x${i.qty}
        <button onclick="removeItem(${idx})">❌</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = "الإجمالي: " + total;

  document.getElementById("cartModal").style.display="flex";
}

function removeItem(i){
  cart.splice(i,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  openCart();
}

function closeCart(){
  document.getElementById("cartModal").style.display="none";
}

// ================= CHECKOUT =================
function goCheckout(){
  closeCart();
  document.getElementById("checkoutModal").style.display="flex";
}

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
        price:item.price,
        customer_name:name,
        phone:phone,
        address:address
      })
    });
  });

  window.open(`https://wa.me/201000000000?text=طلب جديد من ${name}`);

  cart = [];
  localStorage.removeItem("cart");

  alert("تم الطلب بنجاح");
  location.reload();
}

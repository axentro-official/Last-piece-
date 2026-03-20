const API_URL = "https://script.google.com/macros/s/AKfycbxdlkIFb_G3t80dP184DH2joRVQ6XTkyJuL7QxZj3QLSHeBPwL-TJLzJy0qplraTWCwIA/exec";

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let productsData = [];

// ================= LOAD PRODUCTS =================
fetch(API_URL + "?action=products")
.then(r=>r.json())
.then(products=>{
  productsData = products;
  renderProducts(products);
  updateCartCount();
});

// ================= RENDER =================
function renderProducts(products){
  const c = document.getElementById("products");
  c.innerHTML = "";

  products.forEach(p=>{
    c.innerHTML += `
    <div class="card">

      <img src="./assets/images/${p.id}-1.webp" onclick="goProduct('${p.id}')"/>

      <h4>${p.name}</h4>

      <button onclick="addToWishlist('${p.id}')">❤️</button>

      <button onclick="goProduct('${p.id}')">عرض</button>

    </div>`;
  });
}

// ================= FILTER =================
function filterCategory(cat){
  if(cat==="all") return renderProducts(productsData);
  renderProducts(productsData.filter(p=>p.category===cat));
}

// ================= CART =================
function addToCart(item){
  cart.push(item);
  localStorage.setItem("cart",JSON.stringify(cart));
  updateCartCount();
}

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
      <div>
        ${i.name} x${i.qty}
        <button onclick="removeItem(${idx})">❌</button>
      </div>`;
  });

  document.getElementById("total").innerText = total;
  document.getElementById("cartModal").style.display="block";
}

function removeItem(i){
  cart.splice(i,1);
  localStorage.setItem("cart",JSON.stringify(cart));
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

function submitOrder(){

  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let address = document.getElementById("address").value;

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

  window.open(`https://wa.me/201000000000?text=طلب من ${name}`);

  cart=[];
  localStorage.removeItem("cart");
  location.reload();
}

// ================= WISHLIST =================
function addToWishlist(id){
  if(!wishlist.includes(id)){
    wishlist.push(id);
    localStorage.setItem("wishlist",JSON.stringify(wishlist));
  }
}

// ================= NAV =================
function goProduct(id){
  window.location.href = "product.html?id="+id;
}

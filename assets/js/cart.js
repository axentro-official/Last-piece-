let cart = JSON.parse(localStorage.getItem("cart")) || [];

function toggleCart(){
  document.getElementById("cart").classList.toggle("active");
  renderCart();
}

function addToCart(id){
  const item = products.find(p=>p.id==id);
  cart.push({...item, qty:1});
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart(){
  let html = "<h3>السلة</h3>";

  cart.forEach((item,i)=>{
    html += `
      <div>
        <img src="assets/images/${item.id}_1.webp" width="50">
        <p>${item.name}</p>
        <button onclick="removeItem(${i})">حذف</button>
      </div>
    `;
  });

  html += `
    <button class="btn" onclick="goCheckout()">اتمام الطلب</button>
    <button class="btn" onclick="clearCart()">تفريغ</button>
  `;

  document.getElementById("cart").innerHTML = html;
}

function removeItem(i){
  cart.splice(i,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function clearCart(){
  cart=[];
  localStorage.removeItem("cart");
  renderCart();
}

function goCheckout(){
  window.location.href="checkout.html";
}

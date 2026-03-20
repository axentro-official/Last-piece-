let cart = JSON.parse(localStorage.getItem("cart"))||[];

function toggleCart(){
  document.getElementById("cartDrawer").classList.toggle("active");
  renderCart();
}

function addToCart(id){
  const p=products.find(x=>x.id==id);
  const s=selected[id];

  if(!s||!s.size||!s.color){
    alert("اختار المقاس واللون");
    return;
  }

  cart.push({...p,...s});
  localStorage.setItem("cart",JSON.stringify(cart));
  updateCount();
}

function updateCount(){
  document.getElementById("cartCount").innerText=cart.length;
}
updateCount();

function renderCart(){
  let html="",total=0;

  cart.forEach((i,idx)=>{
    total+=i.price*(i.qty||1);
    html+=`
      <div class="row">
        <span>${i.name}</span>
        <span>${i.qty}</span>
      </div>`;
  });

  document.getElementById("cartItems").innerHTML=html;
  document.getElementById("cartTotal").innerText="الإجمالي: "+total+" ج";
}

function clearCart(){
  cart=[];localStorage.removeItem("cart");renderCart();updateCount();
}

function goCheckout(){
  localStorage.setItem("cart",JSON.stringify(cart));
  window.location="checkout.html";
}

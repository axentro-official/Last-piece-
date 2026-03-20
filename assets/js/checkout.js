const API = "https://script.google.com/macros/s/AKfycbyuLyCqPmG1a2w7Vpgu2hGFFG44tlmW4N9AuNwa-YHRupXRPhxBF-_mEOhPgjpSBwM9/exec";

let cart = JSON.parse(localStorage.getItem("cart"))||[];

function render(){
  let html="";
  cart.forEach(p=>{
    html+=`<div class="row"><span>${p.name}</span><span>${p.qty}</span></div>`;
  });
  orderSummary.innerHTML=html;
}
render();

form.onsubmit=async(e)=>{
  e.preventDefault();

  const order={
    order_id:"ORD-"+Date.now(),
    customer_name:name.value,
    phone:phone.value,
    address:address.value,
    payment:payment.value,
    items:cart
  };

  await fetch(API,{method:"POST",body:JSON.stringify(order)});

  localStorage.setItem("lastOrder",JSON.stringify(order));
  localStorage.removeItem("cart");

  window.location="thanks.html";
};

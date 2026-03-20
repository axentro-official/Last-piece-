const API = "https://script.google.com/macros/s/AKfycbyuLyCqPmG1a2w7Vpgu2hGFFG44tlmW4N9AuNwa-YHRupXRPhxBF-_mEOhPgjpSBwM9/exec";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* عرض الطلب */
function renderSummary(){
  let html = "";

  cart.forEach(p=>{
    html += `
      <div style="margin:10px 0;">
        <b>${p.name}</b> × ${p.qty || 1}
      </div>
    `;
  });

  document.getElementById("summary").innerHTML = html;
}

renderSummary();

/* إنشاء الطلب */
function buildOrder(){
  return {
    order_id: "ORD-" + Date.now(),
    customer_name: name.value,
    phone: phone.value,
    address: address.value,
    payment: payment.value,

    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.discount_price || item.price,
      qty: item.qty || 1
    })),

    total: cart.reduce((sum, item)=>{
      return sum + ((item.discount_price || item.price) * (item.qty || 1));
    }, 0),

    date: new Date().toISOString()
  };
}

/* إرسال */
document.getElementById("form").addEventListener("submit", async (e)=>{
  e.preventDefault();

  if(cart.length === 0){
    alert("السلة فارغة");
    return;
  }

  const order = buildOrder();

  try{
    await fetch(API,{
      method:"POST",
      body: JSON.stringify(order)
    });

    localStorage.setItem("lastOrder", JSON.stringify(order));
    localStorage.removeItem("cart");

    window.location.href = "thanks.html";

  }catch(err){
    alert("خطأ في الطلب");
    console.error(err);
  }
});

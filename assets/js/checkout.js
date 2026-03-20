const API = "https://script.google.com/macros/s/AKfycbyuLyCqPmG1a2w7Vpgu2hGFFG44tlmW4N9AuNwa-YHRupXRPhxBF-_mEOhPgjpSBwM9/exec";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ================== VALIDATION ================== */
function validate(){
  if(!name.value || !phone.value || !address.value){
    alert("من فضلك أكمل البيانات");
    return false;
  }

  if(phone.value.length < 10){
    alert("رقم الموبايل غير صحيح");
    return false;
  }

  if(cart.length === 0){
    alert("السلة فارغة");
    return false;
  }

  return true;
}

/* ================== BUILD ORDER ================== */
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

/* ================== SUBMIT ================== */
document.getElementById("form").addEventListener("submit", async (e)=>{
  e.preventDefault();

  if(!validate()) return;

  const order = buildOrder();

  try{
    const res = await fetch(API,{
      method:"POST",
      body: JSON.stringify(order)
    });

    const result = await res.text();

    /* حفظ للـ Thanks */
    localStorage.setItem("lastOrder", JSON.stringify(order));

    /* تفريغ السلة */
    localStorage.removeItem("cart");

    /* تحويل */
    window.location.href = "thanks.html";

  }catch(err){
    alert("حصل خطأ، حاول تاني");
    console.error(err);
  }
});

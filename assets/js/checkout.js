const API_URL = "https://script.google.com/macros/s/AKfycbyuLyCqPmG1a2w7Vpgu2hGFFG44tlmW4N9AuNwa-YHRupXRPhxBF-_mEOhPgjpSBwM9/exec";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function submitOrder() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  if (!name || !phone || !address) {
    alert("كمل البيانات");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      customer_name: name,
      phone,
      address,
      items: cart
    })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.removeItem("cart");
    window.location.href = "thanks.html";
  });
}

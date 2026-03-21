const API = "https://script.google.com/macros/s/AKfycbyuLyCqPmG1a2w7Vpgu2hGFFG44tlmW4N9AuNwa-YHRupXRPhxBF-_mEOhPgjpSBwM9/exec";

if (document.getElementById("products")) {
  fetch(API + "?type=products")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("products");

      data.forEach(p => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
          <img src="${p.image}" onerror="this.src='https://via.placeholder.com/300'">
          <h3>${p.name}</h3>
          <p>${p.price} ج</p>
          <button onclick="order('${p.id}','${p.name}',${p.price},'${p.sizes}','${p.colors}')">
            اطلب الآن
          </button>
        `;

        container.appendChild(div);
      });
    });
}

function order(id, name, price, sizes, colors) {
  localStorage.setItem("product", JSON.stringify({
    id, name, price, sizes, colors
  }));

  window.location.href = "order.html";
}

if (document.getElementById("orderForm")) {
  const product = JSON.parse(localStorage.getItem("product"));

  document.getElementById("product_id").value = product.id;
  document.getElementById("product_name").value = product.name;
  document.getElementById("price").value = product.price;

  const sizeSelect = document.getElementById("size");
  product.sizes.forEach(s => {
    sizeSelect.innerHTML += `<option>${s}</option>`;
  });

  const colorSelect = document.getElementById("color");
  product.colors.forEach(c => {
    colorSelect.innerHTML += `<option>${c}</option>`;
  });

  document.getElementById("orderForm").addEventListener("submit", e => {
    e.preventDefault();

    const data = {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      size: document.getElementById("size").value,
      color: document.getElementById("color").value,
      qty: document.getElementById("qty").value,
      customer_name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      governorate: document.getElementById("governorate").value,
      area: document.getElementById("area").value,
      address: document.getElementById("address").value,
      notes: ""
    };

    fetch(API, {
      method: "POST",
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        window.location.href = "thanks.html?id=" + res.order_id;
      }
    });
  });
}

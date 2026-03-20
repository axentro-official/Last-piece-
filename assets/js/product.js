const API_URL = "https://script.google.com/macros/s/AKfycbxdlkIFb_G3t80dP184DH2joRVQ6XTkyJuL7QxZj3QLSHeBPwL-TJLzJy0qplraTWCwIA/exec";

let selectedSize=null;
let selectedColor=null;

const id = new URLSearchParams(location.search).get("id");

fetch(API_URL + "?action=products")
.then(r=>r.json())
.then(products=>{
  const p = products.find(x=>x.id===id);

  document.getElementById("productDetails").innerHTML = `
    <div class="card">

      <img src="./assets/images/${p.id}-1.webp"/>

      <h2>${p.name}</h2>

      <div>
        ${p.sizes.map(s=>`<span onclick="selectedSize='${s}'">${s}</span>`).join("")}
      </div>

      <div>
        ${p.colors.map(c=>`<span onclick="selectedColor='${c}'" style="background:${c};width:20px;height:20px;display:inline-block"></span>`).join("")}
      </div>

      <input id="qty" type="number" value="1"/>

      <button onclick="add()">أضف للسلة</button>

    </div>`;
});

function add(){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
    id:id,
    name:document.querySelector("h2").innerText,
    size:selectedSize,
    color:selectedColor,
    qty:document.getElementById("qty").value,
    price:100
  });

  localStorage.setItem("cart",JSON.stringify(cart));

  alert("تمت الإضافة");
}

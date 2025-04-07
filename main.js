const firebaseConfig = {
  databaseURL: "https://omarocoo-5c4a1-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const categories = {
  "photo": "dolab",
  "rham_photo": "rham",
  "zgag_photo": "zgag",
  "kalb_photo": "kalb"
};

let allProducts = [];

const fetchAllProducts = async () => {
  const all = [];

  for (let path in categories) {
    const prefix = categories[path];
    const snapshot = await db.ref(path).once("value");
    const data = snapshot.val();
    for (let id in data) {
      const item = data[id];
      all.push({
        image: item[`${prefix}_photo`] || "",
        title: item[`${prefix}_titel`] || "منتج بدون اسم",
        description: item[`${prefix}_waf`] || item[`agng_waf`] || item[`Kalb_wat`] || "",
        price: parseFloat(item[`${prefix}_price`] || 0),
        category: path
      });
    }
  }

  allProducts = all.sort(() => 0.5 - Math.random());
  renderProducts(allProducts);
};

const renderProducts = (list) => {
  const container = document.getElementById("productsGrid");
  container.innerHTML = "";
  list.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h2>${product.title}</h2>
      <p>${product.description}</p>
      <p><strong>${product.price} جنيه</strong></p>
    `;
    div.onclick = () => showPopup(product);
    container.appendChild(div);
  });
};

const filterProducts = (category) => {
  if (category === "all") {
    renderProducts(allProducts);
  } else {
    const filtered = allProducts.filter(p => p.category === category);
    renderProducts(filtered);
  }
};

let currentProduct = null;

const showPopup = (product) => {
  currentProduct = product;
  document.getElementById("popupImg").src = product.image;
  document.getElementById("popupTitle").innerText = product.title;
  document.getElementById("popupDesc").innerText = product.description;
  document.getElementById("popupPrice").innerText = product.price;
  document.getElementById("quantity").value = 1;
  updateTotal();
  document.getElementById("popup").classList.remove("hidden");
};

const updateTotal = () => {
  const qty = parseInt(document.getElementById("quantity").value);
  const total = qty * currentProduct.price;
  document.getElementById("totalPrice").innerText = total;

  const msg = `مرحبا، اريد طلب منتج: ${currentProduct.title} - الكمية: ${qty} - الإجمالي: ${total} جنيه`;

  const encodedMsg = encodeURIComponent(msg);
  document.getElementById("whatsappLink").href = `https://wa.me/201091117080?text=${encodedMsg}`;
  document.getElementById("telegramLink").href = `https://t.me/share/url?url=&text=${encodedMsg}`;
};

const closePopup = () => {
  document.getElementById("popup").classList.add("hidden");
};

fetchAllProducts();

const searchProducts = () => {
  const term = document.getElementById("searchInput").value.toLowerCase();
  const filtered = allProducts.filter(p => 
    p.title.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term)
  );
  renderProducts(filtered);
};
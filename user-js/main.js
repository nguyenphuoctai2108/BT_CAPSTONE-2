import { Products, CartItem } from "./models.js";
import { fetchProductsAPI } from "./api.js";

let globalProductsList = [];
let globalCartList = [];

const initApp = async () => {
  loadCartFromStorage();
  renderCart();

  const rawData = await fetchProductsAPI();

  globalProductsList = rawData.map(
    (item) =>
      new Products(
        item.id,
        item.name,
        item.price,
        item.screen,
        item.backCamera || item.blackCamera,
        item.frontCamera,
        item.img,
        item.desc,
        item.type,
      ),
  );

  renderProducts(globalProductsList);
};

const renderProducts = (productsArray) => {
  const gridContainer = document.getElementById("productAreaGrid");
  if (!gridContainer) return;
  gridContainer.innerHTML = "";

  if (productsArray.length === 0) {
    gridContainer.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400 italic">Không tìm thấy sản phẩm tương ứng!</div>`;
    return;
  }

  productsArray.forEach((prod) => {
    const cardDiv = document.createElement("div");
    cardDiv.className =
      "bg-white p-5 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative border border-gray-100 h-100";
    cardDiv.innerHTML = `
            <span class="bg-yellow-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded absolute top-4 left-4 uppercase">${prod.type}</span>
            <div class="w-full h-40 flex items-center justify-center my-4">
                <img src="${prod.img}" class="max-h-full object-contain" alt="${prod.name}" onerror="this.src='https://placehold.co/180x180?text=Phone'">
            </div>
            <div class="flex flex-col flex-grow">
                <h3 class="text-lg font-bold text-gray-900 mb-1">${prod.name}</h3>
                <p class="text-gray-500 text-xs leading-relaxed mb-3 h-9 overflow-hidden custom-ellipsis">${prod.desc}</p>
                <div class="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 mb-4 space-y-1 mt-auto">
                    <p><strong>Màn hình:</strong> ${prod.screen}</p>
                    <p><strong>Cam sau:</strong> ${prod.blackCamera}</p>
                    <p><strong>Cam trước:</strong> ${prod.frontCamera}</p>
                </div>
            </div>
            <div class="flex justify-between items-center mt-auto pt-2">
                <span class="text-xl font-extrabold text-red-500">$${prod.price.toLocaleString()}</span>
                <button class="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 px-4 rounded-md transition-all btn-buy" data-id="${prod.id}">
                    Thêm giỏ <i class="fas fa-plus ml-1"></i>
                </button>
            </div>
        `;
    gridContainer.appendChild(cardDiv);
  });

  gridContainer.querySelectorAll(".btn-buy").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      addToCart(id);
    });
  });
};

document.getElementById("brandFilter")?.addEventListener("change", (event) => {
  const selectedBrand = event.target.value;

  if (selectedBrand === "all") {
    renderProducts(globalProductsList);
  } else {
    // Lọc phần tử theo thuộc tính type
    const filteredList = globalProductsList.filter(
      (prod) => prod.type.toLowerCase() === selectedBrand.toLowerCase(),
    );
    renderProducts(filteredList); // Tái render giao diện UI với danh sách lọc mới
  }
});

const addToCart = (productId) => {
  const product = globalProductsList.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = globalCartList.find(
    (item) => item.product.id === productId,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const newItem = new CartItem(product, 1);
    globalCartList.push(newItem);
  }

  saveCartToStorage();
  renderCart();
};

const renderCart = () => {
  const cartTbody = document.getElementById("cartTableContainer");
  if (!cartTbody) return;
  cartTbody.innerHTML = "";

  let totalAmount = 0;
  let totalItemsCount = 0;

  if (globalCartList.length === 0) {
    cartTbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-gray-400 italic">Giỏ hàng trống! Hãy lựa chọn sản phẩm yêu thích.</td></tr>`;
    document.getElementById("txtTotalOrderPrice").innerText = "$0";
    document.getElementById("globalCartCount").innerText = "0";
    return;
  }

  globalCartList.forEach((item, index) => {
    const itemSubtotal = item.product.price * item.quantity;
    totalAmount += itemSubtotal;
    totalItemsCount += item.quantity;

    const tr = document.createElement("tr");
    tr.className =
      "border-b border-gray-100 hover:bg-gray-50/80 transition-colors";
    tr.innerHTML = `
            <td class="p-3 text-gray-500">${index + 1}</td>
            <td class="p-3 font-semibold text-gray-900">${item.product.name}</td>
            <td class="p-3"><img src="${item.product.img}" class="w-12 h-12 object-contain" onerror="this.src='https://placehold.co/50x50?text=Phone'"></td>
            <td class="p-3 text-gray-600">$${item.product.price.toLocaleString()}</td>
            <td class="p-3">
                <div class="flex items-center gap-1.5">
                    <button class="w-6 h-6 border border-gray-300 rounded flex items-center justify-center font-bold hover:bg-gray-100 text-gray-600 btn-decrease" data-id="${item.product.id}">-</button>
                    <span class="px-2 font-medium text-gray-800 min-w-[20px] text-center">${item.quantity}</span>
                    <button class="w-6 h-6 border border-gray-300 rounded flex items-center justify-center font-bold hover:bg-gray-100 text-gray-600 btn-increase" data-id="${item.product.id}">+</button>
                </div>
            </td>
            <td class="p-3 font-bold text-gray-900">$${itemSubtotal.toLocaleString()}</td>
            <td class="p-3 text-center">
                <button class="text-red-500 hover:text-red-700 p-1 btn-remove" data-id="${item.product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    cartTbody.appendChild(tr);
  });

  document.getElementById("txtTotalOrderPrice").innerText =
    `$${totalAmount.toLocaleString()}`;
  document.getElementById("globalCartCount").innerText = totalItemsCount;

  setupCartActions();
};

const setupCartActions = () => {
  const cartTbody = document.getElementById("cartTableContainer");

  cartTbody.querySelectorAll(".btn-increase").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const cartItem = globalCartList.find((item) => item.product.id === id);
      if (cartItem) cartItem.quantity += 1;
      saveCartToStorage();
      renderCart();
    });
  });

  cartTbody.querySelectorAll(".btn-decrease").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const cartItem = globalCartList.find((item) => item.product.id === id);
      if (cartItem) {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
          globalCartList = globalCartList.filter(
            (item) => item.product.id !== id,
          );
        }
      }
      saveCartToStorage();
      renderCart();
    });
  });

  cartTbody.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (confirm("Bạn có chắc muốn xóa sản phẩm này khỏi đơn hàng?")) {
        globalCartList = globalCartList.filter(
          (item) => item.product.id !== id,
        );
        saveCartToStorage();
        renderCart();
      }
    });
  });
};

document.getElementById("btnCheckoutSubmit")?.addEventListener("click", () => {
  if (globalCartList.length === 0) {
    alert("Giỏ hàng rỗng, không thể xử lý thanh toán đơn hàng!");
    return;
  }
  alert("Cảm ơn bạn! Đơn hàng đã được thanh toán thành công thành công.");

  globalCartList = [];

  saveCartToStorage();
  renderCart();

  document.getElementById("closeCartBtn")?.click();
});

const saveCartToStorage = () => {
  localStorage.setItem(
    "CAPSTONE_JS_CART_STORE",
    JSON.stringify(globalCartList),
  );
};

const loadCartFromStorage = () => {
  const dataString = localStorage.getItem("CAPSTONE_JS_CART_STORE");
  if (dataString) {
    try {
      globalCartList = JSON.parse(dataString);
    } catch (e) {
      globalCartList = [];
    }
  }
};

window.addEventListener("DOMContentLoaded", initApp);

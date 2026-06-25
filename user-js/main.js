// LIÊN KẾT ĐƯỜNG DẪN NỘI BỘ TRONG THƯ MỤC USER-JS
import { Products, CartItem } from "./models.js";
import { fetchProductsAPI } from "./api.js";

// BIẾN TOÀN CỤC HỆ THỐNG
let globalProductsList = []; // Mảng danh sách sản phẩm chuẩn lớp đối tượng Products
let globalCartList = []; // Câu 5: Mảng giỏ hàng biến global chứa các CartItem

/**
 * KHỞI CHẠY KHÔNG GIAN ỨNG DỤNG KHI TRANG SẴN SÀNG
 */
const initApp = async () => {
  // Câu 11: Tải lại giỏ hàng cũ được lưu ở LocalStorage từ trước
  loadCartFromStorage();
  renderCart();

  // Câu 3: Kích hoạt dịch vụ call API lấy data
  const rawData = await fetchProductsAPI();

  // Đồng bộ chuẩn hóa dữ liệu thông qua lớp Products
  globalProductsList = rawData.map(
    (item) =>
      new Products(
        item.id,
        item.name,
        item.price,
        item.screen,
        item.backCamera || item.blackCamera, // Đọc linh hoạt cả 2 cấu trúc tên trường
        item.frontCamera,
        item.img,
        item.desc,
        item.type,
      ),
  );

  // Hiển thị danh sách sản phẩm ra màn hình cho người dùng
  renderProducts(globalProductsList);
};

/**
 * CÂU 3: HIỂN THỊ DANH SÁCH SẢN PHẨM (DỰNG CÁC KHỐI DIV BẰNG TAILWIND)
 */
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

  // Bắt sự kiện Click nút Thêm giỏ hàng (Câu 5)
  gridContainer.querySelectorAll(".btn-buy").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      addToCart(id);
    });
  });
};

/**
 * CÂU 4: BỘ LỌC ĐIỀU HƯỚNG HIỂN THỊ THEO CHỦ ĐỀ SẢN PHẨM (ONCHANGE SELECT)
 */
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

/**
 * CÂU 5 & CÂU 7: THÊM SẢN PHẨM VÀO GIỎ HÀNG
 */
const addToCart = (productId) => {
  const product = globalProductsList.find((p) => p.id === productId);
  if (!product) return;

  // Kiểm tra xem sản phẩm đã có mặt trong giỏ hàng global chưa
  const existingItem = globalCartList.find(
    (item) => item.product.id === productId,
  );

  if (existingItem) {
    // Câu 7: Nếu đã có, chỉ tiến hành cộng dồn số lượng thêm 1 đơn vị
    existingItem.quantity += 1;
  } else {
    // Câu 7: Nếu chưa có, bao bọc đối tượng vào thực thể CartItem mới với số lượng mặc định bằng 1
    const newItem = new CartItem(product, 1);
    globalCartList.push(newItem);
  }

  // Câu 11: Lưu cập nhật trạng thái mới nhất vào LocalStorage
  saveCartToStorage();
  renderCart();
};

/**
 * CÂU 8 & CÂU 10: IN GIỎ HÀNG RA MÀN HÌNH & TÍNH TOÀN BỘ TỔNG TIỀN ĐƠN HÀNG
 */
const renderCart = () => {
  const cartTbody = document.getElementById("cartTableContainer");
  if (!cartTbody) return;
  cartTbody.innerHTML = "";

  let totalAmount = 0; // Biến tích lũy tính tổng tiền hóa đơn (Câu 10)
  let totalItemsCount = 0; // Tính tổng số lượng hàng hóa hiển thị lên Badge Header

  if (globalCartList.length === 0) {
    cartTbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-gray-400 italic">Giỏ hàng trống! Hãy lựa chọn sản phẩm yêu thích.</td></tr>`;
    document.getElementById("txtTotalOrderPrice").innerText = "$0";
    document.getElementById("globalCartCount").innerText = "0";
    return;
  }

  // Câu 8: Duyệt mảng sinh cấu trúc dòng thẻ tr tương ứng
  globalCartList.forEach((item, index) => {
    // Câu 10: Tính thành tiền chi tiết của dòng hàng đó (Đơn giá * Số lượng)
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

  // Cập nhật các thông số tổng hợp lên giao diện người dùng
  document.getElementById("txtTotalOrderPrice").innerText =
    `$${totalAmount.toLocaleString()}`;
  document.getElementById("globalCartCount").innerText = totalItemsCount;

  // Kích hoạt lắng nghe các nút thao tác tăng/giảm/xóa trong giỏ hàng
  setupCartActions();
};

/**
 * CÂU 9 & CÂU 13: XỬ LÝ SỰ KIỆN TĂNG GIẢM SỐ LƯỢNG VÀ REMOVE
 */
const setupCartActions = () => {
  const cartTbody = document.getElementById("cartTableContainer");

  // Câu 9: Nút tăng số lượng (+)
  cartTbody.querySelectorAll(".btn-increase").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const cartItem = globalCartList.find((item) => item.product.id === id);
      if (cartItem) cartItem.quantity += 1;
      saveCartToStorage();
      renderCart();
    });
  });

  // Câu 9: Nút giảm số lượng (-)
  cartTbody.querySelectorAll(".btn-decrease").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const cartItem = globalCartList.find((item) => item.product.id === id);
      if (cartItem) {
        cartItem.quantity -= 1;
        // Nếu giảm chạm mức 0, tự động loại bỏ sản phẩm ra khỏi mảng
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

  // Câu 13: Gỡ bỏ sản phẩm ra khỏi giỏ hàng hẳn
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

/**
 * CÂU 12: NHẤN NÚT THANH TOÁN (CLEAR GIỎ HÀNG)
 */
document.getElementById("btnCheckoutSubmit")?.addEventListener("click", () => {
  if (globalCartList.length === 0) {
    alert("Giỏ hàng rỗng, không thể xử lý thanh toán đơn hàng!");
    return;
  }
  alert("Cảm ơn bạn! Đơn hàng đã được thanh toán thành công thành công.");

  // Set mảng giỏ hàng về trạng thái rỗng []
  globalCartList = [];

  saveCartToStorage();
  renderCart();

  // Tự động đóng nhanh modal popup
  document.getElementById("closeCartBtn")?.click();
});

/**
 * CÂU 11: ĐỒNG BỘ LOCALSTORAGE
 */
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

// Đảm bảo DOM sẵn sàng rồi mới kích hoạt ứng dụng
window.addEventListener("DOMContentLoaded", initApp);

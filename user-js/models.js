// Câu 2: Khởi tạo lớp đối tượng Products theo thuộc tính yêu cầu
export class Products {
  constructor(
    id,
    name,
    price,
    screen,
    blackCamera,
    frontCamera,
    img,
    desc,
    type,
  ) {
    this.id = id;
    this.name = name;
    this.price = Number(price);
    this.screen = screen;
    this.blackCamera = blackCamera; // Thuộc tính camera sau
    this.frontCamera = frontCamera;
    this.img = img;
    this.desc = desc;
    this.type = type; // Loại sản phẩm ('iphone' hoặc 'samsung')
  }
}

// Câu 6: Đối tượng CartItem đóng gói sản phẩm kèm số lượng riêng biệt trong giỏ
export class CartItem {
  constructor(productObj, quantity = 1) {
    this.product = productObj; // Nhận một thực thể được tạo từ lớp Products
    this.quantity = quantity;
  }
}

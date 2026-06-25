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
    this.blackCamera = blackCamera;
    this.frontCamera = frontCamera;
    this.img = img;
    this.desc = desc;
    this.type = type;
  }
}

export class CartItem {
  constructor(productObj, quantity = 1) {
    this.product = productObj;
    this.quantity = quantity;
  }
}

import { cartRepository } from "../repository/cart.repository.js";
import { productsRepository } from "../repository/products.repository.js";

export class CartServices {
  constructor(cartRepository, productsRepository) {
    this.cartRepository = cartRepository;
    this.productsRepository = productsRepository;
  }
  async create() {
    const emptyCart = [{}];
    const addedProduct = await this.cartRepository.create(emptyCart);
    return addedProduct;
  }
  async findOne(id) {
    const cart = await this.cartRepository.findOnePopulated({ _id: id });
    return cart;
  }
  async addToCart(cid, pid, quantity) {
    // check if productId exist
    await this.productsRepository.findOne({ _id: pid });
    // Check if cart exist and product
    let cart = await this.cartRepository.findOne({ _id: cid });
    // Check if product exist in cart
    const item = await cart.products.find((item) => item.product === pid);
    //add new product or update quantity
    if (!item) {
      cart = await this.cartRepository.updateOne(
        { _id: cid },
        { $push: { products: { product: pid, quantity: 1 } } }
      );
    } else {
      quantity ? quantity : (quantity = ++item.quantity);
      cart = await this.cartRepository.updateOne(
        { _id: cid, "products.product": pid },
        { $set: { "products.$.quantity": quantity } }
      );
      return cart;
    }
  }

  async removeItemsCart(cid, pid) {
    // Check if cart exist and product exist in cart
    let cart = await this.cartRepository.findOne({ _id: cid });
    // Check if product exist in cart
    await cart.products.find((item) => item.product === pid);
    // Delete product
    const deleted = await this.cartRepository
      .updateOne({ _id: cid }, { $pull: { products: { product: pid } } })
    return deleted;
  }

  async updateCart(cid, products) {
    // check if in products, productId exist
    for (const item of products) {
      await this.productsRepository.findOne({ _id: item.product });
      if (item.quantity < 0 || !item.quantity) {
        throw new Error(
          `For product with id ${item.product}, quantity: ${item.quantity} is not valid`
        );
      }
    }
    //update to new products
    const updatedCart = await this.cartRepository.updateOne(
      { _id: cid },
      { $set: { products: products } }
    );
    return updatedCart;
  }

  async clearCart(cid) {
    // Check if cart exist
    await this.cartRepository.findOne({ _id: cid });
    const deleted = await this.cartRepository.updateOne(
      { _id: cid },
      { $set: { products: [] } }
    );
    return deleted;
  }
}

export const cartServices = new CartServices(cartRepository,productsRepository);

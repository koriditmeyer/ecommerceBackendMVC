import { cartRepository } from "../repository/cart.repository.js";
import { productsRepository } from "../repository/products.repository.js";
import { ticketRepository } from "../repository/ticket.repository.js";
import { usersRepository } from "../repository/user.repository.js";
import {emailService} from "./email/email.service.js"
import { ticketServices } from "./ticket.services.js";

export class CartServices {
  constructor(
    cartRepository,
    productsRepository,
    ticketRepository,
    usersRepository
  ) {
    this.cartRepository = cartRepository;
    this.productsRepository = productsRepository;
    this.ticketRepository = ticketRepository;
    this.usersRepository = usersRepository;
  }

  
  async create() {
    const emptyCart = [{}];
    const addedProduct = await this.cartRepository.create(emptyCart);
    return addedProduct;
  }
  async findOne(cid) {
    const cart = await this.cartRepository.findOnePopulated({ _id: cid });
    return cart;
  }
  async addToCart(cid, pid, quantity) {
    // check if productId exist
    await this.productsRepository.findOne({ _id: pid });
    // Check if cart exist 
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
    const deleted = await this.cartRepository.updateOne(
      { _id: cid },
      { $pull: { products: { product: pid } } }
    );
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



  async purchaseItemsCart(cid) {
    let ticketData = [];
    let RemainingCartData = [];
    // Check if cart exist
    let cart = await this.cartRepository.findOne({ _id: cid });
    // Check if the cart is not empty
    if (!cart.products.length) {
      throw new Error(`Cart is empty`);
    }
    // For each product in cart
    for (const item of cart.products) {
      // Check the stock of products
      let product = await this.productsRepository.findOne({
        _id: item.product,
      });
      const productDTO = {
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      };
      //if product dont have enough stock then can not be added to the ticket
      if (item.quantity > product.stock) {
        // add products
        RemainingCartData.push(productDTO);
        continue; // Skip the rest of the loop body for this iteration
      }
      //if product has enough stock
      // add it to the ticket data
      ticketData.push(productDTO);
      // rest purchase quantity from stock
      const newQuantity = product.stock - item.quantity;
      await this.productsRepository.updateOne(
        {
          _id: item.product,
        },
        { $set: { stock: newQuantity } }
      );
      // delete it from cart
      await this.cartRepository.updateOne(
        { _id: cid },
        { $pull: { ["products"]: { product: item.product } } }
      );
      console.log(ticketData);
      console.log(RemainingCartData);
    }
    // fill ticket with Data
    const user = await this.usersRepository.findOne({
      cartId: cid,
    });
    const amount = ticketData.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const ticketDTO = {
      amount: amount,
      purchaser: user._id,
      products: ticketData,
    };
    console.log(ticketDTO);
    // create ticket
    const ticket = await this.ticketRepository.create(ticketDTO);
    //send email with ticket data
    await ticketServices.sendTicketEmail(ticket._id)
    return ticket;
  }
}

export const cartServices = new CartServices(
  cartRepository,
  productsRepository,
  ticketRepository,
  usersRepository
);

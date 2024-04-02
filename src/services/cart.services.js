import { cartRepository } from "../repository/cart.repository.js";
import { productsRepository } from "../repository/products.repository.js";
import { ticketRepository } from "../repository/ticket.repository.js";
import { usersRepository } from "../repository/user.repository.js";
import { logger } from "../utils/logger/index.js";
import { emailService } from "./email/email.service.js";
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
    logger.debug(`[services] create method with empty cart`);
    const emptyCart = [{}];
    const createdCart = await this.cartRepository.create(emptyCart);
    logger.info(`[services] create method return created cart: ${createdCart}`);
    return createdCart;
  }

  async findOne(cid) {
    logger.debug(`[services] findOne method  got: cid:${cid}`);
    const cart = await this.cartRepository.findOnePopulated({ _id: cid });
    logger.info(`[services] findOne method return cart: ${cart}`);
    return cart;
  }

  async addToCart(cid, pid, quantity) {
    logger.debug(
      `[services] addToCart method  got: cid:${cid}, pid:${pid}, quantity:${quantity}`
    );
    // check if productId exist
    await this.productsRepository.findOne({ _id: pid });
    // Check if cart exist
    let cart = await this.cartRepository.findOne({ _id: cid });
    // Check if product exist in cart
    const item = await cart.products.find((item) => item.product === pid);
    //add new product or update quantity
    if (!item) {
      logger.debug(
        `[services] addToCart - Item doesn't exist, adding new product`
      );
      cart = await this.cartRepository.updateOne(
        { _id: cid },
        {
          $push: {
            products: { product: pid, quantity: quantity ? quantity : 1 },
          },
        }
      );
    } else {
      logger.debug(`[services] addToCart - Item exist, updating quantity`);
      quantity ? quantity : (quantity = ++item.quantity);
      cart = await this.cartRepository.updateOne(
        { _id: cid, "products.product": pid },
        { $set: { "products.$.quantity": quantity } }
      );
    }
    logger.info(`[services] addToCart method return cart: ${cart}`);
    return cart;
  }

  async removeItemsCart(cid, pid) {
    logger.debug(
      `[services] removeItemsCart method  got: cid:${cid}, pid:${pid}`
    );
    // Check if cart exist and product exist in cart
    let cart = await this.cartRepository.findOne({ _id: cid });
    // Check if product exist in cart
    await cart.products.find((item) => item.product === pid);
    // Delete product
    const deleted = await this.cartRepository.updateOne(
      { _id: cid },
      { $pull: { products: { product: pid } } }
    );
    logger.info(`[services] removeItemsCart method return cart: ${deleted}`);
    return deleted;
  }

  async updateCart(cid, products) {
    logger.debug(
      `[services] updateCart method  got: cid:${cid}, products:${products}`
    );
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
    logger.info(
      `[services] updateCart method return updated cart: ${updatedCart}`
    );
    return updatedCart;
  }

  async clearCart(cid) {
    logger.debug(`[services] clearCart method  got: cid:${cid}`);
    // Check if cart exist
    await this.cartRepository.findOne({ _id: cid });
    const deleted = await this.cartRepository.updateOne(
      { _id: cid },
      { $set: { products: [] } }
    );
    logger.info(`[services] clearCart method return empty cart: ${deleted}`);
    return deleted;
  }

  async purchaseItemsCart(cid) {
    logger.debug(`[services] purchaseItemsCart method  got: cid:${cid}`);
    let RemainingCartData = [];
    // Check if cart exist
    let cart = await this.cartRepository.findOne({ _id: cid });
    // Check if the cart is not empty
    if (!cart.products.length) throw new Error(`Cart is empty`);
    // Check if there is a user related to the cart
    logger.debug(
      `[services] purchaseItemsCart - Find User related to the cart`
    );
    let user;
    try {
      user = await this.usersRepository.findOne({
        cartId: cid,
      });
    } catch (error) {
      throw Error(`No user found for this cart`);
    }
    // For each product in cart, Verify stock and accumulate ticket data
    let ticketData = [];
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
        logger.debug(
          `[services] purchaseItemsCart - product don't have enough stock`
        );
        // add products
        RemainingCartData.push(productDTO);
        continue; // Skip the rest of the loop body for this iteration
      }
      //if product has enough stock
      logger.debug(
        `[services] purchaseItemsCart - product have enough stock - adding it/them to the ticket`
      );
      // add it to the ticket data
      ticketData.push(productDTO);
    }
    // Calculate total amount for the ticket
    const amount = ticketData.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    // Create ticket
    const ticketDTO = {
      amount: amount,
      purchaser: user._id,
      products: ticketData,
    };
    logger.debug(
      `[services] purchaseItemsCart - creating ticket with data ${ticketDTO}`
    );
    const ticket = await this.ticketRepository.create(ticketDTO);
    logger.debug(`[services] purchaseItemsCart - ticket created ${ticket}`);

    // Now that the ticket is created, update the stock and clear the cart
    for (const { product, quantity } of ticketData) {
      // rest purchase quantity from stock
      logger.debug(`[services] purchaseItemsCart - updating product stock`);
      await this.productsRepository.updateOne(
        {
          _id: product,
        },
        { $inc: { stock: -quantity } }
      );
      // delete it from cart
      logger.debug(`[services] purchaseItemsCart - delete product from cart`);
      await this.cartRepository.updateOne(
        { _id: cid },
        { $pull: { ["products"]: { product: product } } }
      );
    }

    logger.debug(
      `[services] purchaseItemsCart - remaining products in cart ${RemainingCartData}`
    );
    logger.debug(
      `[services] purchaseItemsCart - products successfully purchased to be added to the ticket ${ticketData}`
    );
    //send email with ticket data
    logger.debug(`[services] purchaseItemsCart - send email with ticket info`);
    await ticketServices.sendTicketEmail(ticket._id);
    return ticket;
  }
}

export const cartServices = new CartServices(
  cartRepository,
  productsRepository,
  ticketRepository,
  usersRepository
);

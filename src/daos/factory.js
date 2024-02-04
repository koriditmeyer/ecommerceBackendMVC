// import { DAOMODE } from "../config/config.js";
// import { UserDao as UserMongooseDao } from "./mongoose/user.dao.js";
import { connectDb } from "../database/mongoDB.js";
import { PERSISTENCE } from "../config/config.js";
/*
 *
 *
 *
 */
export let userDaoFactory;
export let cartDaoFactory;
export let productDaoFactory;
export let purchaseDaoFactory;
export let ticketDaoFactory;
switch (PERSISTENCE) {
  case "MONGO":
    await connectDb(); //CONNECT TO MONGO DB before creating the app with express
    const { UserDaoMongoose } = await import("./mongoose/user.dao.js");
    const { CartDaoMongoose } = await import("./mongoose/cart.dao.js");
    const { ProductDaoMongoose } = await import("./mongoose/product.dao.js");
    // const { PurchaseDaoMongoose } = await import("./mongoose/purchase.dao.js");
    const { TicketDaoMongoose } = await import("./mongoose/ticket.dao.js");
    userDaoFactory = UserDaoMongoose;
    cartDaoFactory = CartDaoMongoose;
    productDaoFactory = ProductDaoMongoose;
    // purchaseDaoFactory = PurchaseDaoMongoose;
    ticketDaoFactory = TicketDaoMongoose;
    break;
  case "MEMORY":
    break;
}



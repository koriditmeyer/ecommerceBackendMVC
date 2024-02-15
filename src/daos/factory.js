// import { DAOMODE } from "../config/config.js";
// import { UserDao as UserMongooseDao } from "./mongoose/user.dao.js";
import { connectDb } from "../database/mongoDB.js";
import { PERSISTENCE } from "../config/config.js";
import { logger } from "../utils/logger/index.js";
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
    logger.info(
      `[Factory] - Initialise persistance: ${(PERSISTENCE)}`
    );
    await connectDb(); //CONNECT TO MONGO DB before creating the app with express
    const { UserDaoMongoose } = await import("./mongoose/user.dao.js");
    const { CartDaoMongoose } = await import("./mongoose/cart.dao.js");
    const { ProductDaoMongoose } = await import("./mongoose/product.dao.js");
    const { TicketDaoMongoose } = await import("./mongoose/ticket.dao.js");
    userDaoFactory = UserDaoMongoose;
    cartDaoFactory = CartDaoMongoose;
    productDaoFactory = ProductDaoMongoose;
    ticketDaoFactory = TicketDaoMongoose;
    break;
  case "MEMORY":
    break;
}



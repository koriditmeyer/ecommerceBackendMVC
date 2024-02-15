import mongoose from "mongoose";
import { mongooseDao } from "./mongoose.dao.js";
import { newId } from "../../utils/id.js";
import { logger } from "../../utils/logger/index.js";
import { objectToString } from "../../utils/objectToString.js";

const ticketSchema = new mongoose.Schema(
  {
    _id: { type: String, default: newId },
    code: { type: String, default: newId, unique: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true, ref: "Users" },
    products: [
      {
        product: { type: String, ref: "Product" },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
  },
  { versionKey: false, strict: "throw" }
);

const ticketModel = mongoose.model("Ticket", ticketSchema);

export class TicketDao extends mongooseDao {
  constructor() {
    super(ticketModel); // Pass the specific model
  }

  // Add any user-specific methods here, if needed
  async readManyPopulated(criteria, foreignModel) {
    logger.debug(
      `[DAO] - readManyPopulated method with data ${objectToString(criteria)}`
    );
    const result = await this.model
      .find(criteria)
      .populate(foreignModel)
      .select({ _id: 0 })
      .lean();

    // if (!result) throw new Error("NOT FOUND");
    logger.info(
      `[DAO] - readManyPopulated method with result ${objectToString(result)}`
    );
    return result;
  }
}

export const TicketDaoMongoose = new TicketDao();

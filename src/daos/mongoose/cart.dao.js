import mongoose from "mongoose";
import { mongooseDao } from "./mongoose.dao.js";
import { newId } from "../../utils/id.js";

const cartSchema = new mongoose.Schema(
  {
    _id: { type: String,  default: newId, required: true },
    products: [{
      product: { type: String, ref: "Product" }, 
      quantity: { type: Number }
    }],
  },
  { versionKey: false, strict: "throw" }
);
const cartModel = mongoose.model("Cart", cartSchema);

export const CartDaoMongoose = new mongooseDao(cartModel);
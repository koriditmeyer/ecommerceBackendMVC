import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { mongooseDao } from "./mongoose.dao.js";
import { newId } from "../../utils/id.js";

const productSchema = new mongoose.Schema(
  {
    _id: { type: String,  default: newId, required: true },
    title: { type: String, index: true, required: true },
    attribute: { type: String },
    description: { type: String, required: true },
    brand: { type: String },
    code: { type: String, required: true, unique: true },
    avgRating: { type: Number },
    ratings: { type: Number },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    status: { type: String, default: true, required: false }, // Set status to true by default
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    badge: { type: String },
    thumbnail: {
      type: [String],
      default: ["static/img/products/defaultProduct.jpeg"],
      required: false,
    }, // Set thumbnail as an array of strings, default to an empty array
  },
  { versionKey: false, strict: "throw" }
);
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model("Product", productSchema);

export const ProductDaoMongoose = new mongooseDao(productModel);

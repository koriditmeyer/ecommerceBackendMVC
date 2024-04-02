import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { mongooseDao } from "./mongoose.dao.js";
import { newId } from "../../utils/id.js";
import { objectToString } from "../../utils/objectToString.js";
import { logger } from "../../utils/logger/index.js";

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, default: newId, required: true },
    title: { type: String, index: true, required: true },
    attribute: { type: String },
    description: { type: Object, required: true },
    brand: { type: String },
    code: { type: String, required: true, unique: true },
    avgRating: { type: Number },
    ratings: { type: Number },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    status: { type: String, default: true, required: false }, // Set status to true by default
    stock: { type: Number, required: true },
    category: { type: Number, required: true },
    badge: { type: String },
    productURL: { type: String },
    boughtInLastMonth: { type: Number },
    thumbnail: {
      type: [String],
      default: ["static/img/defaults/thumbnailDefault.png"],
      required: false,
    }, // Set thumbnail as an array of strings, default to an empty array
  },
  { versionKey: false, strict: "throw" }
);
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model("Product", productSchema);

export class ProductDao extends mongooseDao {
  constructor() {
    super(productModel); // Pass the specific model
  }

  // Add any user-specific methods here, if needed
  async distinct(pipeline) {
    logger.debug(
      `[DAO] - distinct method with data ${objectToString(
        pipeline
      )}`
    );
    let result = await this.model.aggregate(pipeline);
    if (!result) throw new Error("NOT FOUND");
    logger.info(
      `[DAO] - distinct method with result ${objectToString(result)}`
    );
    return result;
  }
}

export const ProductDaoMongoose = new ProductDao();

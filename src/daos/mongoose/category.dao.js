import mongoose from "mongoose";
import { mongooseDao } from "./mongoose.dao.js";
import { newId } from "../../utils/id.js";

const categorySchema = new mongoose.Schema(
  {
    _id: { type: String, default: newId, required: true },
    name: { type: String, index: true },
    subcategories: [
      {
        id: { type: Number },
        name: { type: String },
      },
    ],
  },
  { versionKey: false, strict: "throw" }
);
const categoryModel = mongoose.model("Category", categorySchema);

export const CategoryDaoMongoose = new mongooseDao(categoryModel);

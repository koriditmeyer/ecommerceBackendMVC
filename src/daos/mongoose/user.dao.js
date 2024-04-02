import mongoose from "mongoose";
import { mongooseDao } from "./mongoose.dao.js";
import { newId } from "../../utils/id.js";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: newId },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    token: { type: String, required: false },
    verified: { type: Boolean, required: true, default: false },
    tokenExpiry: { type: Date, required: false },
    email: { type: String, required: true, unique: true },
    age: Number,
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city_locality: { type: String },
    postal_code: { type: String },
    country_code: { type: String },
    date: { type: Date, default: Date.now },
    roles: { type: Array, default: ["user"] },
    cartId: { type: String, ref: "Cart" },
    provider: { type: String, default: "local" },
    providerId: String,
    status:String,
    profilePhoto: {
      type: [String],
      default: ["img/defaults/profileDefault.webp"],
    },
    documents: [
      {
        name: { type: String },
        reference: { type: String },
      },
    ],
    last_connection: { type: Date },
  },
  { versionKey: false, strict: "throw" }
);

const userModel = mongoose.model("Users", userSchema);

export const UserDaoMongoose = new mongooseDao(userModel);

import mongoose from "mongoose";
import { mongooseDao } from "./mongoose.dao.js";
import { newId } from "../../utils/id.js";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: newId, required: true },
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: Number,
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city_locality: { type: String },
    postal_code: { type: String },
    country_code: { type: String },
    date: { type: Date, default: Date.now },
    role: { type: String, default: "user" },
    cartId: { type: String, ref: "Cart" },
    provider: { type: String, default: "local" },
    providerId: String,
    profilePhoto: String,
  },
  { versionKey: false, strict: "throw" }
);

const userModel = mongoose.model("Users", userSchema);

export const UserDaoMongoose = new mongooseDao(userModel);


// hash - PASSWORD
import { hashSync, compareSync, genSaltSync } from "bcrypt";
import {ROUNDS} from "../config/config.js";

export function hash(phrase) {
  if (!phrase) throw new Error("invalid data to hash");
  return hashSync(phrase, genSaltSync(ROUNDS));
}

export function compareHash({ received, stored }) {
  if (!received) throw new Error("invalid received data to compare");
  if (!stored) throw new Error("invalid stored data to compare");
  return compareSync(received, stored);
}

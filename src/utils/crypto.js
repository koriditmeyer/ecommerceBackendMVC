// jwt - TOKEN
import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from "../config/config.js";

export function encrypt(data) {
  return new Promise((resolve, reject) => {
    if (!data) {
      return reject(new Error("nothing to jwt encode!"));
    }
    jwt.sign(data, JWT_PRIVATE_KEY, { expiresIn: "24h" }, (err, encoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(encoded);
      }
    });
  });
}

export function decrypt(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error("no token to decode!"));
    }
    jwt.verify(token, JWT_PRIVATE_KEY, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

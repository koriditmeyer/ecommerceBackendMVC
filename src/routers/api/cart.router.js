import { Router } from "express";
import {
    createCart,
    getCart,
    addToCart,
    updateCart,
    removeItemsCart,
    clearCart,
} from "../../controllers/cart.controller.js";
import { allowedRoles } from "../../middlewares/authorization.js";
import { authenticate } from "../../controllers/sessions.controller.js";

export const cartRouter = Router();

cartRouter.post(
  "/",
  authenticate("jwt"),
  allowedRoles(["user", "admin"]),
  createCart
);
cartRouter.get(
  "/:cid",
  authenticate("jwt"),
  allowedRoles(["user", "admin"]),
  getCart
);
cartRouter.post(
  "/:cid/product/:pid",
  authenticate("jwt"),
  allowedRoles(["user", "admin"]),
  addToCart
);
cartRouter.put(
  "/:cid",
  authenticate("jwt"),
  allowedRoles(["user", "admin"]),
  updateCart
);
cartRouter.delete(
  "/:cid/product/:pid",
  authenticate("jwt"),
  allowedRoles(["user", "admin"]),
  removeItemsCart
);

cartRouter.delete(
  "/:cid",
  authenticate("jwt"),
  allowedRoles(["admin"]),
  clearCart
);

import { Router } from "express";
import {
    createCart,
    getCart,
    addToCart,
    updateCart,
    removeItemsCart,
    clearCart,
    purchaseItemsCart
} from "../../controllers/cart.controller.js";
import { allowedRoles } from "../../middlewares/authorization.js";
import { authenticate } from "../../controllers/sessions.controller.js";

export const cartRouter = Router();

cartRouter.post(
  "/",
  authenticate("jwt"),
  allowedRoles(["user"]),
  createCart
);
cartRouter.get(
  "/:cid",
  authenticate("jwt"),
  allowedRoles(["user"]),
  getCart
);
cartRouter.post(
  "/:cid/product/:pid",
  authenticate("jwt"),
  allowedRoles(["user","admin"]),
  addToCart
);
cartRouter.put(
  "/:cid",
  authenticate("jwt"),
  allowedRoles(["user"]),
  updateCart
);
cartRouter.delete(
  "/:cid/product/:pid",
  authenticate("jwt"),
  allowedRoles(["user","admin"]),
  removeItemsCart
);

cartRouter.delete(
  "/:cid",
  authenticate("jwt"),
  allowedRoles(["user","admin"]),
  clearCart
);

cartRouter.get(
  "/:cid/purchase",
  authenticate("jwt"),
  allowedRoles(["user","admin"]),
  purchaseItemsCart
);

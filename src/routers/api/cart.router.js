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
import { allowedRolesCookie,allowCartmodification, allowedRolesDB } from "../../middlewares/authorization.js";
import { authenticate } from "../../controllers/sessions.controller.js";

export const cartRouter = Router();

cartRouter.post(
  "/",
  authenticate("jwt"),
  allowedRolesCookie(["user"]),
  createCart
);
cartRouter.get(
  "/:cid",
  authenticate("jwt"),
  allowedRolesCookie(["user"]),
  getCart
);
cartRouter.post(
  "/:cid/product/:pid",
  authenticate("jwt"),
  allowedRolesCookie(["user","admin"]),
  allowCartmodification,
  addToCart
);
cartRouter.put(
  "/:cid",
  authenticate("jwt"),
  allowedRolesCookie(["user"]),
  updateCart
);
cartRouter.delete(
  "/:cid/product/:pid",
  authenticate("jwt"),
  allowedRolesCookie(["user","admin"]),
  removeItemsCart
);

cartRouter.delete(
  "/:cid",
  authenticate("jwt"),
  allowedRolesCookie(["user","admin"]),
  clearCart
);

cartRouter.get(
  "/:cid/purchase",
  authenticate("jwt"),
  allowedRolesDB(["user","admin"]),
  allowCartmodification,
  purchaseItemsCart
);

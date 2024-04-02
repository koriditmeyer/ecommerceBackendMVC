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
import tryCatch from "../../middlewares/trycatch.js"

export const cartRouter = Router();

cartRouter.post(
  "/",
  authenticate("jwt"),
  allowedRolesCookie(["user"]),
  tryCatch(createCart)
);
cartRouter.get(
  "/:cid",
  authenticate("jwt"),
  allowedRolesCookie(["user","admin"]),
  tryCatch(getCart)
);
cartRouter.post(
  "/:cid/product/:pid",
  authenticate("jwt"),
  allowedRolesCookie(["user","admin"]),
  allowCartmodification,
  tryCatch(addToCart)
);
cartRouter.put(
  "/:cid",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  tryCatch(updateCart)
);
cartRouter.delete(
  "/:cid/product/:pid",
  authenticate("jwt"),
  allowedRolesCookie(["user","admin"]),
  allowCartmodification,
  tryCatch(removeItemsCart)
);

cartRouter.delete(
  "/:cid",
  authenticate("jwt"),
  allowedRolesCookie(["user","admin"]),
  allowCartmodification,
  tryCatch(clearCart)
);

cartRouter.get(
  "/:cid/purchase",
  authenticate("jwt"),
  allowedRolesDB(["user","admin"]),
  allowCartmodification,
  tryCatch(purchaseItemsCart)
);

import { Router } from "express";
import {
  getProductQuery,
  getProduct,
  addProduct,
  modifyProduct,
  deleteProduct,
  addPictureImages,
} from "../../controllers/products.controller.js";
import { allowedRolesCookie } from "../../middlewares/authorization.js";
import { authenticate } from "../../controllers/sessions.controller.js";

export const productsRouter = Router();

productsRouter.get("/", getProductQuery);
productsRouter.get("/:pid", getProduct);
productsRouter.post(
  "/",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  addProduct
);
productsRouter.put(
  "/:id",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  modifyProduct
);
productsRouter.delete(
  "/:id",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  deleteProduct
);
productsRouter.put(
  "/:pid/thumbnailUrl",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  addPictureImages
);

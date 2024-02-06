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
import compression from 'express-compression'

export const productsRouter = Router();

// @ts-ignore
productsRouter.get("/",compression({ brotli: { enabled: true, zlib: {} } }), getProductQuery);
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

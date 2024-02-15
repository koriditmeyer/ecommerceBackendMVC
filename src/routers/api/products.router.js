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
import compression from "express-compression";
import tryCatch from "../../middlewares/trycatch.js";

export const productsRouter = Router();


productsRouter.get(
  "/",
  // @ts-ignore
  compression({ brotli: { enabled: true, zlib: {} } }),
  tryCatch(getProductQuery)
);
productsRouter.get("/:pid", tryCatch(getProduct));
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
  tryCatch(modifyProduct)
);
productsRouter.delete(
  "/:id",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  tryCatch(deleteProduct)
);
productsRouter.put(
  "/:pid/thumbnailUrl",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  addPictureImages
);

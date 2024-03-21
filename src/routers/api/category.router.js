import { Router } from "express";
import {
    getCategoryBySubcategoryId,
    getCategoriesId,
    getCategories
} from "../../controllers/category.controller.js";
import tryCatch from "../../middlewares/trycatch.js"

export const categoryRouter = Router();

categoryRouter.get(
    "/",
    tryCatch(getCategories)
  );
  categoryRouter.get(
    "/:id",
    tryCatch(getCategoriesId)
  );

categoryRouter.get(
  "/subcategory/:id",
  tryCatch(getCategoryBySubcategoryId)
);


import { categoryServices } from "../services/category.services.js";

export async function getCategoryBySubcategoryId(req, res, next) {
    const id = req.params.id;
    req.logger.debug("[Controller] got subcategory id to search: " + id);
    const category = await categoryServices.findCategoryBySubcategoryId(id);
    res["successfullGet"](category);
}

export async function getCategoriesId(req, res, next) {
    const id = req.params.id;
    req.logger.debug("[Controller] got category id to search: " + id);
    const category = await categoryServices.findOne(tid);
    res["successfullGet"](category);
}

export async function getCategories(req, res, next) {
    req.logger.debug("[Controller] got all category to search ");
    const category = await categoryServices.findMany();
    res["successfullGet"](category);
}

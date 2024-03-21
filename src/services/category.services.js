import { NotFoundError } from "../models/errors/notFound.error.js";
import { categoryRepository } from "../repository/category.repository.js";
import { logger } from "../utils/logger/index.js";

export class CategoryServices {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async findCategoryBySubcategoryId(subcategoryId) {
    logger.debug(`[services] findCategoryBySubcategoryId method got id:${subcategoryId}`);
    const category = await this.categoryRepository.findOne(
      { "subcategories.id": subcategoryId },
      "name subcategories.$"
    );
    if (!category) {
      throw new NotFoundError();
    }
    logger.info(`[services] findCategoryBySubcategoryId method return category: ${category}`);
    return category;
  }

  async findOne(id) {
    logger.debug(`[services] findOne method got: id:${id}`);
    let categories;
    try {
      categories = await this.categoryRepository.findOne({ _id: id });
    } catch (error) {
      throw new NotFoundError();
    }
    logger.info(`[services] findOne method return categories: ${categories}`);
    return categories;
  }

  async findMany() {
    logger.debug(`[services] findMany method`);
    let categories;
    try {
      categories = await this.categoryRepository.findMany();
    } catch (error) {
      throw new NotFoundError();
    }
    logger.info(`[services] findMany method return categories: ${categories}`);
    return categories;
  }
}
export const categoryServices = new CategoryServices(categoryRepository);

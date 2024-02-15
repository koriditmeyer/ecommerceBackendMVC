import { GenericRepository } from "./genericRepository.js";
import { cartDaoFactory } from "../daos/factory.js";
import { NotFoundError } from "../models/errors/notFound.error.js";
import { logger } from "../utils/logger/index.js";
import { objectToString } from "../utils/objectToString.js";

class CartRepository extends GenericRepository {
  constructor() {
    super(cartDaoFactory); // Pass the specific DAO for users
  }

  // Add any user-specific methods here, if needed
  async findOnePopulated(criteria) {
    logger.debug(
      `[Repository] - findOnePopulated method with criteria ${objectToString(criteria)}`
    );
    const result = await this.dao.readOnePopulated(criteria, "products.product");
    if (!result) throw new NotFoundError();
    logger.info(
      `[Repository] - findOnePopulated method with result ${objectToString(result)}`
    );
    return result
  }
}

export const cartRepository = new CartRepository();

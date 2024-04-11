import { productDaoFactory } from "../daos/factory.js";
import { NotFoundError } from "../models/errors/notFound.error.js";
import { logger } from "../utils/logger/index.js";
import { objectToString } from "../utils/objectToString.js";
import { GenericRepository } from "./genericRepository.js";

export class ProductsRepository extends GenericRepository {
  constructor() {
    super(productDaoFactory); // Pass the specific DAO for users
  }

  // Add any user-specific methods here, if needed
  async paginate(aggregateQuery, options) {
    logger.debug(
      `[Repository] - paginate method with criteria ${objectToString(aggregateQuery)}`
    );
    const result = await this.dao.paginate(aggregateQuery, options) ;
    if (!result) throw new NotFoundError();
    logger.info(
      `[Repository] - paginate method with result ${objectToString(result)}`
    );
    return result
  }

  async distinctSearch(pipeline){
    logger.debug(
      `[Repository] - distinct method with criteria ${objectToString(pipeline)}}`
    );
    const result = await this.dao.distinct(pipeline)
    //console.log(result)
    // if (!result) throw new NotFoundError();
    logger.info(
      `[Repository] - distinct method with result ${objectToString(result)}`
    );
    return result
  }
}

export const productsRepository = new ProductsRepository();

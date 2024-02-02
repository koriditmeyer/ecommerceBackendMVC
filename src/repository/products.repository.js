import { productDaoFactory } from "../daos/factory.js";
import { GenericRepository } from "./genericRepository.js";

export class ProductsRepository extends GenericRepository {
  constructor() {
    super(productDaoFactory); // Pass the specific DAO for users
  }

  // Add any user-specific methods here, if needed
  paginate(aggregateQuery, options) {
    return this.dao.paginate(aggregateQuery, options) ;
  }
}

export const productsRepository = new ProductsRepository();

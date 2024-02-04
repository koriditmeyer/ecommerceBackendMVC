import { GenericRepository } from "./genericRepository.js";
import { cartDaoFactory } from "../daos/factory.js";

class CartRepository extends GenericRepository {
  constructor() {
    super(cartDaoFactory); // Pass the specific DAO for users
  }

  // Add any user-specific methods here, if needed
  async findOnePopulated(criteria) {
    return this.dao.readOnePopulated(criteria, "products.product");
  }
}

export const cartRepository = new CartRepository();

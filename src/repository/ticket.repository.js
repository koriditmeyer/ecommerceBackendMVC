import { GenericRepository } from "./genericRepository.js";
import { ticketDaoFactory } from "../daos/factory.js";

export class TicketRepository extends GenericRepository {
  constructor() {
    super(ticketDaoFactory); // Pass the specific DAO for users
  }

  // Add any user-specific methods here, if needed
  async findOnePopulated(criteria) {
    return this.dao.readOnePopulated(criteria,  {
      path: "products.product",
    });
  }

  async findManyPopulated(criteria) {
    return this.dao.readManyPopulated(criteria, {
      path: "products.product",
    });
  }
}

export const ticketRepository = new TicketRepository();

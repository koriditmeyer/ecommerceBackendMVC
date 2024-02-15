import { GenericRepository } from "./genericRepository.js";
import { ticketDaoFactory } from "../daos/factory.js";
import { NotFoundError } from "../models/errors/notFound.error.js";
import { logger } from "../utils/logger/index.js";
import { objectToString } from "../utils/objectToString.js";

export class TicketRepository extends GenericRepository {
  constructor() {
    super(ticketDaoFactory); // Pass the specific DAO for users
  }

  // Add any user-specific methods here, if needed
  async findOnePopulated(criteria) {
    logger.debug(
      `[Repository] - findOnePopulated method with criteria ${objectToString(criteria)}`
    );
    const result =await this.dao.readOnePopulated(criteria,  {
      path: "products.product",
    });
    if (!result) throw new NotFoundError();
    logger.info(
      `[Repository] - findOnePopulated method with result ${objectToString(result)}`
    );
    return result
  }

  async findManyPopulated(criteria) {
    logger.debug(
      `[Repository] - findManyPopulated method with criteria ${objectToString(criteria)}`
    );
    const result = await this.dao.readManyPopulated(criteria, {
      path: "products.product",
    });
    if (!result) throw new NotFoundError();
    logger.info(
      `[Repository] - findManyPopulated method with result ${objectToString(result)}`
    );
    return result
  }
}

export const ticketRepository = new TicketRepository();

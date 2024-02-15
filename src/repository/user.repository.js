import { GenericRepository } from "./genericRepository.js";
import { userDaoFactory } from "../daos/factory.js";
import { NotFoundError } from "../models/errors/notFound.error.js";
import { logger } from "../utils/logger/index.js";
import { objectToString } from "../utils/objectToString.js";


export class UserRepository extends GenericRepository {
    constructor() {
        super(userDaoFactory); // Pass the specific DAO for users
    }

    // Add any user-specific methods here, if needed
    async findOnePopulated(criteria) {
        logger.debug(
            `[Repository] - findOnePopulated method with criteria ${objectToString(criteria)}`
          );
        const result =await  this.dao.readOnePopulated(criteria, "cartId");
        if (!result) throw new NotFoundError();
        logger.info(
            `[Repository] - findOnePopulated method with result ${objectToString(result)}`
          );
        return result
    }
}

export const usersRepository = new UserRepository();
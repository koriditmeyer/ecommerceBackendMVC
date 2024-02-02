import { GenericRepository } from "./genericRepository.js";
import { userDaoFactory } from "../daos/factory.js";


export class UserRepository extends GenericRepository {
    constructor() {
        super(userDaoFactory); // Pass the specific DAO for users
    }

    // Add any user-specific methods here, if needed
    findOnePopulated(criteria) {
        console.log("hi")
        return this.dao.readOnePopulated(criteria, "cartId");
    }
}

export const usersRepository = new UserRepository();
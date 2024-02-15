import { AuthenticationError } from "../models/errors/authentication.error.js";
import { usersRepository } from "../repository/user.repository.js";
import { hash } from "../utils/hash.js";
import { logger } from "../utils/logger/index.js";

export class UserServices {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async verifyUserCart(cid,id) {
    logger.debug(`[services] verifyUserCart method got: cid:${cid}, id:${id},` )
    const userCart = await this.usersRepository.findOne(
      {$and:[{_id:id},{cartId:cid}]}
    );
    logger.info(`[services] verifyUserCart method return for this user cart: ${userCart}` )
    return userCart;
  }

  async findOne(id) {
    logger.debug(`[services] findOne method got: id:${id}` )
    const user = await this.usersRepository.findOne({ _id: id });
    logger.info(`[services] findOne method return user: ${user}` )
    return user;
  }

  async findOneEmail(email) {
    logger.debug(`[services] findOneEmail method got: email:${email}` )
    const user = await this.usersRepository.findOne({ email: email });
    logger.info(`[services] findOneEmail method return user: ${user}` )
    return user;
  }

  async findOnePopulate(id) {
    logger.debug(`[services] findOnePopulate method got: id:${id}` )
    const user = await this.usersRepository.findOnePopulated({ _id: id });
    logger.info(`[services] findOnePopulate method return user: ${user}` )
    return user;
  }

  async findMany(query) {
    logger.debug(`[services] findMany method got: query:${query}` )
    const users = await this.usersRepository.findMany(query);
    logger.info(`[services] findMany method return users: ${users}` )
    return users;
  }

  async resetPassword(id, password) {
    logger.debug(`[services] resetPassword method got: user id:${id}, and new password ${password}` )
    if (!password) {
      throw new AuthenticationError();
    }
    //! encrypt password!
    password = hash(password);
    const updatedUser = await this.usersRepository
      .updateOne(
        { _id: id },
        { $set: { password: password } }
      )
      logger.info(`[services] resetPassword method return updated User: ${updatedUser}` )
    return updatedUser;
  }
}

export const userServices = new UserServices(usersRepository);

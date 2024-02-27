import { UserResponseDTO } from "../daos/dtos/user.dto.js";
import { AuthenticationError } from "../models/errors/authentication.error.js";
import { IncorrectDataError } from "../models/errors/incorrectData.error.js";
import { cartRepository } from "../repository/cart.repository.js";
import { usersRepository } from "../repository/user.repository.js";
import { hash } from "../utils/hash.js";
import { logger } from "../utils/logger/index.js";
import { objectToString } from "../utils/objectToString.js";
import { toPojo } from "../utils/toPojo.js";

export class UserServices {
  constructor(usersRepository, cartRepository) {
    this.usersRepository = usersRepository;
    this.cartRepository = cartRepository;
  }

  async verifyUserCart(cid, id) {
    logger.debug(`[services] verifyUserCart method got: cid:${cid}, id:${id},`);
    const userCart = await this.usersRepository.findOne({
      $and: [{ _id: id }, { cartId: cid }],
    });
    logger.info(
      `[services] verifyUserCart method return for this user cart: ${userCart}`
    );
    return userCart;
  }

  async createUserCart(id) {
    logger.debug(`[services] createUserCart method got: ${id}`);
    // Create a new cart for the user
    logger.debug("[services] createUserCart method,Now creating Cart");
    const addedCart = await this.cartRepository.create();
    logger.debug("[services] createUserCart method, Now updating User");
    let updatedUser;
    updatedUser = await this.usersRepository.updateOne(
      { _id: id },
      { $set: { cartId: addedCart._id } }
    );
    // For security reasons we want minimum things from user to initiate session
    const userDTO = toPojo(new UserResponseDTO(updatedUser));
    logger.info(
      `[services] createUserCart method exit: ${objectToString(userDTO)}`
    );
    return userDTO;
  }

  async findOne(id) {
    logger.debug(`[services] findOne method got: id:${id}`);
    const user = await this.usersRepository.findOne({ _id: id });
    logger.info(`[services] findOne method return user: ${user}`);
    return user;
  }

  async findOneEmail(email) {
    logger.debug(`[services] findOneEmail method got: email:${email}`);
    const user = await this.usersRepository.findOne({ email: email });
    logger.info(`[services] findOneEmail method return user: ${user}`);
    return user;
  }

  async findOnePopulate(id) {
    logger.debug(`[services] findOnePopulate method got: id:${id}`);
    const user = await this.usersRepository.findOnePopulated({ _id: id });
    logger.info(`[services] findOnePopulate method return user: ${user}`);
    return user;
  }

  async findMany(query) {
    logger.debug(`[services] findMany method got: query:${query}`);
    const users = await this.usersRepository.findMany(query);
    logger.info(`[services] findMany method return users: ${users}`);
    return users;
  }

  async resetPassword(id, password) {
    logger.debug(
      `[services] resetPassword method got: user id:${id}, and new password ${password}`
    );
    if (!password) {
      throw new IncorrectDataError(password);
    }
    //! encrypt password!
    password = hash(password);
    const updatedUser = await this.usersRepository.updateOne(
      { _id: id },
      { $set: { password: password } }
    );
    logger.info(
      `[services] resetPassword method return updated User: ${updatedUser}`
    );
    return updatedUser;
  }

  async updateUser(id, userData) {
    logger.debug(
      `[services] updateUser method got: user id:${id}, and updated data ${userData}`
    );
    // List of allowed fields to update
    const allowedFields = [
      "first_name",
      "last_name",
      "age",
      "phone",
      "address",
      "city_locality",
      "postal_code",
      "country_code",
    ];
    // Validate each field in data object
    const fieldsToUpdate = Object.keys(userData);
    // check that field password and email are not included (they have their own method)
    for (const field of fieldsToUpdate) {
      if (!allowedFields.includes(field)) {
        throw new IncorrectDataError(field);
      }
    }
    //update
    const updatedUser = await this.usersRepository.updateOne(
      { _id: id },
      { $set: userData } // Use computed property name to set dynamically
    );
    // For security reasons we want minimum things from user to initiate session
    const userDTO = toPojo(new UserResponseDTO(updatedUser));
    logger.info(
      `[services] updateUser method return updated User: ${userDTO}`
    );
    return userDTO;
  }
}

export const userServices = new UserServices(usersRepository, cartRepository);

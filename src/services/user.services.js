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
    let myRegxp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/; // password has a special character, a number, uppercase, lowecase and more than 6 characters
    if (!password || !myRegxp.test(password)) {
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
    logger.info(`[services] updateUser method return updated User: ${userDTO}`);
    return userDTO;
  }

  async updateImage(id, newImages) {
    logger.debug(`[services] updateImage method got: id:${id}`);
    // console.log(newImages)
    if (!newImages) {
      throw new Error(`You need to upload some images`);
    }
    newImages = { profilePhoto: newImages.map((e) => e.path) };
    // console.log(newImages)
    const modified = await this.usersRepository.updateOne(
      { _id: id },
      { $set: newImages }
    );
    const userDTO = toPojo(new UserResponseDTO(modified));
    logger.info(`[services] updateImage method return modified: ${userDTO}`);
    return userDTO;
  }

  async updateDocuments(id, newDocuments) {
    logger.debug(`[services] updateDocuments method got: id:${id}`);
    // console.log(newImages)
    if (!newDocuments) {
      throw new Error(`You need to upload some documents`);
    }
    newDocuments = {
      documents: newDocuments.map((e) => ({
        name: e.originalname,
        reference: e.path,
      })),
    };
    // console.log(newImages)
    // update documents ref
    let modified = await this.usersRepository.updateOne(
      { _id: id },
      { $set: newDocuments }
    );
    // Update user status
    if (modified.documents.length > 0) {
      modified = await this.usersRepository.updateOne(
        { _id: id },
        { $set: { status: "PendingDocumentsValidation" } }
      );
    }
    console.log(modified);
    const userDTO = toPojo(new UserResponseDTO(modified));
    logger.info(
      `[services] updateDocuments method return modified: ${userDTO}`
    );
    return userDTO;
  }

  async userPremium(id) {
    logger.debug(`[services] userPremium method got: id:${id}`);
    const roleToAdd = "premium";
    //check if documents are there
    let user = await this.findOne(id);
    if (user.documents.length !== 3) {
      throw new Error(`You need to upload 3 documents`);
    }
    //check if the user is already premium
    if (user.roles.includes(roleToAdd)) {
      throw new Error(`User already ${roleToAdd}`);
    }
    // Update user role
    user.roles.push(roleToAdd);
    let roles = user.roles;
    let modified = await this.usersRepository.updateOne(
      { _id: id },
      { $set: { roles: roles } }
    );
    // Update user status
    if (modified.documents.length > 0) {
      modified = await this.usersRepository.updateOne(
        { _id: id },
        { $set: { status: "" } }
      );
    }
    const userDTO = toPojo(new UserResponseDTO(modified));
    logger.info(`[services] userPremium method return modified: ${userDTO}`);
    return userDTO;
  }
}

export const userServices = new UserServices(usersRepository, cartRepository);

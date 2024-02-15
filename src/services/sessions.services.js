import { cartRepository } from "../repository/cart.repository.js";
import { usersRepository } from "../repository/user.repository.js";
import { AuthenticationError } from "../models/errors/authentication.error.js";
import { compareHash, hash } from "../utils/hash.js";
import { UserResponseDTO } from "../daos/dtos/user.dto.js";
import { toPojo } from "../utils/toPojo.js";
import { logger } from '../utils/logger/index.js'
import {objectToString} from "../utils/objectToString.js"

export class SessionsServices {
  constructor(usersRepository, cartRepository) {
    this.usersRepository = usersRepository;
    this.cartRepository = cartRepository;
  }

  async register(user, type) {
    logger.debug(`[services] register method got: ${objectToString(user)}` )
    if ((type === "local")) {
      if (!user.email) {
        throw new AuthenticationError();
      }
      if (!user.password) {
        throw new AuthenticationError();
      }
      user.password =  hash(user.password); //! encrypt password!
    }
    let newUser;
    newUser = await this.usersRepository.create(user);
    // Create a new cart for the user
    logger.debug("[services] register method User created, Now creating Cart");
    const addedCart = await this.cartRepository.create();
    logger.debug("[services] register method Cart created, Now updating User");

    let updatedUser;
    updatedUser = await this.usersRepository.updateOne(
      { _id: newUser._id },
      { cartId: addedCart._id }
    );
    // For security reasons we want minimum things from user to initiate session
    const userDTO = toPojo(new UserResponseDTO(updatedUser));
    logger.info(`[services] register method exit: ${objectToString(userDTO)}`)
    return userDTO;
  }

  async login({ email, password }) {
    logger.debug(`[services] login method got: ${email}, ${password}`)
    if (!email) {
      throw new AuthenticationError();
    }
    if (!password) {
      throw new AuthenticationError();
    }
    const user = await this.usersRepository.findOne({ email: email });
    //! should encript the received and compred with the saved that is encripted
    if (
      !compareHash({
        received: password,
        stored: user.password,
      })
    ) {
      throw new AuthenticationError();
    }
    // For security reasons we want minimum things from user to initiate session
    const userDTO = toPojo(new UserResponseDTO(user));
    logger.info(`[services] login method exit: ${objectToString(userDTO)}`)
    return userDTO;
  }
}

export const sessionsServices = new SessionsServices(
  usersRepository,
  cartRepository
);

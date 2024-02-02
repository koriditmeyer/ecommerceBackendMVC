import { cartRepository } from "../repository/cart.repository.js";
import { usersRepository } from "../repository/user.repository.js";
import { AuthenticationError } from "../models/errors/authentication.error.js";
import { compareHash, hash } from "../utils/hash.js";
import { UserResponseDTO } from "../daos/dtos/user.dto.js";
import { toPojo } from "../utils/toPojo.js";

export class SessionsServices {
  constructor(usersRepository, cartRepository) {
    this.usersRepository = usersRepository;
    this.cartRepository = cartRepository;
  }

  async register(user, type) {
    // console.log("services");
    if ((type = "local")) {
      if (!user.email) {
        throw new AuthenticationError();
      }
      if (!user.password) {
        throw new AuthenticationError();
      }
      user.password = hash(user.password); //! encrypt password!
    }
    let newUser;

    newUser = await this.usersRepository.create(user);
    // Create a new cart for the user
    const addedCart = await this.cartRepository.create();
    let updatedUser;
    updatedUser = await this.usersRepository.updateOne(
      { _id: newUser._id },
      { cartId: addedCart._id }
    );
    // For security reasons we want minimum things from user to initiate session
    const userDTO = toPojo(new UserResponseDTO(updatedUser));
    return userDTO;
  }

  async login({ email, password }) {
    // console.log("services");
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
    console.log(user)
    // For security reasons we want minimum things from user to initiate session
    const userDTO = toPojo(new UserResponseDTO(user));
    console.log(userDTO)
    return userDTO;
  }
}

export const sessionsServices = new SessionsServices(
  usersRepository,
  cartRepository
);

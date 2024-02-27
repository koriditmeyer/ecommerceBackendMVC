import { cartRepository } from "../repository/cart.repository.js";
import { usersRepository } from "../repository/user.repository.js";
import { AuthenticationError } from "../models/errors/authentication.error.js";
import crypto from "crypto";
import { compareHash, hash } from "../utils/hash.js";
import { UserResponseDTO } from "../daos/dtos/user.dto.js";
import { toPojo } from "../utils/toPojo.js";
import { logger } from "../utils/logger/index.js";
import { objectToString } from "../utils/objectToString.js";
import { CLIENT_ORIGIN, TOKEN_EXP } from "../config/config.js";
import { emailService } from "./email/email.service.js";
import { userServices } from "./user.services.js";
import { RegistrationError } from "../models/errors/registation.error.js";

export class SessionsServices {
  constructor(usersRepository, cartRepository) {
    this.usersRepository = usersRepository;
    this.cartRepository = cartRepository;
  }

  async registerLocal(user) {
    logger.debug(
      `[services] registerLocal method got: ${objectToString(user)}`
    );
    if (!user.email) {
      throw new RegistrationError();
    }
    if (!user.password) {
      throw new RegistrationError();
    }
    let token = crypto.randomBytes(20).toString("hex");
    user.tokenExpiry = Date.now() + TOKEN_EXP; // 1 hour from now
    user.token = hash(token); //! encrypt token
    user.password = hash(user.password); //! encrypt password!
    user.verified = false;
    const newUser = await this.usersRepository.create(user);
    // Create a new cart for the user
    const updatedUser = await userServices.createUserCart(newUser._id);
    // send email with token link
    const object = `Verify your email`;
    const destinatary = user.email;
    const templateName = "verification";
    const message = {
      name: user.first_name,
      url: `${CLIENT_ORIGIN}/verify?email=${encodeURIComponent(user.email)}&token=${token}`,
    };
    await emailService.send(destinatary, object, templateName, message);
    logger.debug(`[services] registerLocal method - message sucessfully sent`);
    logger.info(
      `[services] registerLocal method exit: ${objectToString(updatedUser)}`
    );
    return updatedUser;
  }

  async registerAuth(user) {
    logger.debug(`[services] registerAuth method got: ${objectToString(user)}`);
    user.verified = true;
    let newUser;
    newUser = await this.usersRepository.create(user);
    // Create a new cart for the user
    const updatedUser = await userServices.createUserCart(newUser._id);
    logger.info(
      `[services] registerAuth method exit: ${objectToString(updatedUser)}`
    );
    return updatedUser;
  }

  async verify(token, email) {
    logger.debug(`[services] verify method got: ${token} and email ${email}`);
    let user = await this.usersRepository.findOne({
      email: email,
    });
    if (
      !compareHash({
        received: token,
        stored: user.token,
      })
    ) {
      throw new Error("Invalid or expired token");
    }
    logger.debug(`[services] verify method - correct token`);
    if (!user.tokenExpiry || user.tokenExpiry < Date.now()) {
      throw new Error("Invalid or expired token");
    }
    logger.debug(`[services] verify method - token date valid, updating user`);
    const updatedUser = await this.usersRepository.updateOne(
      { _id: user._id },
      { $set: { verified: true, token: "", tokenExpiry: "" } }
    );
    const userDTO = toPojo(new UserResponseDTO(updatedUser));
    logger.info(`[services] register method exit: ${objectToString(userDTO)}`);
    return userDTO;
  }

  async login({ email, password }) {
    logger.debug(`[services] login method got: ${email}, ${password}`);
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
    logger.info(`[services] login method exit: ${objectToString(userDTO)}`);
    return userDTO;
  }
}

export const sessionsServices = new SessionsServices(
  usersRepository,
  cartRepository
);

import { AuthenticationError } from "../models/errors/authentication.error.js";
import { usersRepository } from "../repository/user.repository.js";
import { hash } from "../utils/hash.js";

export class UserServices {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async findOne(id) {
    const user = await this.usersRepository.findOne({ _id: id });
    return user;
  }

  async findOnePopulate(id) {
    const user = await this.usersRepository.findOnePopulated({ _id: id });
    return user;
  }

  async findMany(query) {
    const users = await this.usersRepository.findMany(query);
    return users;
  }

  async resetPassword(id, password) {
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
    return updatedUser;
  }
}

export const userServices = new UserServices(usersRepository);

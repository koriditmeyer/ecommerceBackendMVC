import { NotFoundError } from "../models/errors/notFound.error.js";

export class GenericRepository {
  #dao;

  constructor(dao, dto) {
    this.#dao = dao;
  }

  get dao() {
    return this.#dao;
  }

  async create(data, options) {
    let result = this.#dao.create(data);
    if (!result) throw new Error("Nothing Created");
    return result;
  }

  async findOne(criteria, options) {
    const result = await this.#dao.readOne(criteria);
    if (!result) throw new NotFoundError();
    return result;
  }

  async findMany(criteria, options) {
    const results = await this.#dao.readMany(criteria);
    if (!results) throw new NotFoundError();
    return results;
  }

  async updateOne(criteria, newData, options) {
    const result = await this.#dao.updateOne(criteria, newData);
    if (result.matchedCount === 0) {
      throw new NotFoundError();
    }
    if (result.modifiedCount === 0) {
      throw new Error("User found but no changes were made");
    }
    return result;
  }

  async updateMany(criteria, newData, options) {
    const result = await this.#dao.updateMany(criteria, newData)
    if (!result) throw new Error('Could not update')
    return result
  }

  async deleteOne(criteria, options) {
    const deleted = await this.#dao.deleteOne(criteria)
    return deleted
  }

  async deleteMany(criteria, options) {
  const deleted = await  this.#dao.deleteMany(criteria)
    return deleted
  }
}

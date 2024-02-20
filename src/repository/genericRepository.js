import { NotFoundError } from "../models/errors/notFound.error.js";
import { NotModifiedError } from "../models/errors/notModified.error.js";
import { NotCreatedError } from "../models/errors/notCreated.error.js";
import { logger } from "../utils/logger/index.js";
import { objectToString } from "../utils/objectToString.js";

export class GenericRepository {
  #dao;

  constructor(dao, dto) {
    this.#dao = dao;
  }

  get dao() {
    return this.#dao;
  }

  async create(data, options) {
    logger.debug(
      `[Repository] - Create method with data ${objectToString(data)}`
    );
    let result = this.#dao.create(data);
    if (!result) throw new NotCreatedError();
    logger.info(
      `[Repository] - Create method with result ${objectToString(result)}`
    );
    return result;
  }

  async findOne(criteria, options) {
    logger.debug(
      `[Repository] - findOne method with criteria ${objectToString(criteria)}`
    );
    const result = await this.#dao.readOne(criteria);
    if (!result) throw new NotFoundError();
    logger.info(
      `[Repository] - findOne method with result ${objectToString(result)}`
    );
    return result;
  }

  async findMany(criteria, options) {
    logger.debug(
      `[Repository] - findMany method with criteria ${objectToString(criteria)}`
    );
    const results = await this.#dao.readMany(criteria);
    if (!results) throw new NotFoundError();
    logger.info(
      `[Repository] - findMany method with result ${objectToString(results)}`
    );
    return results;
  }

  async updateOne(criteria, newData, options) {
    logger.debug(
      `[Repository] - updateOne method with criteria ${objectToString(criteria)}, new data ${objectToString(newData)}`
    );
    const result = await this.#dao.updateOne(criteria, newData);
    if (result.matchedCount === 0) {
      throw new NotFoundError();
    }
    if (result.modifiedCount === 0) {
      throw new NotModifiedError();
    }
    logger.info(
      `[Repository] - updateOne method with result ${objectToString(result)}`
    );
    return result;
  }

  async updateMany(criteria, newData, options) {
    logger.debug(
      `[Repository] - updateMany method with criteria ${objectToString(criteria)}, new data ${objectToString(newData)}`
    );
    const result = await this.#dao.updateMany(criteria, newData);
    if (result.matchedCount === 0) {
      throw new NotFoundError();
    }
    if (result.modifiedCount === 0) {
      throw new NotModifiedError();
    }
    logger.info(
      `[Repository] - updateMany method with result ${objectToString(result)}`
    );
    return result;
  }

  async deleteOne(criteria, options) {
    logger.debug(
      `[Repository] - deleteOne method with criteria ${objectToString(criteria)}`
    );
    const deleted = await this.#dao.deleteOne(criteria);
    logger.info(
      `[Repository] - deleteOne method with deleted data ${objectToString(deleted)}`
    );
    return deleted;
  }

  async deleteMany(criteria, options) {
    logger.debug(
      `[Repository] - Create method with criteria ${objectToString(criteria)}`
    );
    const deleted = await this.#dao.deleteMany(criteria);
    logger.info(
      `[Repository] - deleteMany method with deleted data ${objectToString(deleted)}`
    );
    return deleted;
  }
}

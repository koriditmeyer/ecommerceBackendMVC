import { NotFoundError } from "../../models/errors/notFound.error.js";
import { logger } from "../../utils/logger/index.js";
import { objectToString } from "../../utils/objectToString.js";
import { toPojo } from "../../utils/toPojo.js";

export class mongooseDao {
  #model;
  constructor(mongooseModel) {
    this.#model = mongooseModel;
  }

  get model() {
    return this.#model;
  }

  async create(element) {
    logger.debug(`[DAO] - create method with data ${objectToString(element)}`);
    const pojo = toPojo(await this.#model.create(element));
    logger.info(
      `[DAO] - create method with created data ${objectToString(pojo)}`
    );
    return pojo;
  }

  async readOne(criteria) {
    logger.debug(
      `[DAO] - readOne method with criteria ${objectToString(criteria)}`
    );
    const result = await this.#model
      .findOne(criteria)
      // .select({ _id: 0 })
      .lean();
    // if (!result) throw new NotFoundError();
    logger.info(`[DAO] - readOne method with result ${objectToString(result)}`);
    return result;
  }

  async readMany(criteria) {
    logger.debug(
      `[DAO] - readMany method with criteria ${objectToString(criteria)}`
    );
    const result = await this.#model
      .find(criteria)
      // .select({ _id: 0 })
      .lean();
    logger.info(
      `[DAO] - readMany method with result ${objectToString(result)}`
    );
    return result;
  }

  async updateOne(criteria, newData) {
    logger.debug(
      `[DAO] - updateOne method with criteria ${objectToString(
        criteria
      )}, and New data ${objectToString(newData)}`
    );
    const modified = await this.#model
      .findOneAndUpdate(criteria, newData, {
        new: true,
        projection: { _id: 0 },
      })
      .lean();
    modified && delete modified._id;
    logger.info(
      `[DAO] - updateOne method with modified value ${objectToString(modified)}`
    );
    return modified;
  }

  async updateMany(criteria, newData) {
    logger.debug(
      `[DAO] - updateMany method with criteria ${objectToString(
        criteria
      )}, and New data ${objectToString(newData)}`
    );
    const modified = await this.#model.updateMany(criteria, newData);
    logger.info(
      `[DAO] - updateMany method with midified value ${objectToString(
        modified
      )}`
    );
    return modified;
  }

  async deleteOne(criteria) {
    logger.debug(
      `[DAO] - deleteOne method with criteria ${objectToString(criteria)}`
    );
    const deleted = await this.#model
      .findOneAndDelete(criteria, { projection: { _id: 0 } })
      .lean();
    // if (!deleted) throw new Error("NOT FOUND");
    deleted && delete deleted._id;
    //console.log(deleted);
    logger.info(
      `[DAO] - deleteOne method with deleted data ${objectToString(deleted)}`
    );
    return deleted;
  }

  async deleteMany(criteria) {
    logger.debug(
      `[DAO] - deleteOne method with criteria ${objectToString(criteria)}`
    );
    const deleted = await this.#model.deleteMany(criteria);
    logger.info(
      `[DAO] - deleteOne method with deleted data ${objectToString(deleted)}`
    );
    return deleted;
  }

  // POPULATIONS ----------------------------------------------------------
  async readOnePopulated(criteria, foreignModel) {
    logger.debug(
      `[DAO] - readOnePopulated method with criteria ${objectToString(
        criteria
      )}`
    );
    const result = await this.#model
      .findOne(criteria)
      .populate(foreignModel)
      .select({ _id: 0 })
      .lean();
    // if (!result) throw new Error("NOT FOUND");
    logger.info(
      `[DAO] - readOnePopulated method with result ${objectToString(result)}`
    );
    return result;
  }

  async readOnePopulatedAggregation(criteria, localField, from, foreignField) {
    logger.debug(
      `[DAO] - readOnePopulatedAggregation method with criteria ${objectToString(
        criteria
      )}`
    );
    const [result] = await this.model.aggregate([
      { $match: criteria },
      { $limit: 1 },
      {
        $lookup: {
          from,
          localField,
          foreignField,
          as: localField,
          pipeline: [{ $project: { _id: false } }],
        },
      },
      { $project: { _id: false } },
    ]);

    // if (!result) throw new Error("NOT FOUND");
    delete result._id;
    logger.info(
      `[DAO] - readOnePopulatedAggregation method with result ${objectToString(
        result
      )}`
    );
    return result;
  }

  async readManyPopulatedAggregation(criteria, localField, from, foreignField) {
    logger.debug(
      `[DAO] - readManyPopulatedAggregation method with criteria ${objectToString(
        criteria
      )}`
    );
    const result = await this.model.aggregate([
      { $match: criteria },
      {
        $lookup: {
          from,
          localField,
          foreignField,
          as: localField,
          pipeline: [{ $project: { _id: false } }],
        },
      },
      { $project: { _id: false } },
    ]);
    // if (!result) throw new Error("NOT FOUND");
    logger.info(
      `[DAO] - readManyPopulatedAggregation method with result ${objectToString(
        result
      )}`
    );
    return result;
  }
  // PAGINATE ----------------------------------------------------------
  async paginate(query, options) {
    logger.debug(`[DAO] - paginate method with query ${objectToString(query)}`);
    // Use the paginate method provided by mongoose-paginate-v2
    const result = this.#model.paginate(query, options);
    logger.info(
      `[DAO] - paginate method with result ${objectToString(result)}`
    );
    return result;
  }
}

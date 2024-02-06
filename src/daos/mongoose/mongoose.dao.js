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
    console.log("dao - create");
    console.log(element);
    const pojo = toPojo(await this.#model.create(element));
    console.log("dao - create - pojo");
    console.log(pojo);
    return pojo;
  }

  async readOne(criteria) {
    console.log("dao - readOne");
    const result = await this.#model
      .findOne(criteria)
      // .select({ _id: 0 })
      .lean();
    if (!result) throw new Error("NOT FOUND");
    return result;
  }

  async readMany(criteria) {
    const result = await this.#model.find(criteria).select({ _id: 0 }).lean();
    return result;
  }

  async updateOne(criteria, newData) {
    console.log("dao -updateOne");
    const modified = await this.#model
      .findOneAndUpdate(criteria, newData, {
        new: true,
        projection: { _id: 0 },
      })
      .lean();
    if (!modified) throw new Error("NOT FOUND");
    delete modified._id;
    return modified;
  }

  async updateMany(criteria, newData) {
    await this.#model.updateMany(criteria, newData);
  }

  async deleteOne(criteria) {
    const deleted = await this.#model
      .findOneAndDelete(criteria, { projection: { _id: 0 } })
      .lean();
    if (!deleted) throw new Error("NOT FOUND");
    delete deleted._id;
    return deleted;
  }

  async deleteMany(criteria) {
    await this.#model.deleteMany(criteria);
  }

  // POPULATIONS ----------------------------------------------------------
  async readOnePopulated(criteria, foreignModel) {
    const result = await this.#model
      .findOne(criteria)
      .populate(foreignModel)
      .select({ _id: 0 })
      .lean();
    if (!result) throw new Error("NOT FOUND");
    return result;
  }

  async readOnePopulatedAggregation(criteria, localField, from, foreignField) {
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

    if (!result) throw new Error("NOT FOUND");
    delete result._id;
    return result;
  }

  async readManyPopulatedAggregation(criteria, localField, from, foreignField) {
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
    return result;
  }
  // PAGINATE ----------------------------------------------------------
  async paginate(query, options) {
    console.log("dao - paginate");
    // Use the paginate method provided by mongoose-paginate-v2
    return this.#model.paginate(query, options);
  }
  
}

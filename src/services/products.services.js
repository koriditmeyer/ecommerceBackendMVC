import { IncorrectDataError } from "../models/errors/incorrectData.error.js";
import { NotFoundError } from "../models/errors/notFound.error.js";
import { categoryRepository } from "../repository/category.repository.js";
import { productsRepository } from "../repository/products.repository.js";
import { logger } from "../utils/logger/index.js";
import { objectToString } from "../utils/objectToString.js";

export class ProductsServices {
  constructor(productsRepository) {
    this.productsRepository = productsRepository;
    this.categoryRepository = categoryRepository;
  }

  async getProductQuery(query) {
    logger.debug(
      `[services] getProductQuery method got: query:${objectToString(query)}`
    );
    // If nothing in query trow error
    if (Object.keys(query).length <= 0) {
      throw new IncorrectDataError();
    }
    if (query.limit <= 0) {
      throw new Error(`The limit entered must be positive or null`);
    }
    if (query.limit > 100) {
      throw new Error(`The limit entered must under 100`);
    }
    let aggregateQuery = {};

    if (query.subCategory) {
      aggregateQuery.category = query.subCategory;
    } else if (query.category) {
      const mainCategory = await this.categoryRepository.findOne({
        _id: query.category,
      });
      if (!mainCategory)
        throw new NotFoundError(`Category '${query.category}' not found.`);
      // Extract subcategory IDs
      const subcategoryIds = mainCategory.subcategories.map((sub) => sub.id);
      // console.log(subcategoryIds)
      // Adjust the query to filter products belonging to any of these subcategory IDs
      aggregateQuery.category = { $in: subcategoryIds };
    }
    // If a search term is provided, add a condition to match the search term in the title field
    if (query.searchTerm) {
      aggregateQuery.title = { $regex: new RegExp(query.searchTerm, "i") }; // 'i' for case-insensitive
    }
    // If a badge if provided add condition
    if (query.badge) {
      aggregateQuery.badge = query.badge;
    }
    logger.debug(
      `[services] getProductQuery - aggregate query:${objectToString(
        aggregateQuery
      )}`
    );

    const options = {
      limit: query.limit || 10, // Default page size: 10
      page: query.page || 1, // Default to first page
      lean: true, // Return plain JavaScript objects
      sort: query.sort === "desc" ? { price: -1 } : { price: 1 }, // Sorting
    };
    logger.debug(
      `[services] getProductQuery - options:${objectToString(options)}`
    );

    const result = await this.productsRepository.paginate(
      aggregateQuery,
      options
    );

    const context = {
      title: "Products",
      pagination: {
        existDocs: result.docs.length > 0,
        limit: result.limit,
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        nextPage: result.nextPage,
        hasPrevPage: result.hasPrevPage,
        prevPage: result.prevPage,
        pagingCounter: result.pagingCounter,
        totalDocs: result.totalDocs,
      },
      products: result.docs,
    };
    if (!context.pagination.existDocs) {
      throw new NotFoundError();
    }
    logger.info(
      `[services] getProductQuery method return user: ${objectToString(
        context
      )}`
    );
    return context;
  }

  async findOne(id) {
    logger.debug(`[services] findOne method got: id:${id}`);
    let product;
    try {
      product = await this.productsRepository.findOne({ _id: id });
    } catch (error) {
      throw new NotFoundError();
    }
    logger.info(`[services] findOne method return product: ${product}`);
    return product;
  }

  async distinct(regroup, search) {
    logger.debug(
      `[services] distinct method got: ${regroup} and match ${search}`
    );
    // if(!search){
    //   search=""
    // }
    console.log(search);
    let category;
    try {
      // Start with an empty pipeline
      let pipeline = [];
      // If match is provided and not null, add a $match stage to the pipeline
      if (search !== "null") {
        pipeline.push({
          $match: {
            title: { $regex: RegExp(search, "i") },
          },
        });
      }
      // Add the $group and $project stages to the pipeline
      pipeline.push(
        {
          $group: {
            _id: `$${regroup}`, // Group documents by the specified attribute
            count: { $sum: 1 }, // Count the number of documents in each group
          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field from the result
            category: "$_id", // Set the category name (or attribute name)
            count: 1, // Include the count of each category
          },
        }
      );

      category = await this.productsRepository.distinctSearch(pipeline);
    } catch (error) {
      throw new NotFoundError();
    }
    logger.info(`[services] distinct method return: ${category}`);
    return category;
  }

  async create(files, productData) {
    logger.debug(
      `[services] create method got productData:${objectToString(productData)}`
    );
    if (files?.length) {
      console.log(files);
      productData.thumbnail = files.map((e) => e.path.replace(/\\/g, "/"));
    }
    const addedProduct = await this.productsRepository.create(productData);
    logger.info(
      `[services] create method return added product: ${addedProduct}`
    );
    return addedProduct;
  }

  async updateOne(id, updatedData) {
    logger.debug(
      `[services] updateOne method got: id:${id}, updatedData:${objectToString(
        updatedData
      )}`
    );
    console.log(id, updatedData);
    if (updatedData.thumbnail) {
      throw new Error("You can't modify picture URL with this endpoint");
    }
    const updatedProduct = await this.productsRepository.updateOne(
      { _id: id },
      { $set: updatedData }
    );
    logger.info(
      `[services] updateOne method return updated product: ${updatedProduct}`
    );
    return updatedProduct;
  }

  async deleteProduct(id) {
    logger.debug(`[services] deleteProduct method got: id:${id}`);
    const deletedProduct = await this.productsRepository.deleteOne({ _id: id });
    logger.info(
      `[services] findOne method return deletd product: ${objectToString(
        deletedProduct
      )}`
    );
    return deletedProduct;
  }

  async updateImage(id, newImages) {
    logger.debug(`[services] updateImage method got: id:${id}`);
    if (!newImages) {
      throw new Error(`You need to upload some images`);
    }
    newImages = { thumbnail: newImages.map((e) => e.path) };
    const modified = await this.productsRepository.updateOne(
      { _id: id },
      { $set: newImages }
    );
    logger.info(`[services] updateImage method return modified: ${modified}`);
    return modified;
  }
}

export const productsServices = new ProductsServices(productsRepository);

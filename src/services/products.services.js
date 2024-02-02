import { IncorrectDataError } from "../models/errors/incorrectData.error.js";
import { productsRepository } from "../repository/products.repository.js";

export class ProductsServices {
  constructor(productsRepository) {
    this.productsRepository = productsRepository;
  }

  async getProductQuery(query) {
    if (query.limit <= 0) {
      throw new Error(`The limit entered must be positive or null`);
    }
    let aggregateQuery = {};
    // If a category is specified, use it in the query
    if (query.category) {
      aggregateQuery.category = query.category;
    }
    // If a search term is provided, add a condition to match the search term in the title field
    if (query.searchTerm) {
      aggregateQuery.title = { $regex: new RegExp(query.searchTerm, "i") }; // 'i' for case-insensitive
    }
    const options = {
      limit: query.limit || 10, // Default page size: 2
      page: query.page || 1, // Default to first page
      lean: true, // Return plain JavaScript objects
      sort: query.sort === "desc" ? { price: -1 } : { price: 1 }, // Sorting
    };

    const result = await this.productsRepository.paginate(
      aggregateQuery,
      options
    );

    const context = {
      title: "Products",
      existDocs: result.docs.length > 0,
      products: result.docs,
      limit: result.limit,
      page: result.page,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      nextPage: result.nextPage,
      hasPrevPage: result.hasPrevPage,
      prevPage: result.prevPage,
      pagingCounter: result.pagingCounter,
      totalDocs: result.totalDocs,
    };
    return context;
  }

  async findOne(id) {
    const product = await this.productsRepository.findOne({ _id: id });
    return product;
  }

  async create(files, productData) {
    if (files?.length) {
      console.log(files);
      productData.thumbnail = files.map((e) => e.path);
    }
    const addedProduct = await this.productsRepository.create(productData);
    return addedProduct;
  }

  async updateOne(id, updatedData) {
    console.log(id, updatedData)
    if (updatedData.thumbnail) {
      throw new Error("You can't modify picture URL with this endpoint");
    }
    const updatedProduct = await this.productsRepository.updateOne(
      { _id: id },
      { $set: updatedData }
    );
    return updatedProduct;
  }

  async deleteProduct(id) {
    const deletedProduct = await this.productsRepository.deleteOne({ _id: id });
    return deletedProduct;
  }

  async updateImage(id, newImages) {
    if (!newImages) {
      throw new Error(`You need to upload some images`);
    }
    newImages = { thumbnail: newImages.map((e) => e.path) };
    const modified = await this.productsRepository.updateOne(
      { _id: id },
      { $set: newImages }
    );
    return modified;
  }
}

export const productsServices = new ProductsServices(productsRepository);

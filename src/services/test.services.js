import { faker } from "@faker-js/faker";
import { logger } from "../utils/logger/index.js";

export class TestServices {
  async generateProducts() {
    let category = faker.commerce.department();
    const mockProducts = [];
    for (let i = 0; i < 1000; i++) {
      mockProducts.push({
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        attribute: faker.commerce.productAdjective(),
        description: faker.commerce.productDescription(),
        brand: faker.company.name(),
        code: faker.string.alpha(10),
        avgRating: faker.number.float({ multipleOf: 0.25, min: 0, max: 5 }),
        ratings: faker.number.float({ multipleOf: 0.25, min: 0, max: 5 }),
        price: faker.commerce.price({ min: 100, max: 200, dec: 1 }),
        oldPrice: faker.commerce.price({ min: 150, max: 200, dec: 1 }),
        stock: faker.number.int({ min: 10, max: 100 }),
        category: category,
        thumbnail: [
          faker.image.urlLoremFlickr({ category: category }),
          faker.image.urlLoremFlickr({ category: category }),
        ], // Set thumbnail as an array of strings,
      });
    }
    return mockProducts;
  }

  async generateUser() {
    const name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const mockUser = {
      _id: faker.database.mongodbObjectId(),
      name: name,
      last_name: last_name,
      email: faker.internet.email({ firstName: name, lastName: last_name }),
      password: faker.internet.password({ length: 20 }),
    };
    return mockUser;
  }

  async createErrorLog() {
    const text = `[services] Fake log error`;
    logger.error(text);
    return { text };
  }
}

export const testServices = new TestServices();

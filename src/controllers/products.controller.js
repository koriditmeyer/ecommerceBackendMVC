import { productsServices } from "../services/products.services.js";
import { extractFile } from "../middlewares/multer.js";
import { maxPicUpload } from "../config/config.js";

export async function getProductQuery(req, res, next) {
  try {
    const query = req.query;
    const products = await productsServices.getProductQuery(query);
    res["successfullGet"](products);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}

export async function getProduct(req, res, next) {
  try {
    const id = req.params.pid;
    const product = await productsServices.findOne(id);
    res["successfullGet"](product);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}

export const addProduct = [
  extractFile("thumbnail", maxPicUpload),
  async (req, res, next) => {
    try {
      const data = req.body;
      const files = req.files;
      const addedProduct = await productsServices.create(files, data);
      res["successfullPost"](addedProduct);
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  },
];

export async function modifyProduct(req, res, next) {
  try {
    const updatedData = req.body;
    const id = req.params.id;
    const updatedProduct = await await productsServices.updateOne(
      id,
      updatedData
    );
    res["successfullPut"](updatedProduct);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}
export async function deleteProduct(req, res, next) {
  try {
    const id = req.params.id;
    const deletedProduct = await productsServices.deleteProduct(id);
    res["successfullDelete"](deletedProduct);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}
export const addPictureImages = [
  extractFile("thumbnail", maxPicUpload),
  async (req, res, next) => {
    try {
      const id = req.params.pid;
      const newImages = req.files;
      const updatedProduct = await await productsServices.updateImage(
        id,
        newImages
      );
      res["successfullPut"](updatedProduct);
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  },
];

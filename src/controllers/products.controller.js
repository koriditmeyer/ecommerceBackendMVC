import { productsServices } from "../services/products.services.js";
import { extractFile } from "../middlewares/multer.js";
import { maxPicUpload } from "../config/config.js";

export async function getProductQuery(req, res, next) {
  const query = req.query;
  req.logger.debug("got query to search: " +  query);
  const products = await productsServices.getProductQuery(query);
  res["successfullGet"](products);
}

export async function getProduct(req, res, next) {
  const id = req.params.pid;
  req.logger.debug("got id to search: " + id);
  const product = await productsServices.findOne(id);
  res["successfullGet"](product);
}

export const addProduct = [
  extractFile("thumbnail", maxPicUpload),
  async (req, res, next) => {
    try {
      const data = req.body;
      const files = req.files;
      req.logger.debug("got data to add: " + data);
      req.logger.debug("got files to add: " + files);

      const addedProduct = await productsServices.create(files, data);
      res["successfullPost"](addedProduct);
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  },
];

export async function modifyProduct(req, res, next) {
  const updatedData = req.body;
  const id = req.params.id;
  req.logger.debug("for id:"+ id+" -got updated Data: " + updatedData);
  const updatedProduct = await await productsServices.updateOne(
    id,
    updatedData
  );
  res["successfullPut"](updatedProduct);
}
export async function deleteProduct(req, res, next) {
  const id = req.params.id;
  req.logger.debug("got id to delete: " + id);
  const deletedProduct = await productsServices.deleteProduct(id);
  res["successfullDelete"](deletedProduct);
}
export const addPictureImages = [
  extractFile("thumbnail", maxPicUpload),
  async (req, res, next) => {
    try {
      const id = req.params.pid;
      const newImages = req.files;
      req.logger.debug("got id: " + id);
      req.logger.debug("got new files: " + newImages);
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

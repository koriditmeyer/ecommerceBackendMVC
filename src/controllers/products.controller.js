import { productsServices } from "../services/products.services.js";
// import { extractFile } from "../middlewares/multer.js";
import { maxPicUpload } from "../config/config.js";
import { objectToString } from "../utils/objectToString.js";
import { removeEmptyFields } from "../middlewares/removeEmptyFields.js";
import { uploadFile } from "../middlewares/multer.js";

export async function getProductQuery(req, res, next) {
  const query = req.query;
  req.logger.debug("[Controller] got query to search: " +  objectToString(query));
  const products = await productsServices.getProductQuery(query);
  res["successfullGet"](products);
}

export async function getProduct(req, res, next) {
  const id = req.params.pid;
  req.logger.debug("[Controller] got id to search: " + id);
  const product = await productsServices.findOne(id);
  res["successfullGet"](product);
}

export async function getDistinct(req, res, next) {
  const {attribute,search} = req.query;
  req.logger.debug("[Controller] got to find distinct  "+attribute+" and this search: "+search);
  const category = await productsServices.distinct(attribute,search);
  res["successfullGet"](category);
}

export const addProduct = [
  uploadFile(
    "img/products",
    ["image/jpeg", "image/png", "image/webp"],
    10, //in Mb
    "thumbnail",
    maxPicUpload
  ),
  removeEmptyFields,
  async (req, res, next) => {
    try {
      const data = req.body;
      //console.log(data)
      const files = req.files;
      req.logger.debug("[Controller] got data to add: " + objectToString(data));
      req.logger.debug("[Controller] got files to add ");
      const _id = req.user._id;
      const addedProduct = await productsServices.create(files, data, _id);
      res["successfullPost"](addedProduct);
    } catch (error) {
      // console.log(error)
      next(error); // Pass any errors to the error handling middleware
    }
  },
];

export async function modifyProduct(req, res, next) {
  const updatedData = req.body;
  const id = req.params.id;
  req.logger.debug("[Controller] for id:"+ id+" -got updated Data: " + objectToString(updatedData));
  const updatedProduct = await await productsServices.updateOne(
    id,
    updatedData
  );
  res["successfullPut"](updatedProduct);
}
export async function deleteProduct(req, res, next) {
  const id = req.params.id;
  req.logger.debug("[Controller] got id to delete: " + id);
  const deletedProduct = await productsServices.deleteProduct(id);
  res["successfullDelete"](deletedProduct);
}
export const addPictureImages = [
  uploadFile(
    "img/products",
    ["image/jpeg", "image/png", "image/webp"],
    10, //in Mb
    "thumbnail",
    maxPicUpload
  ),
  async (req, res, next) => {
    try {
      const id = req.params.pid;
      const newImages = req.files;
      req.logger.debug("[Controller] got id: " + id);
      req.logger.debug("[Controller] got new files");
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

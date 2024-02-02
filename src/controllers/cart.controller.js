import { productsServices } from "../services/products.services.js";
import { extractFile } from "../middlewares/multer.js";
import { maxPicUpload } from "../config/config.js";
import { cartServices } from "../services/cart.services.js";

export async function createCart(req, res, next) {
  try {
    const cart = await cartServices.create();
    res["successfullPost"](cart);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}

export async function getCart(req, res, next) {
  try {
    const cid = req.params.cid;
    const cart = await cartServices.findOne(cid);
    res["successfullGet"](cart);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}
// ✓	ADD NEW PRODUCT TO CART AND IF EXIST INCREMENT QUANTITY
export async function addToCart(req, res, next) {
  try {
    const { cid, pid } = req.params;
    let quantity = req.body.quantity;
    const addedProduct = await cartServices.addToCart(cid, pid, quantity);
    res["successfullPost"](addedProduct);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}
// ✓	DELETE A PRODUCT FROM CART
export async function removeItemsCart(req, res, next) {
  try {
    const { cid, pid } = req.params;
    const deletedProduct = await cartServices.removeItemsCart(cid, pid);
    res["successfullDelete"](deletedProduct);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}

export async function updateCart(req, res, next) {
  try {
    const cid = req.params.cid;
    let products = req.body;
    const updatedCart = await cartServices.updateCart(cid, products);
    res["successfullPut"](updatedCart);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}

export async function clearCart(req, res, next) {
  try {
    const cid = req.params.cid;
    const deletedProducts = await cartServices.clearCart(cid);
    res["successfullDelete"](deletedProducts);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}

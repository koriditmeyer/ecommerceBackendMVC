import { cartServices } from "../services/cart.services.js";

export async function createCart(req, res, next) {
    const cart = await cartServices.create();
    res["successfullPost"](cart);
}

export async function getCart(req, res, next) {
    const cid = req.params.cid;
    req.logger.debug("got cart id to search: " +  cid);
    const cart = await cartServices.findOne(cid);
    res["successfullGet"](cart);
}
// ✓	ADD NEW PRODUCT TO CART AND IF EXIST INCREMENT QUANTITY
export async function addToCart(req, res, next) {
    const { cid, pid } = req.params;
    let quantity = req.body.quantity;
    req.logger.debug("for cart id: " +  cid+ " add product id:"+pid+" with quantity:"+quantity);
    const addedProduct = await cartServices.addToCart(cid, pid, quantity);
    res["successfullPost"](addedProduct);
}
// ✓	DELETE A PRODUCT FROM CART
export async function removeItemsCart(req, res, next) {
    const { cid, pid } = req.params;
    req.logger.debug("for cart id: " +  cid+ " delete product id:"+pid);
    const deletedProduct = await cartServices.removeItemsCart(cid, pid);
    res["successfullDelete"](deletedProduct);
}

export async function updateCart(req, res, next) {
    const cid = req.params.cid;
    let products = req.body;
    req.logger.debug("for cart id: " +  cid+ " update cart with:"+products);

    const updatedCart = await cartServices.updateCart(cid, products);
    res["successfullPut"](updatedCart);
}

export async function clearCart(req, res, next) {
    const cid = req.params.cid;
    req.logger.debug("Clear cart id: " +  cid);
    const deletedProducts = await cartServices.clearCart(cid);
    res["successfullDelete"](deletedProducts);
}

export async function purchaseItemsCart(req, res, next) {
    const cid = req.params.cid;
    req.logger.debug("Purchase cart id: " +  cid);
    const purchasedProducts = await cartServices.purchaseItemsCart(cid);
    res["successfullGet"](purchasedProducts);
}


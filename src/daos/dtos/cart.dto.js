import { newId } from "../../utils/id"

export class CreateCartDTO {
    constructor (cart){
        Object.assign(this, cart);
    }
}

export class CartResponseDTO {
    constructor(cart) {
        this._id=cart._id
    }
}
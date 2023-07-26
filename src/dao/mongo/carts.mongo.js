import cartModel from './models/cart.model.js';
import CustomError from '../../services/errors/CustomError.js';
import EErros from '../../services/errors/enums.js';

export default class CartsMongo {
    constructor() {
        this.model = cartModel;
    }

    getAll = async () => {
        return await this.model.find();
    }

    getByIdPopulate = async (cid) => {
        const cart = await this.model.find({ _id: cid });
        if (cart.length == 0) {
            CustomError.createError({
                name: "Reference error",
                message: "There is no cart with that id",
                code: EErros.BAD_REQUEST
            })
        }
        return cart;
    }

    getById = async (cid) => {
        const cart = await this.model.findOne({ _id: cid });
        if (!cart) {
            CustomError.createError({
                name: "Reference error",
                message: "There is no cart with that id",
                code: EErros.BAD_REQUEST
            })
        }
        return cart;
    }

    create = async () => {
        return await this.model.create({});
    }

    update = async (cid, cartToUpdate) => {
        return await this.model.findOneAndUpdate({ _id: cid }, cartToUpdate, { new: true });
    }

    delete = async (cid) => {
        return await this.model.deleteOne({ _id: cid });
    }
}
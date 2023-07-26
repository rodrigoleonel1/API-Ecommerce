import GenericRepository from './generic.repository.js';
import { productService, userService } from '../services/index.repository.js';
import ticketModel from '../dao/mongo/models/ticket.model.js';
import CustomError from '../services/errors/CustomError.js';
import EErros from '../services/errors/enums.js';

export default class CartsRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    getPopulated = async (cid) => {
        return await this.dao.getByIdPopulate(cid);
    }

    addProduct = async (cid, pid, user) => {
        const getProduct = await productService.getById(pid);
        if (user.role == 'premium' && getProduct.owner == user._id) {
            CustomError.createError({
                name: "Unauthorized",
                message: "You do not have the necessary permissions to do this.",
                code: EErros.UNAUTHORIZED
            })
        }
        const cart = await this.dao.getById(cid);
        const product = cart.products.find(product => product.product == pid);
        if (!product) cart.products.push({ product: pid, quantity: 1 });
        else product.quantity++;
        return await this.dao.update(cid, cart);
    }

    deleteProduct = async (cid, pid) => {
        const cart = await this.dao.getById(cid);
        const productIndex = cart.products.findIndex(p => p.product == pid);
        if (productIndex < 0) {
            CustomError.createError({
                name: "Reference error",
                message: "There is no product with that id in the cart",
                code: EErros.BAD_REQUEST
            })
        }
        cart.products.splice(productIndex, 1);
        return this.dao.update(cid, cart);
    }

    updateProducts = async (cid, body) => {
        const cart = await this.dao.getById(cid);
        cart.products = body;
        return await this.dao.update(cid, cart);
    }

    updateQuantity = async (cid, pid, quantity) => {
        const cart = await this.dao.getById(cid);
        const product = cart.products.find(p => p.product == pid);
        if (!product) {
            CustomError.createError({
                name: "Reference error",
                message: "There is no product with that id in the cart",
                code: EErros.BAD_REQUEST
            })
        }
        if (!quantity) {
            CustomError.createError({
                name: "Reference error",
                message: 'The entered property is not valid. You must follow the format: {quantity: Number}',
                code: EErros.BAD_REQUEST
            })
        }
        product.quantity = quantity;
        return await this.dao.update(cid, cart);
    }

    clearProducts = async (cid) => {
        const cart = await this.dao.getById(cid);
        cart.products = [];
        return await this.dao.update(cid, cart);
    }

    purchase = async (cid, user) => {
        const unavailableProducts = [];
        const purchasedProducts = [];
        let total = 0;
        const cart = await this.dao.getById(cid);
        if (cart.products.length == 0) {
            CustomError.createError({
                name: "Request Error",
                message: 'The cart is empty.',
                code: EErros.BAD_REQUEST
            })
        }
        for (let i = 0; i < cart.products.length; i++) {
            let pid = cart.products[i].product.toString();
            let product = await productService.getById(pid);
            let productInCart = cart.products[i];
            if (product.stock < productInCart.quantity) {
                unavailableProducts.push(productInCart);
            } else {
                product.stock -= productInCart.quantity;
                total += product.price * productInCart.quantity;
                purchasedProducts.push(productInCart);
                await productService.update(pid, { stock: product.stock });
            }
        }
        cart.products = unavailableProducts;
        await this.dao.update(cid, cart);
        const tickets = await ticketModel.find();
        if (purchasedProducts.length !== 0) {
            let newTicket;
            if (tickets.length === 0) {
                newTicket = await ticketModel.create({
                    code: '1',
                    purchase_datetime: Date.now(),
                    amount: total,
                    purchaser: user.first_name,
                });
            } else {
                const lastCode = tickets[tickets.length - 1].code;
                const newCode = (parseInt(lastCode) + 1);
                newTicket = await ticketModel.create({
                    code: newCode,
                    purchase_datetime: Date.now(),
                    amount: total,
                    purchaser: user.first_name,
                });
            }
            const html = `<h1>¡Compra realizada con éxito!</h1><br>
                        <p>Hola ${newTicket.purchaser}, nos comunicamos contigo para informarte que tu proceso de compra se ha realizado correctamente. A continuación te dejamos los datos correspondientes a tu compra:</p>
                        <p>Horario de la compra: ${newTicket.purchase_datetime}<p>
                        <p>Código del ticket: ${newTicket.code}<p>
                        <p>Importe total: $${newTicket.amount}</p><br>
                        <h2>¡Gracias por tu compra!</h2>`
            await userService.sendMail(user.email, 'Ticket de compra realizado', html)
            return {
                ticket: newTicket,
                new_cart: cart,
                unavailable_products: unavailableProducts
            }
        } else {
            return {
                status: "error",
                message: 'Insufficient stock.',
                unavailable_products: unavailableProducts
            }
        }
    }
}
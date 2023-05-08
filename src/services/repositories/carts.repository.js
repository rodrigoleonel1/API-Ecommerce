import ticketModel from "../../dao/mongo/models/ticket.model.js"
import { productService } from "../index.repository.js"

export default class CartsRepository{
    constructor(dao){
        this.dao = dao
    }

    getCarts = async () =>{
        return await this.dao.getAll()
    }

    getCartById = async (cid) => {
        return await this.dao.getByIdPopulate(cid)
    }

    getById = async (cid) => {
        return await this.dao.getById(cid)
    }

    createCart = async() =>{
        let cartCreated = await this.dao.create()
        return cartCreated
    }

    addProduct = async (cid, pid) =>{
        const cartToUpdate = await this.dao.getById(cid)
        if (!cartToUpdate) return null
        const product = cartToUpdate.products.find( p => p.product == pid)
        if(!product){
            cartToUpdate.products.push({product: pid, quantity: 1})
            await this.dao.update(cid, cartToUpdate)
            return cartToUpdate
        } else {
            product.quantity++
            await this.dao.update(cid, cartToUpdate)
            return cartToUpdate
        }
    }

    deleteProduct = async(cid, pid) =>{
        const cart = await this.dao.getById(cid)
        const productIndex = cart.products.findIndex(p => p.product == pid)
        if (productIndex <= 0) return null
        cart.products.splice(productIndex, 1)
        await this.dao.update(cid, cart)
        return cart
    }

    updateCart = async(cid, body) =>{
        const cart = await this.dao.getById(cid)
        cart.products = body
        await this.dao.update(cid, cart)
        return cart
    }

    updateQuantity = async (cid, pid, body) =>{
        const cart = await this.dao.getById(cid)
        if (!cart) return null
        const product = cart.products.find( p => p.product == pid)
        if (!product) return null
        product.quantity = body
        await this.dao.update(cid, cart)
        return cart
    }

    clearCart = async (cid) =>{
        const cart = await this.dao.getById(cid)
        if (!cart) return null
        cart.products = []
        await this.dao.update(cid, cart)
        return cart
    }

    deleteCart = async(cid) =>{
        return await this.dao.delete(cid)
    }

    completePurchase = async (cid, user) =>{
        const unavailableProducts = []
        const purchasedProducts = []
        let total = 0
        const cart = await this.dao.getById(cid)
        for(let i = 0; i < cart.products.length ; i++){
            let pid = cart.products[i].product.toString()
            let product = await productService.getProductById(pid)
            let productInCart = cart.products[i]
            if (product.stock < productInCart.quantity) {
                unavailableProducts.push(productInCart)
            } else {
                product.stock -= productInCart.quantity
                total += product.price * productInCart.quantity
                purchasedProducts.push(productInCart)
                await productService.updateProduct(pid, product)
            }
        }
        cart.products = unavailableProducts
        await this.dao.update(cid, cart)
        const tickets = await ticketModel.find()
        if (purchasedProducts.length !== 0) {
            let newTicket;
            if (tickets.length === 0) {
                newTicket = await ticketModel.create({ 
                    code: '1',
                    purchase_datetime: Date.now(),
                    amount: total,
                    purchaser: user,
                });
            } else {
                const lastCode = tickets[tickets.length - 1].code;
                const newCode = (parseInt(lastCode) + 1)
                newTicket = await ticketModel.create({ 
                    code: newCode,
                    purchase_datetime: Date.now(),
                    amount: total,
                    purchaser: user,
                });
            }
            return {
                status: "success",
                message: 'Purchase success.',
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
import CartsDao from "../dao/cartsDao.js"

export default class cartsService{
    constructor(){
        this.cartsDao = new CartsDao()
    }

    getCarts = async () =>{
        return await this.cartsDao.getAll()
    }

    getCartById = async (cid) => {
        return await this.cartsDao.getByIdPopulate(cid)
    }

    getById = async (cid) => {
        return await this.cartsDao.getById(cid)
    }

    createCart = async() =>{
        let cartCreated = await this.cartsDao.create()
        return cartCreated
    }

    addProduct = async (cid, pid) =>{
        const cartToUpdate = await this.cartsDao.getById(cid)
        if (!cartToUpdate) return null
        const product = cartToUpdate.products.find( p => p.product == pid)
        if(!product){
            cartToUpdate.products.push({product: pid, quantity: 1})
            await this.cartsDao.update(cid, cartToUpdate)
            return cartToUpdate
        } else {
            product.quantity++
            await this.cartsDao.update(cid, cartToUpdate)
            return cartToUpdate
        }
    }

    deleteProduct = async(cid, pid) =>{
        const cart = await this.cartsDao.getById(cid)
        const productIndex = cart.products.findIndex(p => p.product == pid)
        if (productIndex <= 0) return null
        cart.products.splice(productIndex, 1)
        await this.cartsDao.update(cid, cart)
        return cart
    }

    updateCart = async(cid, body) =>{
        const cart = await this.cartsDao.getById(cid)
        cart.products = body
        await this.cartsDao.update(cid, cart)
        return cart
    }

    updateQuantity = async (cid, pid, body) =>{
        const cart = await this.cartsDao.getById(cid)
        if (!cart) return null
        const product = cart.products.find( p => p.product == pid)
        if (!product) return null
        product.quantity = body
        await this.cartsDao.update(cid, cart)
        return cart
    }

    clearCart = async (cid ) =>{
        const cart = await this.cartsDao.getById(cid)
        if (!cart) return null
        cart.products = []
        await this.cartsDao.update(cid, cart)
        return cart
    }

    deleteCart = async(cid) =>{
        return await this.cartsDao.delete(cid)
    }
}
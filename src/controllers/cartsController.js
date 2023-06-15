import { cartService }  from '../services/index.repository.js'

// GET/api/carts/
const getCarts = async (req, res) =>{
    try {
        const carts = await cartService.getCarts()
        res.status(200).json( { status: 'success', carts })
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message})
    }
}

// POST/api/carts
const createCart = async (req, res) =>{
    try {
        const newCart = await cartService.createCart()
        res.status(200).json({status: "success", message: "Cart created", newCart})
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message})
    }
}

// GET/api/carts/:cid
const getCart = async (req, res) =>{
    try {
        const cid = req.params.cid
        const cart = await cartService.getCartById(cid)
        if (!cart) return res.status(400).json({ status: "error", message: 'Cart not found'})
        res.status(200).json(cart)
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no cart with that ID'})
        res.status(400).json({ status: "error", message: error.message})
    }
}

// POST/api/carts/:cid/product/:pid
const addToCart = async (req, res) =>{
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cart = await cartService.addProduct(cid, pid)
        if (!cart) return res.status(400).json({ status: "error", message: 'Cart not found'})
        res.status(200).json({ status: "success", message: 'The product has been updated in the cart', cart})
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no cart with that ID'})
        res.status(400).json({ status: "error", message: error.message})
    }
}

// DELETE/api/carts/:cid/products/:pid
const deleteCartProduct = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cart = await cartService.deleteProduct(cid, pid)
        if (!cart) return res.status(400).json({ status: "error", message: 'Product not found'})
        res.status(200).json({ status: "success", message: 'The product has been updated in the cart', cart})
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no cart with that ID'})
        res.status(400).json({ status: "error", message: error.message})
    }
}

// PUT/api/carts/:cid
const updateCartProducts = async (req, res) => {
    try {
        const cid = req.params.cid
        const body = req.body
        const cart = await cartService.updateCart(cid, body)
        res.status(200).json({ status: "success", cart})
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no cart with that ID'})
        res.status(400).json({ status: "error", message: error.message})
    }
}

// PUT/api/carts/:cid/products/:pid
const updateProductQuantity = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const body = req.body.quantity
        const cart = await cartService.updateQuantity(cid, pid, body)
        if (!cart) return res.status(400).json({ status: "error", message: 'Quantity could not be updated'})
        res.status(200).json({ status: "success", message: "Quantity updated", cart})
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no cart with that ID'})
        res.status(400).json({ status: "error", message: error.message})
    }
}

// DELETE/api/carts/:cid
const deleteCartProducts = async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await cartService.clearCart(cid)
        if (!cart) return res.status(400).json({ status: "error", message: 'Cart not found'})
        res.status(200).json({ status: "success", message: "Products deleted", cart})
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no cart with that ID'})
        res.status(400).json({ status: "error", message: error.message})
    }
}

// DELETE/api/carts/cart/:cid
const deleteCart = async (req, res) =>{
    try {
        const cid = req.params.cid
        const cart = await cartService.deleteCart(cid)
        if (!cart) return res.status(400).json({ status: "error", message: 'Cart not found'})
        res.status(200).json({ status: "success", message: "Cart deleted", cart})
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no cart with that ID'})
        res.status(400).json({ status: "error", message: error.message})
    }
}

// POST/api/carts/:cid/purchase
const purchaseCart = async (req, res) =>{
    try {
        const cid = req.params.cid
        const user = req.user
        const ticket = await cartService.completePurchase(cid, user.first_name);
        if(!ticket)  return res.json({status: "error", message: 'The purchase could not be made'})
        return res.json({ticket})
    } catch (error) {
        console.log(error)
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no cart with that ID'})
        res.status(400).json({ status: "error", message: error.message})
    }
}

export { createCart, getCart, addToCart, deleteCartProduct, updateCartProducts, updateProductQuantity, deleteCartProducts, getCarts, deleteCart, purchaseCart } 
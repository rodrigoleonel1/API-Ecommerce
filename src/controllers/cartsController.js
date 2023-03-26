import cartModel from '../dao/models/cart.model.js'
import { saveFsData, cartsPath } from '../dao/fs/helpers/saveFsData.js'

// POST/api/carts
const createCart = async (req, res) =>{
    const newCart = await cartModel.create({})
    res.status(201).json({status: "success", message: "Cart created", newCart})
    saveFsData(cartModel, cartsPath)
}

// GET/api/carts/:cid
const getCart = async (req, res) =>{
    try {
        const cid = req.params.cid
        const cart = await cartModel.find({_id: cid})
        if (!cart) return res.status(400).json({ status: "error", message: 'Cart not found'})
        res.status(200).json({cart})
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message})
    }
}

// POST/api/carts/:cid/product/:pid
const addToCart = async (req, res) =>{
    const cid = req.params.cid
    const pid = req.params.pid
    const cart = await cartModel.findById(cid)
    const product = cart.products.find( p => p.product == pid)

    if (!cart) return res.status(400).json({ status: "error", message: 'Cart not found'})

    if(!product){
        cart.products.push({product: pid, quantity: 1})
        await cartModel.updateOne({ _id: cid}, cart)
        res.status(200).json({ status: "success", message: 'Product added', cart})
    } else {
        product.quantity++
        await cartModel.updateOne({ _id: cid}, cart)
        res.status(200).json({ status: "success", message: 'Quantity updated', cart})
    }
    saveFsData(cartModel, cartsPath)
}

// DELETE/api/carts/:cid/products/:pid
const deleteCartProduct = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
    
        const cart = await cartModel.findById(cid)
        const productIndex = cart.products.findIndex(p => p.product == pid)
        console.log(productIndex)
        if (productIndex <= 0) return res.status(400).json({ status: "error", message: 'Product not found'})

        cart.products.splice(productIndex, 1)
        await cart.save()
        res.status(200).json({ status: "success", cart})
        saveFsData(cartModel, cartsPath)
    } catch (error) {
        res.status(400).json({ status: "error", message: 'Cart not found'})
    }
}

// PUT/api/carts/:cid
const updateCartProducts = async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await cartModel.findById(cid)
        cart.products = req.body
        await cart.save()
        res.status(200).json({ status: "success", cart})
        saveFsData(cartModel, cartsPath)
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message})
    }
}

// PUT/api/carts/:cid/products/:pid
const updateProductQuantity = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cart = await cartModel.findById(cid)
        const product = cart.products.find( p => p.product == pid)
        product.quantity = req.body.quantity
        await cart.save()
        res.status(200).json({ status: "success", message: "Quantity updated", cart})
        saveFsData(cartModel, cartsPath)
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message})
    }
}

// DELETE/api/carts/:cid
const deleteCartProducts = async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await cartModel.findById(cid)
        cart.products = []
        await cart.save()
        res.status(200).json({ status: "success", message: "Products deleted", cart})
        saveFsData(cartModel, cartsPath)
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message})
    }
}

export { createCart, getCart, addToCart, deleteCartProduct, updateCartProducts, updateProductQuantity, deleteCartProducts } 
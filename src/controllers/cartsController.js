import fs from 'fs'
import cartsModel from '../dao/models/carts.models.js'

const createCart = async (req, res) =>{
    await cartsModel.create({
        products: []
    })
    res.status(201).json({status: "success", message: "Cart created"})
    let carrito = await cartsModel.find().lean().exec()
    fs.writeFileSync('./src/data/carrito.json', JSON.stringify(carrito, null, 2))
}

const getCart = async (req, res) =>{
    const { cid } = req.params
    if (cid.match(/^[0-9a-fA-F]{24}$/)) {
        const cart = await cartsModel.find({_id: cid}).lean().exec()
        if (!cart){
            res.status(400).json({ status: "error", message: 'Cart not found'})
        } else {
            res.status(200).json(cart)
        }
    } else {
        res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
    }
}

const addToCart = async (req, res) => {
    const { cid, pid } = req.params
    if (cid.match(/^[0-9a-fA-F]{24}$/)){
        if (pid.match(/^[0-9a-fA-F]{24}$/)){
            let carrito = await cartsModel.find().lean().exec()
            let cart = await cartsModel.findOne({_id: cid})
            const product = cart.products.find( p => p.product == pid)
            if (!cart){
                res.status(400).json({ status: "error", message: 'Cart not found'})
            } else {
                if(!product){
                    cart.products.push({product: pid, quantity: 1})
                    await cartsModel.updateOne({ _id: cid}, cart)
                    res.status(200).json({ status: "success", message: 'Product added'})
                    carrito = await cartsModel.find().lean().exec()
                    fs.writeFileSync('./src/data/carrito.json', JSON.stringify(carrito, null, 2))
                } else {
                    product.quantity++
                    await cartsModel.updateOne({ _id: cid}, cart)
                    res.status(200).json({ status: "success", message: 'Quantity updated'})
                    carrito = await cartsModel.find().lean().exec()
                    fs.writeFileSync('./src/data/carrito.json', JSON.stringify(carrito, null, 2))
                }
            }
        } else {
            res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
        } 
    } else {
        res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
    }
}

const deleteCartProduct = async (req, res) => {
    const { cid, pid } = req.params
    if (cid.match(/^[0-9a-fA-F]{24}$/)){
        if (pid.match(/^[0-9a-fA-F]{24}$/)){
            let cart = await cartsModel.findOne({_id: cid})
            if(!cart){
                res.status(400).json({ status: "error", message: 'Cart not found'})
            } else {
                const product = cart.products.find( p => p.product == pid)
                if(!product){
                    res.status(400).json({ status: "error", message: 'Product not found'})
                } else{
                    let productIndex = cart.products.indexOf(product)
                    cart.products.splice(productIndex, 1)
                    await cartsModel.updateOne({ _id: cid}, cart)
                    res.status(200).json({ status: "success", cart})
                    let carrito = await cartsModel.find().lean().exec()
                    fs.writeFileSync('./src/data/carrito.json', JSON.stringify(carrito, null, 2))
                }
            }
        } else {
            res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
        } 
    } else {
        res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
    }
}

const updateCartProducts = async (req, res) => {
    const { cid } = req.params
    if (cid.match(/^[0-9a-fA-F]{24}$/)) {
        const cart = await cartsModel.findOne({_id: cid}).lean().exec()
        if (!cart){
            res.status(400).json({ status: "error", message: 'Cart not found'})
        } else {
            cart.products = req.body
            await cartsModel.updateOne({_id: cid}, cart)
            res.status(200).json({ status: "success", message: "Products updated" })
            let carrito = await cartsModel.find().lean().exec()
            fs.writeFileSync('./src/data/carrito.json', JSON.stringify(carrito, null, 2))
        }
    } else {
        res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
    }
}

const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params
    if (cid.match(/^[0-9a-fA-F]{24}$/)){
        if (pid.match(/^[0-9a-fA-F]{24}$/)){
            const cart = await cartsModel.findOne({_id: cid})
            if(!cart){
                res.status(400).json({ status: "error", message: 'Cart not found'})
            } else {
                const product = cart.products.find( p => p.product == pid)
                if(!product){
                    res.status(400).json({ status: "error", message: 'Product not found'})
                } else{
                    if(!req.body.quantity){
                        res.status(400).json({ status: "error", message: 'Quantity not found'})
                    } else {
                        product.quantity = req.body.quantity
                        await cartsModel.updateOne({ _id: cid}, cart)
                        res.status(200).json({ status: "success", message: "Quantity updated"})
                        let carrito = await cartsModel.find().lean().exec()
                        fs.writeFileSync('./src/data/carrito.json', JSON.stringify(carrito, null, 2))
                    }
                }
            }
        } else {
            res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
        } 
    } else {
        res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
    }
}

const deleteCartProducts = async (req, res) => {
    const { cid } = req.params
    if (cid.match(/^[0-9a-fA-F]{24}$/)) {
        const cart = await cartsModel.findOne({_id: cid}).lean().exec()
        if (!cart){
            res.status(400).json({ status: "error", message: 'Cart not found'})
        } else {
            cart.products = []
            await cartsModel.updateOne({_id: cid}, cart)
            res.status(200).json({ status: "success", message: "Products deleted" })
            let carrito = await cartsModel.find().lean().exec()
            fs.writeFileSync('./src/data/carrito.json', JSON.stringify(carrito, null, 2))
        }
    } else {
        res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
    }
}

export { createCart, getCart, addToCart, deleteCartProduct, updateCartProducts, updateProductQuantity, deleteCartProducts } 
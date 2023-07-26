import { cartService } from '../services/index.repository.js';

// POST/api/carts
const createCart = async (req, res, next) => {
    try {
        const newCart = await cartService.create();
        res.status(200).json({ status: "success", message: "Cart created", payload: newCart });
    } catch (error) {
        next(error);
    }
}

// GET/api/carts/:cid
const getCart = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const cart = await cartService.getPopulated(cid);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        next(error);
    }
}

// POST/api/carts/:cid/product/:pid
const addProduct = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const user = req.user;
        const cart = await cartService.addProduct(cid, pid, user);
        res.status(200).json({ status: "success", message: "The product has been updated in the cart", payload: cart });
    } catch (error) {
        next(error);
    }
}

// DELETE/api/carts/:cid/products/:pid
const deleteProduct = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await cartService.deleteProduct(cid, pid);
        res.status(200).json({ status: "success", message: "The product has been removed from the cart", payload: cart });
    } catch (error) {
        next(error);
    }
}

// PUT/api/carts/:cid
const updateProducts = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const body = req.body;
        const cart = await cartService.updateProducts(cid, body);
        res.status(200).json({ status: "success", message: "The products has been updated in the cart", payload: cart })
    } catch (error) {
        next(error);
    }
}

// PUT/api/carts/:cid/products/:pid
const updateQuantity = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
        const cart = await cartService.updateQuantity(cid, pid, quantity);
        res.status(200).json({ status: "success", message: "Quantity updated", payload: cart })
    } catch (error) {
        next(error);
    }
}

// DELETE/api/carts/:cid
const deleteProducts = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const cart = await cartService.clearProducts(cid);
        res.status(200).json({ status: "success", message: "The products has been removed from the cart", payload: cart })
    } catch (error) {
        next(error);
    }
}

// POST/api/carts/:cid/purchase
const purchaseCart = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const user = req.user;
        const ticket = await cartService.purchase(cid, user);
        return res.status(200).json({ status: "success", message: 'Purchase success', payload: ticket })
    } catch (error) {
        next(error);
    }
}

export default {
    createCart,
    getCart,
    addProduct,
    deleteProduct,
    updateProducts,
    updateQuantity,
    deleteProducts,
    purchaseCart
} 
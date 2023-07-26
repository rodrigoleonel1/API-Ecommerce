import { productService } from '../services/index.repository.js';

// GET/api/products
const getProducts = async (req, res, next) => {
    try {
        req.query.controller = 'api';
        const products = await productService.getAll(req.query);
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        next(error);
    }
}

// GET/api/products/:pid
const getProductById = async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const product = await productService.getById(pid);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        next(error);
    }
}

// POST/api/products
const createProduct = async (req, res, next) => {
    try {
        const product = req.body;
        if (req.user?.role == 'premium') product.owner = req.user._id;
        const productCreated = await productService.create(product);
        res.status(200).json({ status: "success", message: "Product created", payload: productCreated });
    } catch (error) {
        next(error);
    }
}

// PUT/api/products/:pid
const updateProduct = async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const productToUpdate = req.body;
        const product = await productService.update(pid, productToUpdate);
        res.status(200).json({ status: "success", message: "Product updated", payload: product });
    } catch (error) {
        next(error);
    }
}

// DELETE/api/products/:pid
const deleteProduct = async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const user = req.user;
        const productDeleted = await productService.delete(pid, user);
        return res.status(200).json({ status: "success", massage: "Product deleted", payload: productDeleted });
    } catch (error) {
        next(error);
    }
}

// GET/api/products/mockingProducts
const getMockingProducts = async (req, res, next) => {
    try {
        const products = productService.generateMock();
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        next(error);
    }
}

export default {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getMockingProducts
} 
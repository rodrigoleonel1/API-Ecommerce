import Errors from '../services/errors/enums.js'
import CustomError from '../services/errors/CustomError.js'
import { generateErrorInfo } from '../services/errors/info.js'
import { productService }  from '../services/index.repository.js'
import handleError from '../middlewares/error.js'

// GET/api/products
const getProducts = async (req, res) =>{
    try {
        const limit = req.query?.limit || 10
        const page = req.query?.page || 1
        let sort = req.query.sort
        let query = {}
        if(req.query.category || req.query.status) query = req.query
        let controllerType = 'api'
        let products = await productService.getProductsPaginated(query, page, limit, sort, controllerType)
    
        if(products.totalDocs === 0) return res.status(200).json( { status: 'error', products })
        res.status(200).json( { status: 'success', products })
    } catch (error) {
        return res.status(400).json({ status: "error", message: error.message})
    }
}

// GET/api/products/:pid
const getProductById = async (req, res) =>{
    try {
        const pid = req.params.pid
        const product = await productService.getProductById(pid)
        if (!product) return res.status(400).json({ status: "error", message: 'Product not found'})
        res.status(200).json( product )
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no product with that ID'})
        return res.status(400).json({ status: "error", message: error.message})
    }
}

// POST/api/products
const createProduct = async (req, res) =>{
    try {
        const newProduct = req.body
        if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.status || !newProduct.stock || !newProduct.category || !newProduct.thumbnail) {
            CustomError.createError({
                name: "Product creation error",
                cause: generateErrorInfo(newProduct),
                message: "Error trying to create a product",
                code: Errors.INVALID_TYPES_ERROR
            })
        }
        const productAdded = await productService.createProduct(newProduct)
        if(productAdded == null) return res.status(400).json({ status: "error", message: 'There is already a product with that code'})
        res.status(201).json({status: "success", message: "Product created", productAdded})
    } catch (error){
        handleError(error, res)
    }
}

// PUT/api/products/:pid
const updateProduct = async (req, res) =>{
    try {
        const pid = req.params.pid
        const productToUpdate = req.body
        const product = await productService.updateProduct(pid, productToUpdate)
        if(product === null) return res.status(400).json({ status: "error", message: 'Product not found'})
        res.status(200).json({ status: "success", message: "Product updated", productToUpdate })
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no product with that ID'})
        res.status(400).json({ status: "error", message: error.message})
    }
}

// DELETE/api/products/:pid
const deleteProduct = async (req, res) =>{
    try {
        const pid = req.params.pid
        const productDeleted = await productService.deleteProduct(pid)
        if(productDeleted.deletedCount === 0)  return res.status(400).json({ status: "error", message: 'Product not found'})
        res.status(200).json({ status: "Success", massage: "Product deleted", productDeleted })
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no product with that ID'})
        res.status(400).json({ status: "error", message: 'Product not deleted', error: error})
    }
}

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct } 
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
    
        if(products.totalDocs === 0) return res.status(400).json( { status: 'error', products })
        res.status(200).json({ status: 'success', payload: products})
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
        res.status(200).json({status: "success", payload: product})
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no product with that ID'})
        return res.status(400).json({ status: "error", message: error.message})
    }
}

// POST/api/products
const createProduct = async (req, res) =>{
    try {
        const newProduct = req.body
        if(req.user){ newProduct.owner = req.user._id }
        const productAdded = await productService.createProduct(newProduct)
        res.status(200).json({status: "success", message: "Product created", payload: productAdded})
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
        res.status(200).json({ status: "success", message: "Product updated", payload: productToUpdate })
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no product with that ID'})
        res.status(400).json({ status: "error", message: error.message})
    }
}

// DELETE/api/products/:pid
const deleteProduct = async (req, res) =>{
    try {
        const pid = req.params.pid
        const user = req.user
        if(user.role == 'premium'){
            let product = await productService.getProductById(pid)
            if(product.owner != user._id){
                return res.status(400).json({ status: "error", message: "No puedes eliminar este producto porque no eres el owner."})
            }
            const productDeleted = await productService.deleteProduct(pid)
            if(productDeleted.deletedCount === 0)  return res.status(400).json({ status: "error", message: 'Product not found'})
            return res.status(200).json({ status: "Success", massage: "Product deleted", productDeleted })
        }
        const productDeleted = await productService.deleteProduct(pid)
        if(productDeleted.deletedCount === 0)  return res.status(400).json({ status: "error", message: 'Product not found'})
        res.status(200).json({ status: "Success", massage: "Product deleted", productDeleted })
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no product with that ID'})
        res.status(400).json({ status: "error", message: 'Product not deleted', error: error})
    }
}

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct } 
import productModel from '../dao/models/products.model.js'
import { saveFsData, productsPath } from '../dao/fs/helpers/saveFsData.js'

// GET/api/products
const getProducts = async (req, res) =>{

    const limit = req.query?.limit || 10
    const page = req.query?.page || 1

    let query = {}
    if(req.query.category || req.query.status) query = req.query

    let sort = req.query.sort
    let sortBy = null
    if(sort === 'desc') sortBy = {price: -1}
    if(sort === 'asc') sortBy = {price: 1}
    
    const products = await productModel.paginate(query, { page, limit, sort: sortBy, lean: true})
    products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}&sort=${sort}` : ''
    products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}&sort=${sort}` : ''

    if(products.totalDocs === 0){
        res.status(200).json( { status: 'error', products })
    } else {
        res.status(200).json( { status: 'success', products })
    }
}

// GET/api/products/:pid
const getProductById = async (req, res) =>{
    const pid = req.params.pid
    const product = await productModel.findOne({_id: pid})
    if (!product){
        return res.status(400).json({ status: "error", message: 'Product not found'})
    }
    res.status(200).json( product )
}

// POST/api/products
const createProduct = async (req, res) =>{
    try {
        const newProduct = req.body
        let products = await productModel.find().lean().exec()
        if( !newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.status || !newProduct.stock || !newProduct.category ) {
            return res.status(400).json({ status: "error", message: 'Product not complete'})
        }
        if (products.find(e => e.code === newProduct.code)){
            return res.status(400).json({ status: "error", message: 'Code not available'})
        }
        const productAdded = await productModel.create(newProduct)
        res.status(201).json({status: "success", message: "Product created", productAdded})
        saveFsData(productModel, productsPath)
        // products = await productModel.find().lean().exec()
        // fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2))
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: "error", message: 'Product not created'})
    }
}

// PUT/api/products/:pid
const updateProduct = async (req, res) =>{
    try {
        const pid = req.params.pid
        const productToUpdate = req.body

        if( !productToUpdate.title || !productToUpdate.description || !productToUpdate.code || !productToUpdate.price || !productToUpdate.status || !productToUpdate.stock || !productToUpdate.category ){
            return res.status(400).json({ status: "error", message: 'Product not complete'})}
    
        const product = await productModel.findOneAndUpdate({ _id: pid}, productToUpdate)
        if(product === null){
            return res.status(400).json({ status: "error", message: 'Product not found'})
        }        
        saveFsData(productModel, productsPath)
        res.status(200).json({ status: "success", message: "Product updated", productToUpdate })
        // let products = await productModel.find().lean().exec()
        // fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2))
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: "error", message: 'Product not updated'})
    }
}

// DELETE/api/products/:pid
const deleteProduct = async (req, res) =>{
    try {
        const pid = req.params.pid
        const productDeleted = await productModel.deleteOne({_id: pid})

        if(productDeleted.deletedCount === 0){
            return res.status(400).json({ status: "error", message: 'Product not found'})
        }

        res.status(200).json({
            status: "Success",
            massage: "Product deleted",
            productDeleted
        })
        saveFsData(productModel, productsPath)
        // let products = await productModel.find().lean().exec()
        // fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2))

    } catch (error) {
        console.log(error)
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no product with that ID'})
        res.status(400).json({ status: "error", message: 'Product not created', error: error})
    }
}

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct } 
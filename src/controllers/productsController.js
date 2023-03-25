import fs from 'fs'
import productsModel from '../dao/models/products.models.js'

const getProducts = async (req, res) =>{
    let page = parseInt(req.query.page)
    if(!page) page = 1

    let limit = parseInt(req.query.limit)
    if(!limit) limit = 10

    let sort = req.query.sort
    let sortBy = null
    if(sort === 'desc') sortBy = {price: -1}
    if(sort === 'asc') sortBy = {price: 1}

    let query = {}
    if(req.query.category || req.query.status) query = req.query

    const products = await productsModel.paginate(query, { page, limit, sort: sortBy, lean: true})
    products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}` : ''
    products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}` : ''


    if(products.totalDocs === 0){
        res.status(200).json( { status: 'error', products })
    } else {
        res.status(200).json( { status: 'success', products })
    }
}

const getProductById = async (req, res) =>{
    const { pid } = req.params
    if (pid.match(/^[0-9a-fA-F]{24}$/)) {
        const product = await productsModel.findOne({_id: pid}).lean().exec()
        if (!product){
            res.status(400).json({ status: "error", message: 'Product not found'})
        } else {
            res.status(200).json(product)
        }
    } else {
        res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
    }
}

const createProduct = async (req, res) =>{
    let products = await productsModel.find().lean().exec()
    if( !req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.status || !req.body.stock || !req.body.category || !req.body.thumbnail ){
        res.status(400).json({ status: "error", message: 'Product not complete'})
    }else if (products.find(e => e.code === req.body.code)){
        res.status(400).json({ status: "error", message: 'Code not available'})
    }else{
        const newProduct = req.body
        const productGenerated = new productsModel(newProduct)
        await productGenerated.save()
        res.status(201).json({status: "success", message: "Product created"})
        products = await productsModel.find().lean().exec()
        fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2))
    }
}

const updateProduct = async (req, res) =>{
    const { pid } = req.params
    if (pid.match(/^[0-9a-fA-F]{24}$/)) {
        const product = await productsModel.findOne({_id: pid}).lean().exec()
        if (!product){
            res.status(400).json({ status: "error", message: 'Product not found'})
        } else if ( !req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.status || !req.body.stock || !req.body.category || !req.body.thumbnail ){
            res.status(400).json({ status: "error", message: 'Product not complete'})
        } else{
            await productsModel.updateOne(product, { $set: req.body})
            res.status(200).json({ status: "success", message: "Product updated" })
            let products = await productsModel.find().lean().exec()
            fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2))
        }
    } else {
        res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
    }
}

const deleteProduct = async (req, res) =>{
    const { pid } = req.params

    if (pid.match(/^[0-9a-fA-F]{24}$/)) {
        let product = await productsModel.findOne({_id: pid}).lean().exec()
        if( product === null ){
            res.status(400).json({ status: "error", message: "Product not found"})
        } else{
            await productsModel.deleteOne(product).lean().exec()
            res.status(200).json({ status: "success", message: "Product deleted" })
            let products = await productsModel.find().lean().exec()
            fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2))
        }
    } else {
        res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
    }
}

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct } 
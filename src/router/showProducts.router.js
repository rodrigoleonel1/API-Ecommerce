import express from "express"
import productsModel from "../dao/models/products.models.js"

const router = express.Router()

router.get('/', async (req, res) =>{
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
    products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}` : ''
    products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}` : ''

    res.render('products', products)
})

export default router
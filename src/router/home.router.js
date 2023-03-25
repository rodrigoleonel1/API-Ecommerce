import express from "express"
import productsModel from "../dao/models/products.models.js"

const router = express.Router()

router.get('/', async (req, res) =>{
    const products = await productsModel.find().lean().exec()
    res.render('home', {
        title: 'Products',
        products
    })
})

export default router
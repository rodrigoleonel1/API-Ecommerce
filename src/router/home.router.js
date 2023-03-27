import express from "express"
// import productModel from "../dao/models/products.model.js"

const router = express.Router()

router.get('/', async (req, res) =>{
    // const products = await productModel.find().lean().exec()
    // res.render('home', {
    //     title: 'Products',
    //     products
    // })
    res.redirect('/login')
})

export default router
import express from "express"
import cartsModel from "../dao/models/carts.models.js"

const router = express.Router()

router.get('/:cid', async (req, res) =>{
    const { cid } = req.params
    if (cid.match(/^[0-9a-fA-F]{24}$/)) {
        const cart = await cartsModel.findOne({_id: cid}).lean().exec()
        if (!cart){
            res.status(400).json({ status: "error", message: 'Cart not found'})
        } else {
            res.render('cart', {
                title: 'Carrito',
                cart
            })
        }
    } else {
        res.status(400).json({ status: "error", message: 'ID does not have a valid format'})   
    }

})

export default router
import { cartService } from "../../services/index.repository.js"

const getCartView = async (req, res) =>{
    try {
        const cid = req.params.cid
        const cart = await cartService.getById(cid)
        if (!cart) return res.status(400).json({ status: "error", message: 'Cart not found'})
        res.render('cart', {
            title: 'Carrito',
            cart
        })
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ status: "error", message: 'There is no cart with that ID'})
        res.status(400).json({ status: "error", message: error.message})
    }
}


export { getCartView } 
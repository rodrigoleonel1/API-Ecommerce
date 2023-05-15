import { Router } from 'express'
import { createCart, getCart, addToCart, deleteCartProduct, updateCartProducts, updateProductQuantity, deleteCartProducts, getCarts, deleteCart, purchaseCart } from '../controllers/cartsController.js'
import { isUser } from '../middlewares/auth.js'

const router = Router()

router.post('/', createCart)

router.get('/:cid', getCart)

router.get('/', getCarts)

router.post('/:cid/product/:pid', isUser, addToCart)

router.delete('/:cid/products/:pid', deleteCartProduct)

router.put('/:cid', updateCartProducts)

router.put('/:cid/products/:pid', updateProductQuantity)

router.delete('/:cid', deleteCartProducts)

router.delete('/cart/:cid', deleteCart)

router.post('/:cid/purchase', purchaseCart)


export default router

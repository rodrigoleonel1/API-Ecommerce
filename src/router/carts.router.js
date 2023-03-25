import { Router } from 'express'
import { createCart, getCart, addToCart, deleteCartProduct, updateCartProducts, updateProductQuantity, deleteCartProducts } from '../controllers/cartsController.js'

const router = Router()

router.post('/', createCart)

router.get('/:cid', getCart)

router.post('/:cid/product/:pid', addToCart)

router.delete('/:cid/products/:pid', deleteCartProduct)

router.put('/:cid', updateCartProducts)

router.put('/:cid/products/:pid', updateProductQuantity)

router.delete('/:cid', deleteCartProducts)


export default router

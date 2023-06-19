import  { Router } from 'express'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct} from '../controllers/productsController.js'
import { isAdmin, isPremiumOrAdmin } from '../middlewares/auth.js'

const router = Router()

router.get('/', getProducts)

router.get('/:pid', getProductById)

router.post('/', createProduct)

router.put('/:pid', updateProduct)

router.delete('/:pid', deleteProduct)

export default router
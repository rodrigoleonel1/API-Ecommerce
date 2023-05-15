import  { Router } from 'express'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct} from '../controllers/productsController.js'
import { isAdmin } from '../middlewares/auth.js'

const router = Router()

router.get('/', getProducts)

router.get('/:pid', getProductById)

router.post('/', isAdmin, createProduct)

router.put('/:pid', isAdmin, updateProduct)

router.delete('/:pid', isAdmin, deleteProduct)

export default router
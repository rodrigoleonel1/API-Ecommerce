import  { Router } from 'express'
import { getProductsView } from "../controllers/views/productsViewController.js"

const router = Router()

router.get('/', getProductsView)

export default router
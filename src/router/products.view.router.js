import express from "express"
import { getProductsView } from "../controllers/views/productsViewController.js"

const router = express.Router()

router.get('/', getProductsView)

export default router
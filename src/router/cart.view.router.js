import { Router } from 'express'
import { getCartView } from "../controllers/views/cartViewController.js"
const router = Router()

router.get('/:cid', getCartView )

export default router
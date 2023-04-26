import express from "express"
import { getCartView } from "../controllers/views/cartViewController.js"
const router = express.Router()

router.get('/:cid', getCartView )

export default router
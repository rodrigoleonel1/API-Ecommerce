import  { Router } from 'express'
import { isUser } from '../middleware/auth'
const router = Router()

router.get('/', isUser , ( req, res) => {
    res.render('messages', { title: 'Chat' })
})

export default router


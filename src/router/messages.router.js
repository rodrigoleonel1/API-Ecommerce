import  { Router } from 'express'
const router = Router()

router.get('/', ( req, res) => {
    res.render('messages', { title: 'Chat' })
})

export default router


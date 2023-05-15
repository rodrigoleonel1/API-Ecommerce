import { Router } from 'express'

const router = Router()

router.get('/', async (req, res) =>{
    res.redirect('/login')
})

export default router
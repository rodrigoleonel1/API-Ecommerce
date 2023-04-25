import express from "express"

const router = express.Router()

router.get('/', async (req, res) =>{
    res.redirect('/login')
})

export default router
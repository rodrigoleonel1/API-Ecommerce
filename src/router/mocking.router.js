import { Router } from 'express'
import { generateProducts } from '../utils.js'

const router = Router()

router.get('/', (req, res) =>{
    const products = []
    for (let i = 0; i < 100; i++) {
        products.push(generateProducts())
    }
    res.send({status: 'Success', products})
})

export default router
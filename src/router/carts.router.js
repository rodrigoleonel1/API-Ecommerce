const { Router } = require('express')
const fs = require('fs')

const router = Router()
let carrito = []

idCartGenerator = () =>{
    const count = carrito.length
    if (count === 0){
        return 1
    } else {
        return (carrito[count-1].id) + 1     
    }
}

router.post('/', (req, res) =>{
    const id = idCartGenerator()
    carrito.push( { 
        id: id,
        products: []
    } )
    res.status(201).json({status: "success", message: "Cart created"})
    fs.writeFileSync('./src/router/carrito.json', JSON.stringify(carrito, null, 2))
})

router.get('/:cid', (req, res) =>{
    const { cid } = req.params
    const cart = carrito.find( cart => cart.id.toString() === cid)
    if (!cart){
        res.status(400).json({ status: "error", message: 'Cart not found'})
    } else {
        res.status(200).json({cart})
    }
})


router.post('/:cid/product/:pid', (req, res) =>{
    const { cid, pid } = req.params
    const cart = carrito.find( cart => cart.id.toString() === cid)
    const product = cart.products.find( p => p.product == pid)
    if (!cart){
        res.status(400).json({ status: "error", message: 'Cart not found'})
    } else {
        if(!product){
            cart.products.push({
                product: pid,
                quantity: 1
            })
            res.status(200).json({ status: "success", message: 'Product added'})
            fs.writeFileSync('./src/router/carrito.json', JSON.stringify(carrito, null, 2))
        } else {
            product.quantity++
            res.status(200).json({ status: "success", message: 'Quantity updated'})
            fs.writeFileSync('./src/router/carrito.json', JSON.stringify(carrito, null, 2))
        }
    }
})


module.exports = router

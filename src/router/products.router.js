const { Router } = require('express')
const fs = require('fs')
let products = require('./products.json')

const router = Router()

idProductGenerator = () =>{
    const count = products.length
    if (count === 0){
        return 1
    } else {
        return (products[count-1].id) + 1     
    }
}

router.get('/', (req, res) =>{
    let limit = req.query.limit
    if (!limit){
        res.status(200).json({ products }) 
    } else if (isNaN(limit)){
        res.status(400).json({ status: "error", message: "Para realizar una búsqueda con límite debe ingresar un número." })
    } else {
        let productsFilter = products.slice(0, limit)
        res.status(200).json({ products : productsFilter })
    }
})

router.get('/:pid', (req, res) =>{
    const { pid } = req.params
    const product = products.find( product => product.id.toString() === pid)
    if (!product){
        res.status(400).json({ status: "error", message: 'Product not found'})
    } else {
        res.status(200).json( product )
    }
})

router.post('/', (req, res) =>{
    const id = idProductGenerator()
    if( !req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.status || !req.body.stock || !req.body.category ){
        res.status(400).json({ status: "error", message: 'Product not complete'})
    }else if (products.find(e => e.code === req.body.code)){
        res.status(400).json({ status: "error", message: 'Code not available'})
    }else{
        req.body.id = id
        products.push( req.body )
        res.status(201).json({status: "success", message: "Product created"})
        fs.writeFileSync('./src/router/products.json', JSON.stringify(products, null, 2))
    }
})

router.put('/:pid', (req, res) =>{
    const { pid } = req.params
    const idProduct = products.findIndex( p => p.id == pid)
    if ( idProduct < 0 ){
        res.status(400).json({ status: "error", message: "Product not found"})
    } else if( !req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.status || !req.body.stock || !req.body.category ){
        res.status(400).json({ status: "error", message: 'Product not complete'})
    } else {
        req.body.id = parseInt(pid)
        products[idProduct] = req.body
        res.status(200).json({ status: "success", message: "Product updated" })
        fs.writeFileSync('./src/router/products.json', JSON.stringify(products, null, 2))
    }
})

router.delete('/:pid', (req, res) =>{
    const { pid } = req.params
    const currentLength = products.length
    products = products.filter( p => p.id != pid )
    if( products.length == currentLength ){
        res.status(400).json({ status: "error", message: "Product not found"})
    } else{
        res.status(200).json({ status: "success", message: "Product deleted" })
        fs.writeFileSync('./src/router/products.json', JSON.stringify(products, null, 2))
    }
})

module.exports = router

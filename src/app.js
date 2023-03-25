import express from "express"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import productsRouter from './router/products.router.js'
import cartsRouter from './router/carts.router.js'
import homeRouter from './router/home.router.js'
import { Server } from "socket.io"
import realTimeProductsRouter from './router/realTimeProducts.router.js'
import mongoose from "mongoose"
import productsModel from "./dao/models/products.models.js"
import messagesRouter from './router/messages.router.js'
import messagesModel from "./dao/models/messages.models.js"
import showProductsRouter from './router/showProducts.router.js'
import showCartRouter from './router/showCart.router.js'

const app = express()
const httpServer = app.listen(8080, () => console.log('Server up!'))
const io = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use('/realTimeProducts', express.static(__dirname + '/public'))
app.use('/messages', express.static(__dirname + '/public'))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', homeRouter)
app.use('/realTimeProducts', realTimeProductsRouter)
app.use('/messages', messagesRouter)
app.use('/products', showProductsRouter)
app.use('/cart', showCartRouter)

io.on('connection', async socket =>{
    console.log('Nuevo cliente conectado!')
    let products = await productsModel.find().lean().exec()
    socket.emit('productos', products)
})

io.on('connection', socket =>{
    socket.on('message', async data =>{
        const newMessage = data
        const messageGenerated = new messagesModel(newMessage)
        await messageGenerated.save()
        let messages = await messagesModel.find().lean().exec()
        io.emit('logs', messages)
    })
})

const uri = 'mongodb+srv://ecommercecoder:ecommercecoder@ecommerce.uk3b0az.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.set('strictQuery', false)
mongoose.connect(uri)

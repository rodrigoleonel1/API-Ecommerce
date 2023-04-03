//Dependencies
import express from "express"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import mongoose from "mongoose"
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from "passport";
import initializePassport from "./config/passport.config.js";
//Utils
import __dirname from "./utils.js"
//Routers
import productsRouter from './router/products.router.js'
import cartsRouter from './router/carts.router.js'
import homeRouter from './router/home.router.js'
import realTimeProductsRouter from './router/realTimeProducts.router.js'
import messagesRouter from './router/messages.router.js'
import productsViewRouter from './router/products.view.router.js'
import cartViewRouter from './router/cart.view.router.js'
import sessionsRouter from './router/session.router.js'
//Models
import productModel from "./dao/models/products.model.js"
import messagesModel from "./dao/models/messages.models.js"
// Run servers
const app = express()
const httpServer = app.listen(8080, () => console.log('Server up!'))
const io = new Server(httpServer)

//Uri mongoose
const uri = 'mongodb+srv://ecommercecoder:ecommercecoder@ecommerce.uk3b0az.mongodb.net/ecommerce?retryWrites=true&w=majority'

//Session
app.use(session({
    store: MongoStore.create({
        mongoUrl: uri}),
    secret: 'c0d3r',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Config for express
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
//Path for JS
app.use('/realTimeProducts', express.static(__dirname + '/public'))
app.use('/messages', express.static(__dirname + '/public'))
//Routers
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', homeRouter)
app.use('/realTimeProducts', realTimeProductsRouter)
app.use('/messages', messagesRouter)
app.use('/products', productsViewRouter)
app.use('/cart', cartViewRouter)
app.use('/', sessionsRouter)

//Socket.io
io.on('connection', async socket =>{
    console.log('Nuevo cliente conectado!')
    let products = await productModel.find().lean().exec()
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

//Mongoose
mongoose.set('strictQuery', false)
mongoose.connect(uri)


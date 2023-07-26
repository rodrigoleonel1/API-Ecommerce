//Dependencies
import express from 'express';
import handlebars from "express-handlebars"
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import swaggerUiExpress from 'swagger-ui-express';
import { Server } from "socket.io"
//App imports
import './dao/mongo/connection.mongo.js'
import config from './config/config.js';
import initializePassport from './config/passport.js';
import __dirname from './utils.js';
import logger from './helpers/logger.js';
import { specs } from './helpers/swagger.js';
import errorHandler from './middlewares/error.js';
import { messageService } from './services/index.repository.js';
//Routers imports 
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import sessionsRouter from './routers/sessions.router.js';
import usersRouter from './routers/users.router.js';
import viewsRouter from './routers/views.router.js';
import loggerRouter from './routers/logger.router.js';



const app = express();
const PORT = config.PORT || 8080;
const httpServer = app.listen(PORT, () => logger.info(`Server up at PORT ${PORT}!`));
const io = new Server(httpServer)

io.on('connection', socket => {
    socket.on('message', async data => {
        await messageService.create(data)
        const messages = await messageService.getAll()
        io.emit('logs', messages)
    })
})

app.use(session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.engine('hbs', handlebars.engine({ extname: '.hbs', defaultLayout: 'index.hbs' }));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + "/public"))
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/loggerTest', loggerRouter);
app.use('/', viewsRouter);
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use(errorHandler);

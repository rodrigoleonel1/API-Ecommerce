import { cartService, messageService, productService, userService } from '../services/index.repository.js';

// GET/
const getHome = async (req, res, next) => {
    res.redirect('/login')
}

// GET/chat
const getChat = async (req, res, next) => {
    const user = req.user._doc;
    res.render('chat', {
        user,
        title: 'E-commerce | Chat'
    });
}

// GET/login
const loginView = (req, res) => {
    res.render('sessions/login', {
        title: 'E-commerce | Log-in'
    });
}

// GET/register
const registerView = (req, res) => {
    res.render('sessions/register', {
        title: 'E-commerce | Registrate'
    });
}

// GET/profile
const profileView = (req, res) => {
    const user = req.user._doc;
    res.render('sessions/profile', {
        user,
        title: 'E-commerce | Mi Perfil'
    });
}

// GET/products
const productsView = async (req, res) => {
    try {
        req.query.controller = 'view';
        const user = req.user._doc;
        const products = await productService.getAll(req.query);
        products.docs.forEach(element => {
            element.cid = user.cart.toString()
        });
        res.render('products', {
            products,
            user,
            title: 'E-commerce | Productos'
        })
    } catch (error) {
        res.render('errors/base', {
            error: error.message,
            title: 'E-commerce | Error',
            route: 'login',
            page: 'log-in'
        })
    }
}

// GET/failLogin
const failLoginView = (req, res) => {
    res.render('errors/base', {
        error: 'Error al intentar iniciar sesión. Usuario o contraseña incorrecta.',
        title: 'E-commerce | Fallo al iniciar sesión',
        route: 'login',
        page: 'log-in'
    })
}

//GET/failRegister
const failRegisterView = (req, res) => {
    res.render('errors/base', {
        error: 'Error al intentar registrarse, ya existe un usuario con ese email.',
        title: 'E-commerce | Fallo al registrarse',
        route: 'register',
        page: 'registro'
    })
}

//GET/carts/:cid
const getCartView = async (req, res) => {
    try {
        const cid = req.params.cid;
        let cart = await cartService.getById(cid);
        let products = [];
        for (let index = 0; index < cart.products.length; index++) {
            let pid = cart.products[index].product;
            const product = await productService.getById(pid);
            const productFound = cart.products.find(element => element.product == product._id.toString());
            if (productFound) product.quantity = productFound.quantity;
            product.cid = cid
            products.push(product);
        }
        res.render('cart', {
            products,
            cid,
            title: 'E-commerce | Mi Carrito'
        })
    } catch (error) {
        res.render('errors/base', {
            error: error.message,
            title: 'E-commerce | Error',
            route: 'products',
            page: 'productos'
        })
    }
}

//GET/panel
const getPanelView = async (req, res) => {
    try {
        const users = await userService.getAll();
        res.render('panel', {
            users,
            title: 'E-commerce | Panel de Admin'
        })
    } catch (error) {
        console.log(error)
        res.render('errors/base', {
            error: error.message,
            title: 'E-commerce | Error',
            route: 'products',
            page: 'productos'
        })
    }
}

export default {
    getHome,
    getChat,
    loginView,
    registerView,
    profileView,
    productsView,
    failLoginView,
    failRegisterView,
    getCartView,
    getPanelView
} 
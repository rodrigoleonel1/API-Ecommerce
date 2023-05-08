import { JWT_COOKIE_NAME } from "../config/credentials.js"
import userModel from "../dao/mongo/models/user.model.js"
import UsersDTO from "../dao/DTOs/user.dto.js"

//Register view
const getRegisterView = (req, res) =>{
    res.render('sessions/register')
}

//Register API
const createSession = async (req, res) =>{
    res.redirect('/login')
}

//Fail register view
const failRegisterView = (req, res) =>{
    res.status(401).render('errors/base', {
        error: 'Fail register, user already exist.'   
    })
}

//Login view
const loginView = (req, res) =>{
    res.render('sessions/login')
}

//Login API
const createLogin = async (req, res) =>{
    if(!req.user) return res.status(400).send({status: 'error', error: 'Invalid credentiales'})
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
}

//Fail login view
const failLoginView = (req, res) =>{
    res.status(401).render('errors/base', {
        error: 'Fail login, invalide credentials.'   
    })
}

//Close session API 
const closeSession = (req, res) =>{
    res.clearCookie(JWT_COOKIE_NAME).redirect('/login')
}

//Login API github
const createLoginGithub = async (req, res) =>{
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
}

//Current session
const getCurrentSession = async (req, res) =>{
    try {
        const uid = req.user._id
        let user = await userModel.find({_id: uid}).populate('cart')
        console.log(user.cart)
        if (!user) return res.status(400).json({ status: "error", message: "No user logged in"})
        let {_id, first_name, last_name, email, age, role} = req.user
        user = new UsersDTO({_id, first_name, last_name, email, age, role})
        res.status(200).json({user})
        
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message})
    }
}

export { getRegisterView, createSession, failRegisterView, loginView, createLogin, failLoginView, closeSession, createLoginGithub, getCurrentSession } 
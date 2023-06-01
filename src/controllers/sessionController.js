import { JWT_COOKIE_NAME } from "../config/credentials.js"
import userModel from "../dao/mongo/models/user.model.js"
import UsersDTO from "../dao/DTOs/user.dto.js"
import { userService } from "../services/index.repository.js"
import logger from '../logger.js'
import { createHash, isValidPassword } from "../utils.js";

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
        if (!user) return res.status(400).json({ status: "error", message: "No user logged in"})
        let {_id, first_name, last_name, email, age, role} = req.user
        user = new UsersDTO({_id, first_name, last_name, email, age, role})
        res.status(200).json({user})
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message})
    }
}

//Chage password view
const changePasswordView = (req, res) =>{
    res.render('sessions/changePassword')
}

//Change password API
const changePassword = async (req, res) =>{
    try {
        const email = req.body.email
        let user = await userModel.findOne({email: email})
        if (!user) return res.status(401).render('errors/base', {
            error: 'No existe ningún usuario con ese mail.'   
        })
        let subject = 'Cambio de contraseña.'
        let html = `<h1>Ha solicitado un restablecimiento de su contraseña, haga click en el botón para seguir con el procedimiento.</h1><br><a href="http://localhost:8080/setPassword"><button>Restablecer contraseña</button></a>`
        const result = await userService.sendMail(email, subject, html)
        logger.info(JSON.stringify(result))
        res.redirect('/login')
    } catch (error) {
        logger.error(error)
    }
}

//Set new password View
const setNewPasswordView = async (req, res) =>{
    try {
        res.render('sessions/setNewPassword')
    } catch (error) {
        logger.error(error)
    }
}

//Set new password API
const setNewPassword = async (req, res) =>{
    try {
        const email = req.body.email
        const newPassword = req.body.password
        let user = await userModel.findOne({email: email})
        if (!user) return res.status(401).render('errors/base', { error: 'No existe ningún usuario con ese mail.' })
        if(isValidPassword(user, newPassword)) return res.status(401).render('errors/base', { error: 'Su nueva contraseña es igual a su anterior contraseña, no se puede cambiar.' })
        console.log(user)
        user.password = createHash(newPassword)
        await userModel.findOneAndUpdate({ _id: user._id}, user)
        console.log(user)
        res.redirect('/passwordChanged')
    } catch (error) {
        console.log(error)
    }
}

//Password changed view
const passwordChangedView = async(req, res) =>{
    try {
        res.render('sessions/passwordChanged')
    } catch (error) {
        console.log(error)
    }
}

export { getRegisterView, createSession, failRegisterView, loginView, createLogin, failLoginView, closeSession, createLoginGithub, getCurrentSession, changePasswordView, changePassword, setNewPasswordView, setNewPassword, passwordChangedView } 
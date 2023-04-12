import { Router } from 'express'
import passport from 'passport'
import { JWT_COOKIE_NAME } from '../config/credentials.js'
import userModel from '../dao/models/user.model.js'

const router = Router()

//Register view
router.get('/register', (req, res) =>{
    res.render('sessions/register')
})

//Register API
router.post('/api/sessions/register', passport.authenticate('register', {failureRedirect: '/failRegister'}), async (req, res) =>{
    res.redirect('/login')
})

router.get('/failRegister', (req, res) =>{
    res.send({error: 'failRegister'})
})

//Login view
router.get('/login', (req, res) =>{
    res.render('sessions/login')
})

//Login API
router.post('/api/sessions/login', passport.authenticate('login', {failureRedirect: '/session/failLogin'}),async (req, res) =>{

    if(!req.user){
        return res.status(400).send({status: 'error', error: 'Invalid credentiales'})
    }

    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
})

router.get('/failLogin', (req, res) =>{
    res.send({ error: 'Fail login '})
})

//Close session API 
router.get('/api/sessions/logout', (req, res) =>{
    res.clearCookie(JWT_COOKIE_NAME).redirect('/login')
})

router.get('/api/sessions/github', passport.authenticate('github', { scope: ['user: email']}), (req, res) =>{})

router.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), async (req, res) =>{
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
})

router.get('/api/sessions/current', async (req, res) =>{
    try {
        console.log(req.user)
        const uid = req.user._id
        const user = await userModel.find({_id: uid}).populate('cart')
        if (!user) return res.status(400).json({ status: "error", message: "No user logged in"})
        res.status(200).json({user})
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message})
    }
})


export default router
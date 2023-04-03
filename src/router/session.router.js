import { Router } from 'express'
import passport from 'passport'
import { isValidPassword } from '../utils.js'

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

    let role = 'usuario'
    if(req.user.email == 'adminCoder@coder.com' && isValidPassword(req.user, 'adminCod3r123')){
        role = 'admin'
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: role
    }

    res.redirect('/products')
})

router.get('/failLogin', (req, res) =>{
    res.send({ error: 'Fail login '})
})

//Close session API 
router.get('/api/sessions/logout', (req, res) =>{
    req.session.destroy(error =>{
        if(error) {
            res.status(500).render('errors/base', {
                error: error
            })
        } else{
            res.redirect('/login')
        }
    })
})

router.get('/api/sessions/github', passport.authenticate('github', { scope: ['user: email']}), (req, res) =>{})

router.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), async (req, res) =>{
    console.log('Callback: ', req.user)
    req.session.user = {...req.user._doc, role: "usuario" }
    console.log("User session: ", req.session.user)
    res.redirect('/products')
})


export default router
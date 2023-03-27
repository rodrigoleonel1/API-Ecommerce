import { Router } from 'express'
import userModel from '../dao/models/user.model.js'

const router = Router()

//Register view
router.get('/register', (req, res) =>{
    res.render('sessions/register')
})

//Register API
router.post('/api/sessions/register', async (req, res) =>{
    const newUser = req.body
    const user = new userModel(newUser)
    await user.save()

    res.redirect('/login')
})

//Login view
router.get('/login', (req, res) =>{
    res.render('sessions/login')
})

//Login API
router.post('/api/sessions/login', async (req, res) =>{
    const { email, password } = req.body
    const user = await userModel.findOne({ email, password }).lean().exec()
    if (!user){
        return res.status(401).render('errors/base', {
            error: 'Contraseña o email incorrectos'         
        })
    }

    let role = 'usuario'
    if(user.email == 'adminCoder@coder.com' && user.password == 'adminCod3r123'){
        role = 'admin'
    }

    req.session.user = { ...user, role: role }
    res.redirect('/products')
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

export default router
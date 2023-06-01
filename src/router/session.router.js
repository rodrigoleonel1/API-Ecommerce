import { Router } from 'express'
import passport from 'passport'
import { closeSession, createLogin, createLoginGithub, createSession, failLoginView, failRegisterView, getCurrentSession, getRegisterView, loginView, changePasswordView, changePassword, setNewPassword, setNewPasswordView, passwordChangedView } from '../controllers/sessionController.js'
import { isAdmin } from '../middlewares/auth.js'

const router = Router()

//Register view
router.get('/register', getRegisterView)

//Register API
router.post('/api/sessions/register', passport.authenticate('register', {failureRedirect: '/failRegister'}), createSession)

//Fail register view
router.get('/failRegister', failRegisterView)

//Login view
router.get('/login', loginView)

//Login API
router.post('/api/sessions/login', passport.authenticate('login', {failureRedirect: '/session/failLogin'}), createLogin)

//Fail login view
router.get('/session/failLogin', failLoginView)

//Close session API 
router.get('/api/sessions/logout', closeSession)

//Login API github
router.get('/api/sessions/github', passport.authenticate('github', { scope: ['user: email']}), (req, res) =>{})
router.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), createLoginGithub)

//Current session
router.get('/api/sessions/current', isAdmin, getCurrentSession)

//Change password view
router.get('/changePassword', changePasswordView)

//Change password API
router.post('/api/sessions/changePassword', changePassword)

//Set new password view
router.get('/setPassword', setNewPasswordView)

//Set new password API
router.post('/api/sessions/setPassword', setNewPassword)

//Password changed 
router.get('/passwordChanged', passwordChangedView)

export default router
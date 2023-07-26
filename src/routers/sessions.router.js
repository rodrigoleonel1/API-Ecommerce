import { Router } from 'express';
import passport from 'passport';
import sessionsController from '../controller/sessionsController.js';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/failRegister' }), sessionsController.createRegister);
router.post('/login', passport.authenticate('login', { failureRedirect: '/failLogin' }), sessionsController.createLogin);
router.get('/logout', sessionsController.closeSession);
router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), (req, res) => { });
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/failLogin' }), sessionsController.createLoginGithub);
router.get('/current', sessionsController.currentSession);

export default router;
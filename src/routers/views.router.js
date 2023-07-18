import { Router } from 'express';
import viewsController from '../controller/viewsController.js';
import { passportCall } from '../middlewares/passportCall.js';

const router = Router();

router.get('/', viewsController.getHome);
router.get('/login', viewsController.loginView);
router.get('/register', viewsController.registerView);
router.get('/profile', passportCall('jwt'), viewsController.profileView);
router.get('/products', passportCall('jwt'), viewsController.productsView);
router.get('/chat', passportCall('jwt', 'premiumOrUser'), viewsController.getChat);
router.get('/failLogin', viewsController.failLoginView);
router.get('/failRegister', viewsController.failRegisterView);
router.get('/carts/:cid', passportCall('jwt'), viewsController.getCartView);
router.get('/panel', passportCall('jwt', 'admin'), viewsController.getPanelView);

export default router;
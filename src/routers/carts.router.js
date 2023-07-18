import { Router } from 'express';
import cartsController from '../controller/cartsController.js';
import { passportCall } from '../middlewares/passportCall.js';

const router = Router();

router.post('/', cartsController.createCart);
router.get('/:cid', cartsController.getCart);
router.post('/:cid/product/:pid', passportCall('jwt', 'premiumOrUser'), cartsController.addProduct);
router.delete('/:cid/products/:pid', cartsController.deleteProduct);
router.put('/:cid', cartsController.updateProducts);
router.put('/:cid/products/:pid', cartsController.updateQuantity);
router.delete('/:cid', cartsController.deleteProducts);
router.post('/:cid/purchase', cartsController.purchaseCart);

export default router;
import { Router } from 'express';
import productsController from '../controller/productsController.js';
import { passportCall } from '../middlewares/passportCall.js';

const router = Router();

router.get('/', productsController.getProducts);
router.get('/mockingProducts', productsController.getMockingProducts);
router.get('/:pid', productsController.getProductById);
router.post('/', passportCall('jwt', 'premiumOrAdmin'), productsController.createProduct);
router.put('/:pid', passportCall('jwt', 'admin'), productsController.updateProduct);
router.delete('/:pid', passportCall('jwt', 'premiumOrAdmin'), productsController.deleteProduct);

export default router;
import { Router } from 'express';
import usersController from '../controller/usersController.js';
import { passportCall } from '../middlewares/passportCall.js';
import { upload, fields } from '../middlewares/multer.js';

const router = Router();
router.get('/', usersController.getUsers);
router.delete('/', usersController.deleteUsers);
router.get('/premium/:uid', passportCall('jwt', 'premiumOrUser'), usersController.changeRole);
router.post('/:uid/documents', passportCall('jwt', 'premiumOrUser'), upload.fields(fields), usersController.uploadDocuments);
router.delete('/:uid/documents', passportCall('jwt', 'premiumOrUser'), usersController.deleteDocuments);
router.get('/admin/changeRole/:uid', passportCall('jwt', 'admin'), usersController.adminChangeRole);
router.delete('/admin/deleteUser/:uid', passportCall('jwt', 'admin'), usersController.deleteUser);

export default router;
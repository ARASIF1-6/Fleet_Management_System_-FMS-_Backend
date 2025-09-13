import express from 'express';
import userController from '../../controllers/user/userController.js';
import { upload } from '../../utils/multer.js';
import verifyToken from '../../middlewares/verifytoken.js';


const router = express.Router();

// Middleware to verify token for protected routes
router.use(verifyToken);
// User routes
router.get('/profile', userController.getUser);
router.get('/', userController.getAllUsers);
router.get('/user-search/:query', userController.getUsersByNameOrEmail);
router.get('/filter-role/:role', userController.getUsersByRole);
router.put('/updateUser/:id', upload, userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);


export default router;
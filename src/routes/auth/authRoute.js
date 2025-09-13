import express from 'express';
import authController from '../../controllers/auth/authController.js';
import { upload } from '../../utils/multer.js';
// import verifyToken from '../middlewares/verifytoken.js';


const router = express.Router();

// Public routes
router.post('/registration', upload, authController.registration);
router.post('/send-code', authController.sendCode);
router.post('/resend-code', authController.resendCode);
router.post('/verify-email', authController.verifyEmail);
router.put('/reset-password', authController.resetPassword);
router.post('/login', authController.login);


export default router;
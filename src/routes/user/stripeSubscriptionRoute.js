import express from 'express';
import stripeSubscriptionController from '../../controllers/user/stripeSubscriptionController.js';
import verifyToken from '../../middlewares/verifytoken.js';


const router = express.Router();

// Middleware to verify token for protected routes
router.use(verifyToken);
// subscription routes
router.post('/create-subscription', stripeSubscriptionController.createSubscription);
router.get('/all-subscriptions', stripeSubscriptionController.getAllSubscriptions);
router.get('/all-subscription-by-subscriptionid/:subscriptionId', stripeSubscriptionController.getSubscriptionBySubscriptionId);



export default router;
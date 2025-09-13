// const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY'); // Use your secret key
import stripeSubscriptionService from '../../services/user/stripeSubscriptionService.js';
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const stripeSubscriptionController = {

    async createSubscription(req, res) {
        const { email, paymentMethodId, priceId, useTrial } = req.body;

        try {
            const id = req.user.userId;
            // 1. Create customer
            const customer = await stripe.customers.create({
                email,
                payment_method: paymentMethodId,
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });

            // 2. Prepare subscription params
            const subscriptionParams = {
                customer: customer.id,
                items: [{ price: priceId }],
                expand: ['latest_invoice.payment_intent'],
            };

            // 👇 Add trial only if user chooses it
            if (useTrial) {
                subscriptionParams.trial_period_days = 7;
            }

            // 3. Create subscription
            const subscription = await stripe.subscriptions.create(subscriptionParams);

            // // 3. Create subscription
            // const subscription = await stripe.subscriptions.create({
            //     customer: customer.id,
            //     items: [{ price: priceId }],
            //     expand: ['latest_invoice.payment_intent'],
            // });

            // 4. Save to DB
            const result = await stripeSubscriptionService.addSubscription(id, customer.id, subscription.id, subscription.status, subscription.trial_end, email);

            res.send({
                subscriptionId: subscription.id,
                trialActive: !!subscription.trial_end,
                // clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            });
        } catch (error) {
            res.status(400).send({ error: { message: error.message } });
        }
    },

    // Get all subscriptions
    async getAllSubscriptions(req, res, next) {
        try {
            const results = await stripeSubscriptionService.getAllSubscriptions();
            
            res.status(200).json({
                success: true,
                data: results
            });
        } catch (error) {
            next(error);
        }
    },

    // Get subscription by subscription id
    async getSubscriptionBySubscriptionId(req, res, next) {
        try {
            const { subscriptionId }  = req.params;
            const results = await stripeSubscriptionService.getSubscriptionBySubscriptionId(subscriptionId);
            
            res.status(200).json({
                success: true,
                data: results
            });
        } catch (error) {
            next(error);
        }
    },
};

export default stripeSubscriptionController;

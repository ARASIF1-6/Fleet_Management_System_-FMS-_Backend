import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/error.js";

const prisma = new PrismaClient();

const stripeSubscriptionService = {
    async addSubscription(id, customer, subscriptionId, status, trial_end, email) {
        try {
            // Check if user exists
            const existingUser = await prisma.user.findUnique({ where: { id } });

            if (!existingUser) {
                throw new AppError("User not found", 404);
            }

            let result;

            result = await prisma.subscription.create({
                data: {
                    subscriptionId: subscriptionId,
                    status: status,
                    customerId: customer,
                    customerEmail: email,
                    trialEndsAt: trial_end
                        ? new Date(trial_end * 1000)
                        : null,
                    user: { connect: { id: id } },
                },
            });

            return {
                success: true,
                message: "Subscription processed successfully.",
                data: result,
            };

        } catch (error) {
            console.error("Error in addDocument:", error);
            throw new AppError(`Failed to process request: ${error.message}`, error.statusCode || 400);
        }
    },

    async getAllSubscriptions() {
        try {
            const results = await prisma.subscription.findMany({
                orderBy: { createdAt: 'desc' },
            });

            return {
                results,
            };
        } catch (error) {
            console.error("Error in get all subscriptions:", error);
            throw new AppError(`Failed to process request: ${error.message}`, error.statusCode || 400);
        }
    },

    async getSubscriptionBySubscriptionId(subscriptionId) {
        try {
            const results = await prisma.subscription.findMany({
                where: { subscriptionId },
                orderBy: { createdAt: 'desc' },
            });

            return {
                results,
            };
        } catch (error) {
            console.error("Error in get all subscription:", error);
            throw new AppError(`Failed to process request: ${error.message}`, error.statusCode || 400);
        }
    },
};

export default stripeSubscriptionService;
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Runs every minute for testing;
// cron.schedule('*/1 * * * *', async () => {

// Run daily at 8 AM
cron.schedule('0 8 * * *', async () => {
    console.log('⏰ Running trial check...');

    const now = new Date();

    // Day 6: Trial ends tomorrow → show ending soon banner
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const day6Start = new Date(tomorrow.setHours(0, 0, 0, 0));
    const day6End = new Date(tomorrow.setHours(23, 59, 59, 999));

    const day6Subs = await prisma.subscription.findMany({
        where: {
            trialEndsAt: {
                gte: day6Start,
                lte: day6End,
            },
        },
        include: { user: true },
    });

    for (const sub of day6Subs) {
        await prisma.user.update({
            where: { id: sub.userId },
            data: { showTrialEndingBanner: true },
        });

        console.log(`🔔 Day 6 reminder: ${sub.user.email}`);
    }

    // Day 7: Trial ends today → show "trial ended" banner or email
    const today = new Date();
    const day7Start = new Date(today.setHours(0, 0, 0, 0));
    const day7End = new Date(today.setHours(23, 59, 59, 999));

    const day7Subs = await prisma.subscription.findMany({
        where: {
            trialEndsAt: {
                gte: day7Start,
                lte: day7End,
            },
        },
        include: { user: true },
    });

    for (const sub of day7Subs) {
        await prisma.user.update({
            where: { id: sub.userId },
            data: { showTrialEndedReminder: true }, // New flag
        });

        console.log(`🔔 Day 7 reminder: ${sub.user.email}`);
    }

    console.log('✅ Trial check completed.');
});


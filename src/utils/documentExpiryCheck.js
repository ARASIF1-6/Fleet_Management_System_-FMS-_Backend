import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Runs every minute for testing;
// cron.schedule('*/1 * * * *', async () => {
    
// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running document expiry check...');

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ensure only the date is compared

  try {
    // Find all documents that have expired and are still marked Active
    const expiredDocs = await prisma.document.findMany({
      where: {
        expiryDate: {
          lt: today,
        },
        status: 'Active',
      },
    });

    for (const doc of expiredDocs) {
      const expiredDays = Math.floor(
        (today.getTime() - new Date(doc.expiryDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      await prisma.document.update({
        where: { id: doc.id },
        data: {
          status: 'Expired',
          expiryCount: expiredDays,
        },
      });

      console.log(`Updated document ${doc.id} to Expired with ${expiredDays} expired days`);
    }

    // Also update expiryCount for already expired documents
    const stillExpiredDocs = await prisma.document.findMany({
      where: {
        expiryDate: {
          lt: today,
        },
        status: 'Expired',
      },
    });

    for (const doc of stillExpiredDocs) {
      const expiredDays = Math.floor(
        (today.getTime() - new Date(doc.expiryDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      await prisma.document.update({
        where: { id: doc.id },
        data: {
          expiryCount: expiredDays,
        },
      });

      console.log(`Updated expiryCount for document ${doc.id} to ${expiredDays} days`);
    }

    console.log('Document expiry check complete.');
  } catch (error) {
    console.error('Error during expiry check:', error);
  } finally {
    await prisma.$disconnect();
  }
});


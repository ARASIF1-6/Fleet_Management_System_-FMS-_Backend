import { PrismaClient } from "@prisma/client";
import transporter from "../transporter.js";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

class DocumentReminderService {
    constructor() {
        // Runs every minute for testing; use '0 0 * * *' in production
        this.scheduledJob = cron.schedule('*/1 * * * *', () => {
            console.log(`[${new Date().toLocaleTimeString()}] Cron job triggered`);
            this.checkAndSendReminders();
        }, {
            scheduled: false
        });
    }

    async sendReminderEmail(user, documentType, expiryDate, daysUntilExpiry) {
        const emailBody = `
Dear ${user.name || "User"},

This is a reminder that your **${documentType}** will expire in **${daysUntilExpiry} days** on **${expiryDate.toLocaleDateString()}**.

Please ensure to renew it before the expiry date to remain compliant.

Best regards,  
PantherTaxis Team
`;


        // Nodemailer transporter calling

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: `${documentType} Expiry Reminder - ${daysUntilExpiry} Days Left`,
                text: emailBody,
            });

            console.log(`✅ Reminder email sent to ${user.email} for ${documentType}`);
        } catch (error) {
            console.error(`❌ Failed to send reminder to ${user.email}:`, error);
        }
    }

    async checkAndSendReminders() {
        try {
            const today = new Date();
            const todayDateOnly = new Date(today.toISOString().split("T")[0]); // strip time

            const documents = await prisma.document.findMany({
                include: { user: true, documentType: true }
            });

            for (const doc of documents) {
                const document = { key: doc.documentType.name, expiryDate: doc.expiryDate, lastReminderSent: doc.lastReminderSent };

                if (document.expiryDate){
                    const daysUntilExpiry = Math.ceil((document.expiryDate.getTime() - todayDateOnly.getTime()) / (1000 * 60 * 60 * 24));

                    // Only send reminders at 90 or 30 days
                    if (daysUntilExpiry === 90 || daysUntilExpiry === 30) {
                        const lastSentDateOnly = document.lastReminderSent
                            ? new Date(document.lastReminderSent.toISOString().split("T")[0])
                            : null;

                        // Avoid duplicate reminders for the same threshold
                        if (
                            !lastSentDateOnly ||
                            lastSentDateOnly.getTime() !== todayDateOnly.getTime()
                        ) {
                            await this.sendReminderEmail(doc.user, document.key.toUpperCase(), document.expiryDate, daysUntilExpiry);

                            // Update only the relevant lastReminder field
                            await prisma.document.update({
                                where: { id: doc.id },
                                data: {
                                    lastReminderSent: todayDateOnly,
                                },
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('⚠️ Error checking reminders:', error);
        }
    }

    start() {
        this.scheduledJob.start();
        console.log('✅ Document Reminder Service Started');
    }

    stop() {
        this.scheduledJob.stop();
        console.log('🛑 Document Reminder Service Stopped');
    }

    // async testEmail() {
    //     try {
    //         await transporter.sendMail({
    //             from: process.env.EMAIL_USER,
    //             to: 'your_email@gmail.com',
    //             subject: 'Test Email from PantherTaxis',
    //             text: 'This is a test email to verify your nodemailer configuration.',
    //         });

    //         console.log('✅ Test email sent successfully!');
    //     } catch (error) {
    //         console.error('❌ Test email failed:', error);
    //     }
    // }
}

export default new DocumentReminderService();



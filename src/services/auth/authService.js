import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/error.js";
import generateToken from "../../middlewares/jwt.js"; // Adjust the path as necessary
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import transporter from "../../utils/transporter.js";
import { uploadSingleImage, validateImageFile } from '../../utils/imghelper.js';

dotenv.config();

const prisma = new PrismaClient();

const authService = {

    // Generate 6 digit verification code
    generateVerificationCode(length = 6) {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    // Create user with initial verification
    async registration(userData, files) {
        const { name, email, role, companyName, password, uid, rememberMe = false } = userData;
        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                throw new AppError("User with this email already exists", 412);
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            let uploadResult;

            // ✅ Handle file upload synchronously
            if (files && files.image && files.image.length > 0) {
                // Validate the file before upload
                validateImageFile(files.image[0]);

                // Upload using the utility function
                const fetchResult = await uploadSingleImage(files.image[0]);
                console.log("Upload successful:", fetchResult);

                uploadResult = fetchResult.url;
            } else {
                console.log("No image file provided in the request");
            }


            // Create user
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    role,
                    companyName,
                    uid,
                    password: hashedPassword,
                    profile_pic: uploadResult,
                },
            });

            const token = generateToken(
                user.id,
                user.email,
                user.role,
                rememberMe
            );

            return {
                success: true,
                message: "User registered successfully.",
                token: token,
            };
        } catch (error) {
            throw new AppError(`Registration failed: ${error.message}`, 400);
        }
    },

    // Reset user password
    async sendCode(email) {
        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                throw new AppError("User not found", 404);
            }

            //user have must password
            if (!user.password) {
                throw new AppError("User not registered", 404);
            }

            const code = this.generateVerificationCode();
            const expiryTime = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

            // Create verification record
            await prisma.verification.create({
                data: {
                    email: user.email,
                    userId: user.id,
                    code: parseInt(code, 10), // Ensure code is stored as an integer
                    time: expiryTime,
                    isUsed: false,
                },
            });

            // --- HTML Email Template ---
            const emailHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Verification Code</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; }
                    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden; }
                    .header { background-color: #6a5af9; color: #ffffff; padding: 24px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .content { padding: 32px; text-align: center; color: #333333; }
                    .content p { font-size: 16px; line-height: 1.5; }
                    .code-box { display: inline-block; background-color: #e8e5ff; color: #6a5af9; font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 16px 24px; border-radius: 6px; margin: 20px 0; }
                    .footer { background-color: #f4f4f7; padding: 24px; text-align: center; font-size: 12px; color: #888888; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header"><h1>Verification Required</h1></div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>Please use the following verification code to complete your action. The code is valid for <strong>2 minutes</strong>.</p>
                        <div class="code-box">${code}</div>
                        <p>If you did not request this code, you can safely ignore this email.</p>
                    </div>
                    <div class="footer"><p>&copy; 2025 YourAppName. All rights reserved.</p></div>
                </div>
            </body>
            </html>
            `;

            // --- Updated Mail Options ---
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your Verification Code',
                text: `Your verification code is: ${code}`, // Fallback for non-HTML clients
                html: emailHtml,
            };

            await transporter.sendMail(mailOptions);
            // In production, it's safer not to send the code back in the API response.
            return { success: true, message: 'Verification code sent!' };

        } catch (error) {
            throw new AppError(`Failed to send email: ${error.message}`, 400);
        }
    },

    // Email verification resend
    async resendCode(email) {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                throw new AppError("User not found", 404);
            }

            const code = this.generateVerificationCode();
            const expiryTime = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

            await prisma.verification.create({
                data: {
                    email: user.email,
                    userId: user.id,
                    code: parseInt(code, 10),
                    time: expiryTime,
                    isUsed: false,
                },
            });

            // --- HTML Email Template (same as above) ---
            const emailHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Verification Code</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; }
                    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden; }
                    .header { background-color: #6a5af9; color: #ffffff; padding: 24px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .content { padding: 32px; text-align: center; color: #333333; }
                    .content p { font-size: 16px; line-height: 1.5; }
                    .code-box { display: inline-block; background-color: #e8e5ff; color: #6a5af9; font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 16px 24px; border-radius: 6px; margin: 20px 0; }
                    .footer { background-color: #f4f4f7; padding: 24px; text-align: center; font-size: 12px; color: #888888; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header"><h1>Verification Required</h1></div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>Please use the following verification code to complete your action. The code is valid for <strong>2 minutes</strong>.</p>
                        <div class="code-box">${code}</div>
                        <p>If you did not request this code, you can safely ignore this email.</p>
                    </div>
                    <div class="footer"><p>&copy; 2025 YourAppName. All rights reserved.</p></div>
                </div>
            </body>
            </html>
            `;

            // --- Updated Mail Options ---
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your Verification Code',
                text: `Your verification code is: ${code}`, // Fallback
                html: emailHtml,
            };

            // Nodemailer transporter calling
            // The setImmediate is not necessary here for sending mail, it can be awaited directly.
            await transporter.sendMail(mailOptions);

            return {
                success: true,
                message: "Verification code resent successfully",
            };
        } catch (error) {
            throw new AppError(`Failed to resend verification code in email: ${error.message}`, 400);
        }
    },

    // Verify email code
    async verifyEmail(email, code) {
        try {
            const verification = await prisma.verification.findFirst({
                where: {
                    email,
                    code: parseInt(code),
                    isUsed: false,
                    time: {
                        gte: new Date(),
                    },
                },
            });

            if (!verification) {
                throw new AppError("Invalid or expired verification code", 400);
            }

            await prisma.verification.update({
                where: { id: verification.id },
                data: { isUsed: true },
            });

            return {
                success: true,
                message: "Email verification successful",
            };
        } catch (error) {
            throw new AppError(`Verification failed: ${error.message}`, 400);
        }
    },

    // Reset user password
    async resetPassword(email, newPassword) {
        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                throw new AppError("User not found", 404);
            }

            //user have must password
            if (!user.password) {
                throw new AppError("User not registered", 404);
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            setImmediate(async () => {
                // Update user password
                await prisma.user.update({
                    where: { email },
                    data: { password: hashedPassword },
                });
            });

            return { success: true, message: "Password reset successfully" };
        } catch (error) {
            throw new AppError(`Failed to reset password: ${error.message}`, 400);
        }
    },

    // User login
    async login(email, password, rememberMe = false) {
        try {
            const user = await prisma.user.findUnique({ where: { email } });

            // Check if user exists and has a password before comparing
            if (!user || !user.password) {
                throw new AppError("Invalid email or password", 401);
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                throw new AppError("Invalid email or password", 401);
            }

            const token = generateToken(
                user.id,
                user.email,
                user.role,
                rememberMe
            );

            if (token) {
                const today = new Date();
                const lastLoginDateOnly = new Date(today.toISOString().split("T")[0]); // strip time
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLogin: lastLoginDateOnly },
                });
            }

            return { success: true, message: "Login successful", token };
        } catch (error) {
            throw new AppError(`Failed to login user: ${error.message}`, 400);
        }
    },
};

export default authService;
import authService from '../../services/auth/authService.js';
import AppError from '../../utils/error.js';

const authController = {
    // Register new user
    async registration(req, res, next) {
        try {
            const { name, email, role, companyName, password, uid, rememberMe } = req.body;

            if (!name || !email || !password ) {
                return res.status(400).json({
                    success: false,
                    message: 'Name, email, password are required'
                });
            }

            const result = await authService.registration({ name, email, role, companyName, password, uid, rememberMe }, req.files);

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    // Password reset
    async resetPassword(req, res,next) {
        try {
            const { email, newPassword } = req.body;

            if (!email || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and new password are required'
                });
            }

            const result = await authService.resetPassword(email, newPassword);
            res.status(200).json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            next(error);
        }
    },


    // send reset code to email for forgot password
    async sendCode(req, res, next) {
        try {
            const { email } = req.body;
            console.log("Request body for sendCode: ", req.body);
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email are required'
                });
            }

            const result = await authService.sendCode(email);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    // Resend code
    async resendCode(req, res,next) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is required'
                });
            }

            const result = await authService.resendCode(email);
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    // Verify email with code
    async verifyEmail(req, res,next) {
        try {
            const { email, code } = req.body;

            if (!email || !code) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and verification code are required'
                });
            }

            const result = await authService.verifyEmail(email, code);
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    // User login
    async login(req, res, next) {
        try {
            const { email, password, rememberMe } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            const result = await authService.login(email, password, rememberMe);
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

};

export default authController;
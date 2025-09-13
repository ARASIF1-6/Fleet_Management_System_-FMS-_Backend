import userService from '../../services/user/userService.js';
import AppError from '../../utils/error.js';


const userController = {

    // Get user
    async getUser(req, res,next) {
        try {
            const id  = req.user.userId;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            const user = await userService.getUser(id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all users (admin)
    async getAllUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await userService.getAllUsers(page, limit);
            
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete user
    async deleteUser(req, res, next) {
        try {
            // const id  = req.user.userId;
            const { id }  = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            const result = await userService.deleteUser(id);
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    // Search users by name or email
    async getUsersByNameOrEmail(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            // const { query } = req.params; // Destructuring assignment // This uses object destructuring to extract the query property from req.params and assign it to a variable named query.
            const query = req.params.query; // Direct assignment // This just directly accesses the query property on the req.params object and assigns it to a variable named query.
            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }
            const users = await userService.getUsersByNameOrEmail(query, page, limit);
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            next(error);
        }
    },

    // Search all users by role
    async getUsersByRole(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { role } = req.params;
            if (!role) {
                return res.status(400).json({
                    success: false,
                    message: 'Search role is required'
                });
            }
            const users = await userService.getUsersByRole(role, page, limit);
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            next(error);
        }
    },

    // Update user
    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
         

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            console.log('Update Data:',  req.files);

             console.log('Update Data:', updateData);
            const user = await userService.updateUser(id, updateData, req.files);
            
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
        
            });
        } catch (error) {
            next(error);
        }
    },
};

export default userController;
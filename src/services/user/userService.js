import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/error.js";
import bcryptjs from "bcryptjs";
import { uploadSingleImage, validateImageFile } from '../../utils/imghelper.js';

const prisma = new PrismaClient();

const userService = {
  /**
   * Gets a single user by their ID.
   */
  async getUser(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        showTrialEndingBanner: true,
        showTrialEndedReminder: true,
        dailyChecks: true,
        subscription: true,
        profile_pic: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  },

  /**
   * Gets all users with pagination (for admins).
   */
  async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          companyName: true,
          profile_pic: true,
          showTrialEndingBanner: true,
          showTrialEndedReminder: true,
          dailyChecks: true,
          subscription: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Deletes a user.
   */
  async deleteUser(id) {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return { success: true, message: "User deleted successfully" };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new AppError("User not found", 404);
      }
      throw new AppError(`Failed to delete user: ${error.message}`, 400);
    }
  },

  /**
   * Search users by name or email (case-insensitive, partial match)
  **/
  async getUsersByNameOrEmail(query, page = 1, limit = 10) {
    if (!query) {
      throw new AppError('Search query is required', 400);
    }
    // Add pagination for better performance with large datasets
    // const page = 1;
    // const limit = 20; // Limit results to prevent performance issues
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        profile_pic: true,
        showTrialEndingBanner: true,
        showTrialEndedReminder: true,
        dailyChecks: true,
        subscription: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc' // Order by most recent first
      },
      skip,
      take: limit,
    });
    return {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
      },
    };
  },

  /**
   * Search all users by role (exact match)
  **/
  async getUsersByRole(role, page = 1, limit = 10) {
    if (!role) {
      throw new AppError('Search role is required', 400);
    }
    // Add pagination for better performance with large datasets
    // const page = 1;
    // const limit = 20; // Limit results to prevent performance issues
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      where: {
        role: role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        profile_pic: true,
        showTrialEndingBanner: true,
        showTrialEndedReminder: true,
        dailyChecks: true,
        subscription: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc' // Order by most recent first
      },
      skip,
      take: limit,
    });
    return {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
      },
    };
  },

  async updateUser(id, updateData, files) {
    try {
      console.log("Updating user with ID:", updateData);
      // Validate updateData parameter
      if (!updateData || typeof updateData !== 'object') {
        updateData = {};
      }

      // Check if email is being attempted to be changed
      if (updateData.email) {
        throw new AppError("Email cannot be changed", 400);
      }

      // Check if there's any data to update
      if (Object.keys(updateData).length === 0 && !files) {
        throw new AppError("No valid data provided for update", 400);
      }

      // First, update the non-file and non-password data immediately for responsiveness
      let user;
      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id },
          data: updateData,
        });
      } else {
        user = await prisma.user.findUnique({ where: { id } });
      }

      // Handle file upload in the background
      setImmediate(async () => {
        try {
          // Handle file upload if provided
          if (files) {
            // Check if files.image exists and has at least one file
            if (files.image && files.image.length > 0) {
              // Validate the file before upload
              validateImageFile(files.image[0]);

              // Upload using the utility function
              const uploadResult = await uploadSingleImage(files.image[0]);
              console.log("Upload successful:", uploadResult);

              await prisma.user.update({
                where: { id: user.id },
                data: { profile_pic: uploadResult.url },
              });
            } else {
              console.log("No image file provided in the request");
            }
          }
        } catch (err) {
          console.error("Background update failed:", err);
        }
      });

      return user;
    } catch (error) {
      throw new AppError(`Failed to update user: ${error.message}`, 400);
    }
  },

};



export default userService;
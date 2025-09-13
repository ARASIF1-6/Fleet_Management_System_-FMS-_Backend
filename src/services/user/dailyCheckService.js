import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/error.js";

const prisma = new PrismaClient();

const dailyCheckService = {
  /**
   * Creates a new daily check and its associated item responses in a single transaction.
   */
  async createDailyCheck(checkData, itemResponsesData, userId) {
    return prisma.$transaction(async (tx) => {
      const newCheck = await tx.dailyCheck.create({
        data: {
          ...checkData,
          completedById: userId,
          date: new Date(),
        },
      });

      const responsesToCreate = itemResponsesData.map((response) => ({
        ...response,
        dailyCheckId: newCheck.id,
      }));

      await tx.checklistItemResponse.createMany({
        data: responsesToCreate,
      });
      
      return tx.dailyCheck.findUnique({
        where: { id: newCheck.id },
        include: {
            itemResponses: true,
            completedBy: {
                select: { name: true }
            }
        }
      });
    });
  },
  
  /**
   * Gets a single daily check by its ID.
   */
  async getCheckById(checkId) {
    const check = await prisma.dailyCheck.findUnique({
        where: { id: checkId },
        include: {
            completedBy: { select: { id: true, name: true, email: true }},
            itemResponses: {
                include: {
                    checklistItem: { select: { area: true, requirement: true }}
                }
            }
        }
    });

    if (!check) {
        throw new AppError("Daily check not found", 404);
    }
    return check;
  },

  /**
   * Gets all checks submitted by a specific user with pagination.
   */
  async getAllChecksByUser(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [checks, total] = await Promise.all([
        prisma.dailyCheck.findMany({
            where: { completedById: userId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { completedBy: { select: { name: true }}}
        }),
        prisma.dailyCheck.count({ where: { completedById: userId }})
    ]);

    return {
        checks,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    };
  },

  /**
   * Gets all checks from all users, for admin purposes.
   */
  async getAllChecksAdmin(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [checks, total] = await Promise.all([
        prisma.dailyCheck.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { completedBy: { select: { name: true }}}
        }),
        prisma.dailyCheck.count()
    ]);

    return {
        checks,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    };
  },

  /**
   * Deletes a daily check (typically an admin action).
   */
  async deleteCheck(checkId) {
    try {
        await prisma.dailyCheck.delete({
            where: { id: checkId }
        });
        return { success: true, message: "Daily check deleted successfully." };
    } catch(error) {
        if (error.code === 'P2025') {
            throw new AppError("Daily check not found", 404);
        }
        throw new AppError(`Failed to delete check: ${error.message}`, 400);
    }
  },

  /**
   * Search users by name or email (case-insensitive, partial match)
  **/
  async getUsersByIdOrVehicleOrDateOrStatus(query, page = 1, limit = 10) {
    if (!query) {
      throw new AppError('Search query is required', 400);
    }
    const skip = (page - 1) * limit;

    const users = await prisma.dailyCheck.findMany({
      where: {
        OR: [
          { status: { contains: query, mode: 'insensitive' } },
          { vehicleRegNo: { contains: query, mode: 'insensitive' } },
          { completedById: { contains: query }},
          // { date: { contains: query } },

        ],
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
};

export default dailyCheckService;
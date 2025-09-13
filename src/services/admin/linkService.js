import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/error.js";

const prisma = new PrismaClient();

const linkService = {
  /**
   * Creates a new link.
   * @param {object} linkData - { title, url }
   */
  async createLink(linkData) {
    if (!linkData.title || !linkData.url) {
      throw new AppError("Title and URL are required.", 400);
    }
    return prisma.link.create({
      data: linkData,
    });
  },

  /**
   * Gets all links.
   */
  async getAllLinks() {
    return prisma.link.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Updates a link.
   * @param {string} id - The ID of the link to update.
   * @param {object} updateData - The data to update.
   */
  async updateLink(id, updateData) {
    try {
      return await prisma.link.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new AppError("Link not found", 404);
      }
      throw new AppError(`Failed to update link: ${error.message}`, 400);
    }
  },

  /**
   * Deletes a link.
   * @param {string} id - The ID of the link to delete.
   */
  async deleteLink(id) {
    try {
      await prisma.link.delete({
        where: { id },
      });
      return { success: true, message: "Link deleted successfully." };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new AppError("Link not found", 404);
      }
      throw new AppError(`Failed to delete link: ${error.message}`, 400);
    }
  },
};

export default linkService;
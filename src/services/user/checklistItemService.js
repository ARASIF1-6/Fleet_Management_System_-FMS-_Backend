import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/error.js";

const prisma = new PrismaClient();

const checklistItemService = {
  /**
   * Creates a new checklist item (a question for the form).
   * @param {object} itemData - e.g., { area, requirement, displayOrder }
   */
  async createChecklistItem(itemData) {
    try {
      const newItem = await prisma.checklistItem.create({
        data: itemData,
      });
      return newItem;
    } catch (error) {
      throw new AppError(`Failed to create checklist item: ${error.message}`, 400);
    }
  },

  /**
   * Gets all available checklist items.
   */
  async getAllChecklistItems() {
    const items = await prisma.checklistItem.findMany({
      orderBy: {
        displayOrder: 'asc', // Order items consistently
      },
    });
    return items;
  },
};

export default checklistItemService;
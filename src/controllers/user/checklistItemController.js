import checklistItemService from "../../services/user/checklistItemService.js";

const checklistItemController = {
  // Corresponds to POST /checklist-items
  async handleCreateChecklistItem(req, res) {
    try {
      const newItem = await checklistItemService.createChecklistItem(req.body);
      res.status(201).json(newItem);
    } catch (error)      {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  },

  // Corresponds to GET /checklist-items
  async handleGetAllChecklistItems(req, res) {
    try {
      const items = await checklistItemService.getAllChecklistItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  },
};

export default checklistItemController;
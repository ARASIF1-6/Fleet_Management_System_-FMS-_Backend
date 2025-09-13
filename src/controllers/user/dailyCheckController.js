import dailyCheckService from "../../services/user/dailyCheckService.js";

const dailyCheckController = {
  // POST /checks
  async handleCreateDailyCheck(req, res) {
    try {
      const { itemResponses, ...checkData } = req.body;
      const userId = req.user.userId; // Get user ID from the authenticated token

      if (!itemResponses || !Array.isArray(itemResponses) || itemResponses.length === 0) {
        return res.status(400).json({ message: "Item responses are required and must be an array." });
      }

      const newCheck = await dailyCheckService.createDailyCheck(checkData, itemResponses, userId);
      res.status(201).json(newCheck);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  },

  // GET /checks (gets checks for the logged-in user)
  async handleGetAllChecks(req, res) {
    try {
      const userId = req.user.userId;
      const { page, limit } = req.query;
      const result = await dailyCheckService.getAllChecksByUser(userId, page, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  },

  // Get all daily checks
  async getAllChecksAdmin(req, res, next) {
    try {
      const results = await dailyCheckService.getAllChecksAdmin();

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      next(error);
    }
  },

  // Search users by id or vehicle or date or status
  async getUsersByIdOrVehicleOrDateOrStatus(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const query = req.params.query;
      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }
      const daily_checks = await dailyCheckService.getUsersByIdOrVehicleOrDateOrStatus(query, page, limit);
      res.status(200).json({ success: true, data: daily_checks });
    } catch (error) {
      next(error);
    }
  },

};

export default dailyCheckController;
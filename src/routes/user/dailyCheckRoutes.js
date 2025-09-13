import { Router } from "express";
import dailyCheckController from "../../controllers/user/dailyCheckController.js";
import verifyToken from "../../middlewares/verifytoken.js"; // Import your auth middleware

const router = Router();

// All routes in this file are protected and require a valid token
router.use(verifyToken);

// Create a new daily check
router.post("/", dailyCheckController.handleCreateDailyCheck);

// Get a history of all checks for the logged-in user
router.get("/", dailyCheckController.handleGetAllChecks);
router.get("/all-checks", dailyCheckController.getAllChecksAdmin);
router.get("/all-checks/:query", dailyCheckController.getUsersByIdOrVehicleOrDateOrStatus);

export default router;
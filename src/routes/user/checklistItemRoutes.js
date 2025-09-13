import { Router } from "express";
import checklistItemController from "../../controllers/user/checklistItemController.js";
import verifyToken from "../../middlewares/verifytoken.js"; 

const router = Router();

// Route to get all checklist items (for any logged-in user to see the form)
router.get("/", verifyToken, checklistItemController.handleGetAllChecklistItems);

// Route to create a new checklist item (should be protected for admins only)
router.post("/", verifyToken, checklistItemController.handleCreateChecklistItem);

export default router;
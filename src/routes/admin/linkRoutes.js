import { Router } from "express";
import linkController from "../../controllers/admin/linkController.js";
import verifyToken from "../../middlewares/verifytoken.js";

const router = Router();


router.get("/", verifyToken, linkController.handleGetAllLinks);


router.post("/", verifyToken, linkController.handleCreateLink);

router
  .route("/:id")
  .put(verifyToken, linkController.handleUpdateLink)
  .delete(verifyToken, linkController.handleDeleteLink);

export default router;
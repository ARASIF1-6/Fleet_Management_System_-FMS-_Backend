import express from 'express';
import documentTypeController from '../../controllers/admin/documentTypeController.js';
import verifyToken from '../../middlewares/verifytoken.js';


const router = express.Router();

// Middleware to verify token for protected routes
router.use(verifyToken);
// User routes
router.post('/add-document-type', documentTypeController.addDocumentType);
router.get('/all-document-types', documentTypeController.getAllDocumentTypes);
router.put('/update-document-type/:id', documentTypeController.updateDocumentType);
router.delete('/delete-document-type/:id', documentTypeController.deleteDocumentType);


export default router;
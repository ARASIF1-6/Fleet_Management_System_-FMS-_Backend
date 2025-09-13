import express from 'express';
import documentController from '../../controllers/user/documentController.js';
import { upload } from '../../utils/multer.js';
import verifyToken from '../../middlewares/verifytoken.js';


const router = express.Router();

// Middleware to verify token for protected routes
router.use(verifyToken);
// document routes
router.post('/upload-document', upload, documentController.addDocument);
router.get('/all-documents', documentController.getAllDocuments);
router.get('/all-documents-by-userid', documentController.getAllDocumentsById);
router.put('/update-document/:id', upload, documentController.updateDocument);
router.delete('/delete-document/:id', upload, documentController.deleteDocumentById);


export default router;
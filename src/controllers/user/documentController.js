import documentService from '../../services/user/documentService.js';
import AppError from '../../utils/error.js';


const documentController = {

    // Upload document
    async addDocument(req, res, next) {
        try {
            const id = req.user.userId;
            const { expiryDate, documentTypeId } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            // Validate expiry dates if provided
            if (expiryDate) {
                if (!Date.parse(expiryDate)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid date format. Please use YYYY-MM-DD format`
                    });
                }
            }

            const result = await documentService.addDocument(id, req.files, expiryDate, documentTypeId);

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    // Get all documents
    async getAllDocuments(req, res, next) {
        try {
            const results = await documentService.getAllDocuments();
            
            res.status(200).json({
                success: true,
                data: results
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all documents by id
    async getAllDocumentsById(req, res, next) {
        try {
            const id  = req.user.userId;
            const results = await documentService.getAllDocumentsById(id);
            
            res.status(200).json({
                success: true,
                data: results
            });
        } catch (error) {
            next(error);
        }
    },

    // Update document
    async updateDocument(req, res, next) {
        try {
            const { id }  = req.params;
            const { expiryDate } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Document ID is required'
                });
            }

            // Validate expiry dates if provided
            if (expiryDate) {
                if (!Date.parse(expiryDate)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid date format. Please use YYYY-MM-DD format`
                    });
                }
            }

            const result = await documentService.updateDocument(id, req.files, expiryDate);

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    // Delete document
    async deleteDocumentById(req, res, next) {
        try {
            const { id }  = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Document id is required'
                });
            }

            const result = await documentService.deleteDocumentById(id);
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};

export default documentController;
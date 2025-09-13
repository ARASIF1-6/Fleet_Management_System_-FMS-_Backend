import documentTypeService from '../../services/admin/documentTypeService.js';
import AppError from '../../utils/error.js';

const documentTypeController = {
    // Register new document type
    async addDocumentType(req, res, next) {
        try {
            const { name } = req.body;

            if (!name ) {
                return res.status(400).json({
                    success: false,
                    message: 'Name are required'
                });
            }

            const result = await documentTypeService.addDocumentType(name);

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    // Get all document types
    async getAllDocumentTypes(req, res, next) {
        try {
            const results = await documentTypeService.getAllDocumentTypes();
            
            res.status(200).json({
                success: true,
                data: results
            });
        } catch (error) {
            next(error);
        }
    },

    // Update document type
    async updateDocumentType(req, res, next) {
        try {
            const { id }  = req.params;
            const { name } = req.body;
            if (!id || !name) {
                return res.status(400).json({
                    success: false,
                    message: 'Document type ID and name are required'
                });
            }
            const result = await documentTypeService.updateDocumentType(id, name);
            res.status(200).json({
                success: true,
                message: 'Document type updated successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete document type
    async deleteDocumentType(req, res, next) {
        try {
            const { id }  = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Document type is required'
                });
            }

            const result = await documentTypeService.deleteDocumentType(id);
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

};

export default documentTypeController;
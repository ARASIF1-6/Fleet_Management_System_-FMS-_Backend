import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/error.js";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const documentTypeService = {

    // Create user with initial verification
    async addDocumentType(name) {
        try {
            // Create record in the database
            const result = await prisma.documentType.create({
                data: {
                    name,
                },
            });

            return {
                success: true,
                message: "Document type registered successfully.",
                data: result,
            };
        } catch (error) {
            throw new AppError(`Registration failed: ${error.message}`, 400);
        }
    },

    /**
   * Gets all document type.
   */
    async getAllDocumentTypes() {
        const results = await prisma.documentType.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                createdAt: true,
            },
        });

        return {
            results,
        };
    },

    async updateDocumentType(id, name) {
        try {
            const result = await prisma.documentType.update({
                where: { id },
                data: { name },
            });
            return result;
        } catch (error) {
            throw new AppError(`Failed to update document type: ${error.message}`, 400);
        }
    },

    /**
     * Deletes a document type.
     */
    async deleteDocumentType(id) {
        try {
            await prisma.documentType.delete({
                where: { id },
            });
            return { success: true, message: "Document type deleted successfully" };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new AppError("Document type not found", 404);
            }
            throw new AppError(`Failed to delete document type: ${error.message}`, 400);
        }
    },
};

export default documentTypeService;
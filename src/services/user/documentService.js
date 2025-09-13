import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/error.js";
import { uploadSingleImage } from '../../utils/imghelper.js';

const prisma = new PrismaClient();

const documentService = {
    async addDocument(id, files, expiryDate, documentTypeId) {
        try {
            // Check if user exists
            const existingUser = await prisma.user.findUnique({ where: { id } });

            if (!existingUser) {
                throw new AppError("User not found", 404);
            }

            let file, result;

            // Handle file uploads if files are provided
            if (files) {
                // Upload Badge
                if (files.file && files.file.length > 0) {
                    const fileResult = await uploadSingleImage(files.file[0]);
                    file = fileResult.url;
                    console.log("file upload successful:", fileResult);
                }

                // Add expiry dates if provided
                if (expiryDate) {
                    expiryDate = new Date(expiryDate);
                }

                // Create or update the document with uploaded files and expiry dates
                // await prisma.document.upsert({
                //     where: { userId: id },
                //     create: uploadResults,
                //     update: uploadResults
                // });

                // Create the document with uploaded files and expiry dates
                result = await prisma.document.create({
                    data: {
                        userId: id,
                        documentTypeId,
                        file,
                        expiryDate,
                    },
                });
            }

            return {
                success: true,
                message: "Documents processed successfully.",
                data: result,
            };

        } catch (error) {
            console.error("Error in addDocument:", error);
            throw new AppError(`Failed to process request: ${error.message}`, error.statusCode || 400);
        }
    },

    async getAllDocuments() {
        try {
            const results = await prisma.document.findMany({
                orderBy: { createdAt: 'desc' },
            });

            return {
                results,
            };
        } catch (error) {
            console.error("Error in get all documents:", error);
            throw new AppError(`Failed to process request: ${error.message}`, error.statusCode || 400);
        }
    },

    async getAllDocumentsById(userId) {
        try {
            const results = await prisma.document.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });

            return {
                results,
            };
        } catch (error) {
            console.error("Error in get all documents:", error);
            throw new AppError(`Failed to process request: ${error.message}`, error.statusCode || 400);
        }
    },

    async updateDocument(id, files, expiryDate) {
        try {
            // Check if user exists
            const existingDocument = await prisma.document.findUnique({ where: { id } });

            if (!existingDocument) {
                throw new AppError("Document not found", 404);
            }

            let file, result;

            // Handle file uploads if files are provided
            if (files) {
                // Upload Badge
                if (files.file && files.file.length > 0) {
                    const fileResult = await uploadSingleImage(files.file[0]);
                    file = fileResult.url;
                    console.log("file upload successful:", fileResult);
                }

                // Add expiry dates if provided
                if (expiryDate) {
                    expiryDate = new Date(expiryDate);
                }

                // Create the document with uploaded files and expiry dates
                result = await prisma.document.update({
                    where: { id },
                    data: {
                        file,
                        expiryDate,
                    },
                });
            }

            return {
                success: true,
                message: "Documents updated successfully.",
                data: result,
            };

        } catch (error) {
            console.error("Error in updatedDocument:", error);
            throw new AppError(`Failed to process request: ${error.message}`, error.statusCode || 400);
        }
    },

    async deleteDocumentById(id) {
        try {
            const results = await prisma.document.delete({
                where: { id },
            });

            return {
                results,
            };
        } catch (error) {
            console.error("Error in delete documents:", error);
            throw new AppError(`Failed to process request: ${error.message}`, error.statusCode || 400);
        }
    },
};

export default documentService;

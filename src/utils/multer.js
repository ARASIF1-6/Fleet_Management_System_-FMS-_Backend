import multer from 'multer';

// Configure multer for memory storage (no file saving)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 250 * 1024 * 1024 // 250MB limit
    }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 20 },
    { name: 'file', maxCount: 1 },
]);

export { upload };


import express from 'express';
import { getGallery, addGallery, deleteGallery, updateGallery } from '../controllers/galleryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// No multer needed - images stored as base64 in MongoDB
router.route('/')
    .get(getGallery)
    .post(protect, admin, addGallery);

router.route('/:id')
    .put(protect, admin, updateGallery)
    .delete(protect, admin, deleteGallery);

export default router;

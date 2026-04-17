import express from 'express';
import { getGallery, addGallery, deleteGallery, updateGallery } from '../controllers/galleryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadToR2 } from '../config/r2.js';

const router = express.Router();

router.route('/')
    .get(getGallery)
    .post(protect, admin, uploadToR2('gallery').single('image'), addGallery);

router.route('/:id')
    .put(protect, admin, uploadToR2('gallery').single('image'), updateGallery)
    .delete(protect, admin, deleteGallery);

export default router;

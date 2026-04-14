import express from 'express';
import { getGallery, addGallery, deleteGallery, updateGallery } from '../controllers/galleryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getGallery)
    .post(protect, admin, upload.single('image'), addGallery);

router.route('/:id')
    .put(protect, admin, upload.single('image'), updateGallery)
    .delete(protect, admin, deleteGallery);

export default router;

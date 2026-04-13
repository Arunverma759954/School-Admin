import express from 'express';
import { getGallery, addGallery, deleteGallery } from '../controllers/galleryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getGallery)
    .post(protect, admin, upload.single('image'), addGallery);

router.route('/:id')
    .delete(protect, admin, deleteGallery);

export default router;

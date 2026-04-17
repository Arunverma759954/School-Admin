import express from 'express';
import {
    getEvents, createEvent, updateEvent, deleteEvent,
    getEnquiries, submitEnquiry,
    getTCs, searchTC, createTC, updateTC, deleteTC,
    getStats
} from '../controllers/dynamicController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadToR2 } from '../config/r2.js';

const router = express.Router();

// Events
router.route('/events')
    .get(getEvents)
    .post(protect, admin, createEvent);

router.route('/events/:id')
    .put(protect, admin, updateEvent)
    .delete(protect, admin, deleteEvent);

// Enquiries
router.route('/enquiries')
    .get(protect, admin, getEnquiries)
    .post(submitEnquiry);

// TCs
router.route('/tc')
    .get(getTCs)
    .post(protect, admin, uploadToR2('tc').single('image'), createTC);

router.get('/tc/search/:admissionNo', searchTC);

router.route('/tc/:id')
    .put(protect, admin, uploadToR2('tc').single('image'), updateTC)
    .delete(protect, admin, deleteTC);

router.get('/stats', protect, admin, getStats);

export default router;

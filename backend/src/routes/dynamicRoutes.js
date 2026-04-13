import express from 'express';
import { 
    getEvents, createEvent, updateEvent, deleteEvent,
    getEnquiries, submitEnquiry, 
    getTCs, searchTC, createTC, updateTC, deleteTC,
    getStats
} from '../controllers/dynamicController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Events
router.route('/events')
    .get(getEvents)
    .post(protect, admin, createEvent);

router.route('/events/:id')
    .put(protect, admin, updateEvent)
    .delete(protect, admin, deleteEvent);

// Enquiries (Public POST)
router.route('/enquiries')
    .get(protect, admin, getEnquiries)
    .post(submitEnquiry);

// TCs
router.route('/tc')
    .get(getTCs)
    .post(protect, admin, upload.single('image'), createTC);

router.get('/tc/:admissionNo', searchTC);

router.route('/tc/:id')
    .put(protect, admin, upload.single('image'), updateTC)
    .delete(protect, admin, deleteTC);

router.get('/stats', protect, admin, getStats);

export default router;

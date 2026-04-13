import { Event, Enquiry, TC } from '../models/DynamicContent.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- EVENTS ---
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (event) {
            res.json({ message: 'Event deleted' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- ENQUIRIES ---
export const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const submitEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.create(req.body);
        res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// --- TRANSFER CERTIFICATES ---
export const getTCs = async (req, res) => {
    try {
        const tcs = await TC.find().sort({ issueDate: -1 });
        res.json(tcs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const searchTC = async (req, res) => {
    const { admissionNo } = req.params;
    try {
        const query = admissionNo.trim();
        const tc = await TC.findOne({ 
            $or: [
                { admissionNo: { $regex: new RegExp(`^${query}$`, "i") } },
                { studentName: { $regex: new RegExp(`^${query}$`, "i") } }
            ]
        });
        if (tc) {
            res.json(tc);
        } else {
            res.status(404).json({ message: 'Certificate not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createTC = async (req, res) => {
    try {
        const tcData = { ...req.body };
        if (req.file) {
            tcData.imageFile = `/uploads/${req.file.filename}`;
        }
        const tc = await TC.create(tcData);
        res.status(201).json(tc);
    } catch (err) {
        console.error("TC Creation Backend Error:", err);
        res.status(500).json({ 
            message: 'Server Error during TC creation', 
            details: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        });
    }
};

export const updateTC = async (req, res) => {
    try {
        const tcData = { ...req.body };
        
        // Handle new file upload
        if (req.file) {
            tcData.imageFile = `/uploads/${req.file.filename}`;
            
            // Delete old file if exists
            const existingTC = await TC.findById(req.params.id);
            if (existingTC && existingTC.imageFile) {
                const oldFilePath = path.join(__dirname, '..', existingTC.imageFile);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
        }

        const tc = await TC.findByIdAndUpdate(req.params.id, tcData, { new: true });
        if (tc) {
            res.json(tc);
        } else {
            res.status(404).json({ message: 'TC not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteTC = async (req, res) => {
    try {
        const tc = await TC.findById(req.params.id);
        if (tc) {
            // Delete associated image file
            if (tc.imageFile) {
                const filePath = path.join(__dirname, '..', tc.imageFile);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            await TC.findByIdAndDelete(req.params.id);
            res.json({ message: 'TC deleted' });
        } else {
            res.status(404).json({ message: 'TC not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- STATS ---
export const getStats = async (req, res) => {
    try {
        const eventCount = await Event.countDocuments();
        const enquiryCount = await Enquiry.countDocuments();
        const tcCount = await TC.countDocuments();
        
        res.json({
            events: eventCount,
            enquiries: enquiryCount,
            tcs: tcCount,
            students: tcCount, // Using TC count as a proxy for students for now
            staff: 0
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

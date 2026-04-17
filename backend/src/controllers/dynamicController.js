import { Event, Enquiry, TC } from '../models/DynamicContent.js';
import { r2Client, getR2Url } from '../config/r2.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

// --- EVENTS ---
export const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll({ order: [['date', 'ASC']] });
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
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        await event.update(req.body);
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        await event.destroy();
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- ENQUIRIES ---
export const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.findAll({ order: [['createdAt', 'DESC']] });
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
        const tcs = await TC.findAll({ order: [['issueDate', 'DESC']] });
        res.json(tcs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const searchTC = async (req, res) => {
    const { admissionNo } = req.params;
    try {
        const { Op } = await import('sequelize');
        const query = admissionNo.trim();
        const tc = await TC.findOne({
            where: {
                [Op.or]: [
                    { admissionNo: query },
                    { studentName: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        if (tc) res.json(tc);
        else res.status(404).json({ message: 'Certificate not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createTC = async (req, res) => {
    try {
        const tcData = { ...req.body };
        if (req.file) {
            tcData.imageFile = getR2Url(req.file.key);
        }
        const tc = await TC.create(tcData);
        res.status(201).json(tc);
    } catch (err) {
        console.error('TC Creation Error:', err);
        res.status(500).json({ message: 'Server Error during TC creation', details: err.message });
    }
};

export const updateTC = async (req, res) => {
    try {
        const tc = await TC.findByPk(req.params.id);
        if (!tc) return res.status(404).json({ message: 'TC not found' });

        const tcData = { ...req.body };

        if (req.file) {
            // Delete old image from R2
            if (tc.imageFile && tc.imageFile.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL)) {
                try {
                    const key = tc.imageFile.replace(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/`, '');
                    await r2Client.send(new DeleteObjectCommand({
                        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
                        Key: key,
                    }));
                } catch (r2Err) {
                    console.warn('R2 delete warning:', r2Err.message);
                }
            }
            tcData.imageFile = getR2Url(req.file.key);
        }

        await tc.update(tcData);
        res.json(tc);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteTC = async (req, res) => {
    try {
        const tc = await TC.findByPk(req.params.id);
        if (!tc) return res.status(404).json({ message: 'TC not found' });

        if (tc.imageFile && tc.imageFile.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL)) {
            try {
                const key = tc.imageFile.replace(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/`, '');
                await r2Client.send(new DeleteObjectCommand({
                    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
                    Key: key,
                }));
            } catch (r2Err) {
                console.warn('R2 delete warning:', r2Err.message);
            }
        }

        await tc.destroy();
        res.json({ message: 'TC deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- STATS ---
export const getStats = async (req, res) => {
    try {
        const [eventCount, enquiryCount, tcCount] = await Promise.all([
            Event.count(),
            Enquiry.count(),
            TC.count(),
        ]);
        res.json({ events: eventCount, enquiries: enquiryCount, tcs: tcCount, students: tcCount, staff: 0 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

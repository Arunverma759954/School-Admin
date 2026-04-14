import Gallery from '../models/Gallery.js';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGallery = async (req, res) => {
    try {
        const images = await Gallery.find({}).sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add new gallery image
// @route   POST /api/gallery
// @access  Private/Admin
const addGallery = async (req, res) => {
    try {
        let finalSrc = '';
        const { alt, category } = req.body;

        // Priority 1: Multer File Upload
        if (req.file) {
            finalSrc = `/uploads/${req.file.filename}`;
        } 
        // Priority 2: Base64 Fallback
        else if (req.body.src && req.body.src.startsWith('data:image')) {
            const src = req.body.src;
            const [meta, data] = src.split(',');
            const extension = meta.split('/')[1].split(';')[0];
            const fileName = `gallery_${Date.now()}.${extension}`;
            const uploadPath = path.join(__dirname, '..', 'uploads', fileName);

            fs.writeFileSync(uploadPath, Buffer.from(data, 'base64'));
            finalSrc = `/uploads/${fileName}`;
        }

        if (!finalSrc) {
            return res.status(400).json({ message: 'No image provided' });
        }

        const image = await Gallery.create({
            src: finalSrc,
            alt: alt || 'School Gallery Image',
            category: category || 'General',
        });

        res.status(201).json(image);
    } catch (error) {
        console.error('Gallery Upload Backend Error:', error);
        res.status(500).json({ 
            message: 'Server Error during upload', 
            details: error.message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack 
        });
    }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGallery = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);

        if (image) {
            // Delete file if it's local
            if (image.src.startsWith('/uploads/')) {
                const filePath = path.join(__dirname, '..', image.src);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            await image.deleteOne();
            res.json({ message: 'Image removed' });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGallery = async (req, res) => {
    try {
        const { alt, category } = req.body;
        const image = await Gallery.findById(req.params.id);

        if (image) {
            image.alt = alt || image.alt;
            image.category = category || image.category;

            // If a new file was uploaded, update the src
            if (req.file) {
                // Optional: Delete old file if needed
                image.src = `/uploads/${req.file.filename}`;
            }

            const updatedImage = await image.save();
            res.json(updatedImage);
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export { getGallery, addGallery, deleteGallery, updateGallery };

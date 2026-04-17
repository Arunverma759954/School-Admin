import Gallery from '../models/Gallery.js';
import { r2Client, getR2Url } from '../config/r2.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const getGallery = async (req, res) => {
    try {
        const images = await Gallery.findAll({ order: [['createdAt', 'DESC']] });
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addGallery = async (req, res) => {
    try {
        const { alt, category } = req.body;
        if (!req.file) return res.status(400).json({ message: 'No image provided' });

        const src = getR2Url(req.file.key);
        const image = await Gallery.create({
            src,
            alt: alt || 'School Gallery Image',
            category: category || 'General',
        });
        res.status(201).json(image);
    } catch (error) {
        console.error('Gallery Upload Error:', error);
        res.status(500).json({ message: 'Server Error during upload', details: error.message });
    }
};

const updateGallery = async (req, res) => {
    try {
        const { alt, category } = req.body;
        const image = await Gallery.findByPk(req.params.id);
        if (!image) return res.status(404).json({ message: 'Image not found' });

        if (alt) image.alt = alt;
        if (category) image.category = category;

        if (req.file) {
            image.src = getR2Url(req.file.key);
        }

        await image.save();
        res.json(image);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteGallery = async (req, res) => {
    try {
        const image = await Gallery.findByPk(req.params.id);
        if (!image) return res.status(404).json({ message: 'Image not found' });

        // Delete from R2
        if (image.src && image.src.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL)) {
            try {
                const key = image.src.replace(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/`, '');
                await r2Client.send(new DeleteObjectCommand({
                    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
                    Key: key,
                }));
            } catch (r2Err) {
                console.warn('R2 delete warning:', r2Err.message);
            }
        }

        await image.destroy();
        res.json({ message: 'Image removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getGallery, addGallery, deleteGallery, updateGallery };

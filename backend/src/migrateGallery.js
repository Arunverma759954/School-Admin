import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Gallery from './models/Gallery.js';

dotenv.config();

const importGallery = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Read the website's existing gallery data
        const webGalleryPath = path.join(process.cwd(), '../../src/data/gallery.json');
        if (!fs.existsSync(webGalleryPath)) {
            console.error('Gallery JSON not found at:', webGalleryPath);
            process.exit(1);
        }

        const rawData = fs.readFileSync(webGalleryPath, 'utf8');
        const webImages = JSON.parse(rawData);

        console.log(`Found ${webImages.length} images. Importing to database...`);

        for (const img of webImages) {
            // Check if already exists by src
            const exists = await Gallery.findOne({ src: img.src });
            if (!exists) {
                await Gallery.create({
                    src: img.src,
                    alt: img.alt,
                    category: img.category || 'General',
                });
            }
        }

        console.log('Institutional gallery migration complete!');
        process.exit();
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

importGallery();

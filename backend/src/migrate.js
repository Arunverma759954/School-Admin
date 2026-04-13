import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Gallery from './models/Gallery.js';

dotenv.config();

const migrateData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected for migration...");

        const jsonPath = 'f:/school-web/src/data/gallery.json';
        if (!fs.existsSync(jsonPath)) {
            console.error("JSON not found at", jsonPath);
            process.exit(1);
        }

        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log(`Found ${data.length} images in JSON.`);

        for (const item of data) {
            const exists = await Gallery.findOne({ src: item.src });
            if (!exists) {
                await Gallery.create({
                    src: item.src,
                    alt: item.alt || 'School Media',
                    category: item.category || 'General'
                });
                console.log(`Migrated: ${item.alt}`);
            }
        }

        console.log("Migration complete! All images are now in MongoDB.");
        process.exit();
    } catch (error) {
        console.error("Migration error:", error);
        process.exit(1);
    }
};

migrateData();

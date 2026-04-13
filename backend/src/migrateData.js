import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Gallery from './models/Gallery.js';
import { Event } from './models/DynamicContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const migrateData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for migration...');

        // 1. Migrate Gallery
        const galleryPath = path.join(__dirname, '../../../src/data/gallery.json');
        if (fs.existsSync(galleryPath)) {
            const galleryData = JSON.parse(fs.readFileSync(galleryPath, 'utf-8'));
            
            // Clear existing gallery if needed or just skip duplicates
            // await Gallery.deleteMany({}); 

            for (const item of galleryData) {
                const exists = await Gallery.findOne({ src: item.src });
                if (!exists) {
                    await Gallery.create({
                        src: item.src,
                        alt: item.alt,
                        category: item.category || 'General'
                    });
                }
            }
            console.log(`Migrated ${galleryData.length} gallery items.`);
        }

        // 2. Migrate Events
        const eventsPath = path.join(__dirname, '../../../src/data/events.json');
        if (fs.existsSync(eventsPath)) {
            const content = fs.readFileSync(eventsPath, 'utf-8').trim();
            if (content) {
                const eventsData = JSON.parse(content);
                
                for (const item of eventsData) {
                    const exists = await Event.findOne({ title: item.title, date: item.date });
                    if (!exists) {
                        await Event.create({
                            title: item.title,
                            date: item.date,
                            location: item.location || 'School Campus',
                            description: item.description || '',
                            category: item.category || 'General'
                        });
                    }
                }
                console.log(`Migrated ${eventsData.length} events.`);
            } else {
                console.log('Events file is empty, skipping.');
            }
        }

        console.log('Migration completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Migration Error: ${error.message}`);
        process.exit(1);
    }
};

migrateData();

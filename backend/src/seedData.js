import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Event, TC } from './models/DynamicContent.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing events/tcs for clean state if needed
        await Event.deleteMany({});
        await TC.deleteMany({});

        // Add a sample Event
        await Event.create({
            title: 'Annual Sports Meet 2026',
            date: new Date('2026-05-15'),
            location: 'Main School Ground',
            description: 'The biggest sports event of the year!',
            category: 'Sports'
        });

        // Add a sample TC
        await TC.create({
            studentName: 'Yatharth Rout',
            admissionNo: '12345',
            issueDate: new Date(),
            className: 'Class 10-A',
            tcNumber: 'TC/2026/055',
            pdfUrl: 'uploads/sample-tc.pdf'
        });

        console.log('Institutional data seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedData();

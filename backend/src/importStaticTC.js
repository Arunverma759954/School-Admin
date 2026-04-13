import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend folder
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const tcSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    admissionNo: { type: String, required: true, unique: true },
    issueDate: { type: Date, required: true },
    className: { type: String, required: true },
    tcNumber: { type: String, required: true, unique: true },
    imageFile: { type: String },
    pdfUrl: { type: String }
}, { timestamps: true });

const TC = mongoose.model('TC', tcSchema);

const STATIC_TCS = [
    { studentName: "Abhinav Kumar", imageFile: "ABHINAV KUMAR CLASS 6.jpg", className: "Class 6" },
    { studentName: "Anant Yadav", imageFile: "ANANT YADAV CLASS 4.jpg", className: "Class 4" },
    { studentName: "Arpan Toppo", imageFile: "ARPAN TOPPO CLASS 5.jpg", className: "Class 5" },
    { studentName: "Arushi Yadav", imageFile: "ARUSHI YADAV CLASS 5.jpg", className: "Class 5" },
    { studentName: "B. Sudheshya", imageFile: "B. SUDHESHYA CLASS 5.jpg", className: "Class 5" },
    { studentName: "Bed Prakash", imageFile: "BED PRAKASH CLASS 1.jpg", className: "Class 1" },
    { studentName: "Harshit Kumar", imageFile: "HARSHIT KUMAR CLASS 7.jpg", className: "Class 7" },
    { studentName: "Jayashree Urma", imageFile: "JAYASHREE URMA CLASS 6.jpg", className: "Class 6" },
    { studentName: "Naba Kishor", imageFile: "NABA KISHOR CLASS 8.jpg", className: "Class 8" },
    { studentName: "Nayan Sahu", imageFile: "NAYAN SAHU CLASS 1.jpg", className: "Class 1" },
    { studentName: "Pranay Kumar", imageFile: "PRANAY KUMAR CLASS 1.jpg", className: "Class 1" },
    { studentName: "Raj Rajeswar", imageFile: "RAJ RAJESWAR CLASS 8.jpg", className: "Class 8" },
    { studentName: "Sahil Ranjan", imageFile: "SAHIL RANJAN CLASS 3.jpg", className: "Class 3" },
    { studentName: "Santhushti Pandey", imageFile: "SANTHUSHTI PANDEY 3 B.jpg", className: "Class 3 B" },
    { studentName: "Shreya Raj", imageFile: "SHREYA RAJ CLASS 1.jpg", className: "Class 1" },
    { studentName: "Biswa Binayak Swain", imageFile: "TC OF BISWA BINAYAK SWAIN CLASS 4.jpg", className: "Class 4" },
    { studentName: "Yashraj Choudhary", imageFile: "YASHRAJ CHOUDHARY CLASS 8.jpg", className: "Class 8" },
    { studentName: "Yatharth Rout", imageFile: "YATHARTH ROUT CLASS 5.jpg", className: "Class 5" },
];

async function importTCs() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        for (let i = 0; i < STATIC_TCS.length; i++) {
            const data = STATIC_TCS[i];
            
            // Generate a unique Admission No and TC No since they are missing in the static database
            const admissionNo = `ADM-${(i + 1).toString().padStart(3, '0')}-MIG`;
            const tcNumber = `TC-2026-${(i + 1).toString().padStart(3, '0')}-MIG`;
            
            const tcData = {
                studentName: data.studentName,
                admissionNo: admissionNo,
                issueDate: new Date('2026-03-15'), // Default migration date
                className: data.className,
                tcNumber: tcNumber,
                imageFile: `/uploads/TC/${data.imageFile}`
            };

            // Upsert based on student name to prevent duplicates
            await TC.findOneAndUpdate(
                { studentName: data.studentName },
                tcData,
                { upsert: true, new: true }
            );
            console.log(`Imported/Updated TC for: ${data.studentName}`);
        }

        console.log('Finished importing TC records.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

importTCs();

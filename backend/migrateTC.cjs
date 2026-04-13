const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const TC_DATABASE = [
    { id: "tc1", studentName: "Abhinav Kumar", imageFile: "/ABHINAV KUMAR CLASS 6.jpg", class: "Class 6" },
    { id: "tc2", studentName: "Anant Yadav", imageFile: "/ANANT YADAV CLASS 4.jpg", class: "Class 4" },
    { id: "tc3", studentName: "Arpan Toppo", imageFile: "/ARPAN TOPPO CLASS 5.jpg", class: "Class 5" },
    { id: "tc4", studentName: "Arushi Yadav", imageFile: "/ARUSHI YADAV CLASS 5.jpg", class: "Class 5" },
    { id: "tc5", studentName: "B. Sudheshya", imageFile: "/B. SUDHESHYA CLASS 5.jpg", class: "Class 5" },
    { id: "tc6", studentName: "Bed Prakash", imageFile: "/BED PRAKASH CLASS 1.jpg", class: "Class 1" },
    { id: "tc7", studentName: "Harshit Kumar", imageFile: "/HARSHIT KUMAR CLASS 7.jpg", class: "Class 7" },
    { id: "tc8", studentName: "Jayashree Urma", imageFile: "/JAYASHREE URMA CLASS 6.jpg", class: "Class 6" },
    { id: "tc9", studentName: "Naba Kishor", imageFile: "/NABA KISHOR CLASS 8.jpg", class: "Class 8" },
    { id: "tc10", studentName: "Nayan Sahu", imageFile: "/NAYAN SAHU CLASS 1.jpg", class: "Class 1" },
    { id: "tc11", studentName: "Pranay Kumar", imageFile: "/PRANAY KUMAR CLASS 1.jpg", class: "Class 1" },
    { id: "tc12", studentName: "Raj Rajeswar", imageFile: "/RAJ RAJESWAR CLASS 8.jpg", class: "Class 8" },
    { id: "tc13", studentName: "Sahil Ranjan", imageFile: "/SAHIL RANJAN CLASS 3.jpg", class: "Class 3" },
    { id: "tc14", studentName: "Santhushti Pandey", imageFile: "/SANTHUSHTI PANDEY 3 B.jpg", class: "Class 3 B" },
    { id: "tc15", studentName: "Shreya Raj", imageFile: "/SHREYA RAJ CLASS 1.jpg", class: "Class 1" },
    { id: "tc16", studentName: "Biswa Binayak Swain", imageFile: "/TC OF BISWA BINAYAK SWAIN CLASS 4.jpg", class: "Class 4" },
    { id: "tc17", studentName: "Yashraj Choudhary", imageFile: "/YASHRAJ CHOUDHARY CLASS 8.jpg", class: "Class 8" },
    { id: "tc18", studentName: "Yatharth Rout", imageFile: "/YATHARTH ROUT CLASS 5.jpg", class: "Class 5" },
];

const tcSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    admissionNo: { type: String, required: true, unique: true },
    issueDate: { type: Date, default: Date.now },
    className: { type: String, required: true },
    tcNumber: { type: String },
    imageFile: { type: String }, 
}, { timestamps: true });

const TC = mongoose.model('TC', tcSchema);

async function migrateTCs() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/school_admin');
        console.log('Connected to MongoDB');

        for (const record of TC_DATABASE) {
            const existing = await TC.findOne({ admissionNo: record.id });
            if (!existing) {
                await TC.create({
                    studentName: record.studentName,
                    admissionNo: record.id,
                    className: record.class,
                    imageFile: record.imageFile,
                    tcNumber: `TC/PREV/${record.id.toUpperCase()}`
                });
                console.log(`Migrated TC for: ${record.studentName}`);
            }
        }

        console.log('Migration completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrateTCs();

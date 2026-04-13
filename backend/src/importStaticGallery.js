import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gallery from './models/Gallery.js';

dotenv.config();

const STATIC_GALLERY = [
    { "alt": "Manag1", "category": "General", "src": "/uploads/Gallery/manag1.webp" },
    { "alt": "Manag2", "category": "General", "src": "/uploads/Gallery/manag2.webp" },
    { "alt": "Mission", "category": "General", "src": "/uploads/Gallery/mission.jpeg" },
    { "alt": "S1", "category": "General", "src": "/uploads/Gallery/s1.jpeg" },
    { "alt": "S2", "category": "General", "src": "/uploads/Gallery/s2.jpeg" },
    { "alt": "S3", "category": "General", "src": "/uploads/Gallery/s3.jpeg" },
    { "alt": "S4", "category": "General", "src": "/uploads/Gallery/s4.jpeg" },
    { "alt": "Annualday", "category": "Annual Function", "src": "/uploads/Gallery/Annual-function/Annualday.jpg" },
    { "alt": "Annual Day", "category": "Annual Function", "src": "/uploads/ANNUAL.jpg" },
    { "alt": "Img 20251214 Wa0206", "category": "Annual Function", "src": "/uploads/Gallery/Annual-function/IMG-20251214-WA0206.jpg" },
    { "alt": "Img 20251214 Wa0208", "category": "Annual Function", "src": "/uploads/Gallery/Annual-function/IMG-20251214-WA0208.jpg" },
    { "alt": "Img 20251214 Wa0213", "category": "Annual Function", "src": "/uploads/Gallery/Annual-function/IMG-20251214-WA0213.jpg" },
    { "alt": "Img 20251214 Wa0215", "category": "Annual Function", "src": "/uploads/Gallery/Annual-function/IMG-20251214-WA0215.jpg" },
    { "alt": "Img 20251214 Wa0217", "category": "Annual Function", "src": "/uploads/Gallery/Annual-function/IMG-20251214-WA0217.jpg" },
    { "alt": "Computerlabs", "category": "Campus Life", "src": "/uploads/Gallery/Campus-Life/Computerlabs.jpg" },
    { "alt": "New1", "category": "Campus Life", "src": "/uploads/Gallery/Campus-Life/new1.jpeg" },
    { "alt": "New2", "category": "Campus Life", "src": "/uploads/Gallery/Campus-Life/new2.jpeg" },
    { "alt": "New3", "category": "Campus Life", "src": "/uploads/Gallery/Campus-Life/new3.jpeg" },
    { "alt": "New4", "category": "Campus Life", "src": "/uploads/Gallery/Campus-Life/new4.jpeg" },
    { "alt": "New5", "category": "Campus Life", "src": "/uploads/Gallery/Campus-Life/new5.jpeg" },
    { "alt": "1 (1)", "category": "Competition", "src": "/uploads/Gallery/Competition/1 (1).jpg" },
    { "alt": "1 (2)", "category": "Competition", "src": "/uploads/Gallery/Competition/1 (2).jpg" },
    { "alt": "1 (3)", "category": "Competition", "src": "/uploads/Gallery/Competition/1 (3).jpg" },
    { "alt": "1 (4)", "category": "Competition", "src": "/uploads/Gallery/Competition/1 (4).jpg" },
    { "alt": "1 (5)", "category": "Competition", "src": "/uploads/Gallery/Competition/1 (5).jpg" },
    { "alt": "1 (6)", "category": "Competition", "src": "/uploads/Gallery/Competition/1 (6).jpg" },
    { "alt": "Competition", "category": "Competition", "src": "/uploads/Gallery/Competition/Competition.jpg" },
    { "alt": "32 (1)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (1).jpg" },
    { "alt": "32 (10)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (10).jpg" },
    { "alt": "32 (11)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (11).jpg" },
    { "alt": "32 (12)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (12).jpg" },
    { "alt": "32 (13)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (13).jpg" },
    { "alt": "32 (14)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (14).jpg" },
    { "alt": "32 (15)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (15).jpg" },
    { "alt": "32 (16)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (16).jpg" },
    { "alt": "32 (17)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (17).jpg" },
    { "alt": "32 (18)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (18).jpg" },
    { "alt": "32 (2)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (2).jpg" },
    { "alt": "32 (3)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (3).jpg" },
    { "alt": "32 (4)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (4).jpg" },
    { "alt": "32 (5)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (5).jpg" },
    { "alt": "32 (6)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (6).jpg" },
    { "alt": "32 (7)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (7).jpg" },
    { "alt": "32 (8)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (8).jpg" },
    { "alt": "32 (9)", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/32 (9).jpg" },
    { "alt": "Republic Day", "category": "Republic Day", "src": "/uploads/Gallery/Republic-Day/Republic-Day.jpg" },
    { "alt": "Spo", "category": "Sports", "src": "/uploads/Gallery/Sports/Spo.webp" },
    { "alt": "Sports Day", "category": "Sports", "src": "/uploads/Sports-Day.jpg" },
    { "alt": "Sports D", "category": "Sports", "src": "/uploads/Gallery/Sports/Sports-D.jpg" },
    { "alt": "A2", "category": "Student Activities", "src": "/uploads/Gallery/Student-Activities/a2.webp" },
    { "alt": "Students Activities", "category": "Student Activities", "src": "/uploads/Gallery/Student-Activities/Students-Activities.jpg" },
    { "alt": "10 (1)", "category": "Teacher Picnic", "src": "/uploads/Gallery/Teacher-Picnic/10 (1).jpg" },
    { "alt": "10 (2)", "category": "Teacher Picnic", "src": "/uploads/Gallery/Teacher-Picnic/10 (2).jpg" },
    { "alt": "10 (3)", "category": "Teacher Picnic", "src": "/uploads/Gallery/Teacher-Picnic/10 (3).jpg" },
    { "alt": "Teachers Picnic", "category": "Teacher Picnic", "src": "/uploads/Gallery/Teacher-Picnic/Teachers-Picnic.jpg" },
    { "alt": "A1", "category": "Teachers Events", "src": "/uploads/Gallery/Teachers-Events/a1.webp" },
    { "alt": "Activities", "category": "Teachers Events", "src": "/uploads/Gallery/Teachers-Events/Activities.webp" },
    { "alt": "Img 20251214 Wa0259", "category": "Teachers Events", "src": "/uploads/Gallery/Teachers-Events/IMG-20251214-WA0259.jpg" },
    { "alt": "Teachers Day", "category": "Teachers Events", "src": "/uploads/Gallery/Teachers-Events/Teachers-Day.jpg" },
    { "alt": "80 (1)", "category": "Training", "src": "/uploads/Gallery/training/80 (1).webp" },
    { "alt": "80 (2)", "category": "Training", "src": "/uploads/Gallery/training/80 (2).webp" },
    { "alt": "80 (3)", "category": "Training", "src": "/uploads/Gallery/training/80 (3).webp" },
    { "alt": "80 (4)", "category": "Training", "src": "/uploads/Gallery/training/80 (4).webp" },
    { "alt": "80 (5)", "category": "Training", "src": "/uploads/Gallery/training/80 (5).webp" },
    { "alt": "Fun Activity For Student Classroom 1", "category": "Training", "src": "/uploads/Gallery/training/fun-activity-for-student-classroom_1.jpg" },
    { "alt": "Girlstraining", "category": "Training", "src": "/uploads/Gallery/training/Girlstraining.jpg" },
    { "alt": "Lab", "category": "Training", "src": "/uploads/Gallery/training/lab.webp" },
    { "alt": "Yoga Day", "category": "Yoga", "src": "/uploads/Gallery/Yoga/Yoga-Day.jpg" },
    { "alt": "Yoga", "category": "Yoga", "src": "/uploads/Gallery/Yoga/Yoga.webp" },
    { "alt": "PTA 1", "category": "PTA", "src": "/uploads/pta1.webp" },
    { "alt": "PTA 2", "category": "PTA", "src": "/uploads/pta2.webp" },
    { "alt": "PTA 3", "category": "PTA", "src": "/uploads/pta3.webp" }
];

async function importData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const item of STATIC_GALLERY) {
            // Find by src OR alt to update if path changed
            const existing = await Gallery.findOne({ alt: item.alt });
            if (existing) {
                existing.src = item.src;
                await existing.save();
                console.log(`Updated path: ${item.alt}`);
            } else {
                await Gallery.create(item);
                console.log(`Imported: ${item.alt}`);
            }
        }

        console.log('Finished importing gallery data');
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}

importData();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gallery from './models/Gallery.js';
import TC from './models/TC.js';

dotenv.config();

const migrateTC = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Syncing TC search records...");

        // Note: The website's TC search uses records with studentName and imageFile
        // I will add some demo verifiable records to get them started
        const demoTCs = [
            { studentName: "Yatharth Rout", admissionNo: "2024001", issueDate: new Date(), className: "X-A", tcNumber: "TC/2024/001", imageFile: "Gallery/Republic-Day/Republic-Day.jpg" }
        ];

        for (const tc of demoTCs) {
            const exists = await TC.findOne({ admissionNo: tc.admissionNo });
            if (!exists) {
                await TC.create(tc);
                console.log(`Synced TC for: ${tc.studentName}`);
            }
        }

        console.log("TC Records Sync Complete.");
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

migrateTC();

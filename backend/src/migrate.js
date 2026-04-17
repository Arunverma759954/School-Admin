/**
 * MIGRATION SCRIPT
 * MongoDB → MySQL (Hostinger)
 * Cloudinary → Cloudflare R2
 */

import mongoose from 'mongoose';
import { Sequelize, DataTypes } from 'sequelize';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

// ─── R2 CLIENT ───────────────────────────────────────────────────────────────

const R2 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
});

const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL;
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME;

// ─── MYSQL SETUP ─────────────────────────────────────────────────────────────

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        dialectOptions: { ssl: { rejectUnauthorized: false } },
    }
);

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: { type: DataTypes.STRING, defaultValue: 'admin' },
}, { timestamps: true });

const Gallery = sequelize.define('Gallery', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    src: DataTypes.STRING(1000),
    alt: DataTypes.STRING,
    category: { type: DataTypes.STRING, defaultValue: 'General' },
}, { timestamps: true });

const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true },
}, { timestamps: true });

const Event = sequelize.define('Event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    location: DataTypes.STRING,
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    link: DataTypes.STRING,
}, { timestamps: true });

const Enquiry = sequelize.define('Enquiry', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    parentName: DataTypes.STRING,
    studentName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    classApplying: DataTypes.STRING,
    message: DataTypes.TEXT,
    status: { type: DataTypes.ENUM('New', 'Contacted', 'Resolved'), defaultValue: 'New' },
}, { timestamps: true });

const TC = sequelize.define('TC', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    studentName: DataTypes.STRING,
    admissionNo: { type: DataTypes.STRING, unique: true },
    issueDate: DataTypes.DATE,
    className: DataTypes.STRING,
    tcNumber: DataTypes.STRING,
    imageFile: DataTypes.STRING(1000),
    pdfUrl: DataTypes.STRING(1000),
}, { timestamps: true });

// ─── MONGODB SCHEMAS ──────────────────────────────────────────────────────────

const mongoUserSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String }, { timestamps: true });
const mongoGallerySchema = new mongoose.Schema({ src: String, alt: String, category: String }, { timestamps: true });
const mongoCategorySchema = new mongoose.Schema({ name: String }, { timestamps: true });
const mongoEventSchema = new mongoose.Schema({ title: String, date: Date, location: String, description: String, category: String, link: String }, { timestamps: true });
const mongoEnquirySchema = new mongoose.Schema({ parentName: String, studentName: String, email: String, phone: String, classApplying: String, message: String, status: String }, { timestamps: true });
const mongoTCSchema = new mongoose.Schema({ studentName: String, admissionNo: String, issueDate: Date, className: String, tcNumber: String, imageFile: String, pdfUrl: String }, { timestamps: true });

const MongoUser     = mongoose.model('User',     mongoUserSchema);
const MongoGallery  = mongoose.model('Gallery',  mongoGallerySchema);
const MongoCategory = mongoose.model('Category', mongoCategorySchema);
const MongoEvent    = mongoose.model('Event',    mongoEventSchema);
const MongoEnquiry  = mongoose.model('Enquiry',  mongoEnquirySchema);
const MongoTC       = mongoose.model('TC',       mongoTCSchema);

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const uploadImageToR2 = async (imageUrl, folder) => {
    try {
        if (!imageUrl || !imageUrl.startsWith('http')) return imageUrl;
        console.log(`  📥 Downloading: ${imageUrl.substring(0, 80)}...`);

        const { default: fetch } = await import('node-fetch');
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const buffer = await response.buffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
        const key = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        await R2.send(new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }));

        const r2Url = `${R2_PUBLIC_URL}/${key}`;
        console.log(`  ✅ Uploaded to R2: ${r2Url}`);
        return r2Url;
    } catch (err) {
        console.warn(`  ⚠️  Image migration failed: ${err.message} — keeping original URL`);
        return imageUrl;
    }
};

const log = (msg) => console.log(`\n${'─'.repeat(55)}\n  ${msg}\n${'─'.repeat(55)}`);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const migrate = async () => {
    console.log('\n🚀 Starting Migration: MongoDB → MySQL + Cloudinary → R2\n');

    log('Connecting to databases...');
    await mongoose.connect('mongodb://arunver:Akki759954@ac-2gbrdr6-shard-00-00.6vkzpcj.mongodb.net:27017,ac-2gbrdr6-shard-00-01.6vkzpcj.mongodb.net:27017,ac-2gbrdr6-shard-00-02.6vkzpcj.mongodb.net:27017/school_admin?ssl=true&replicaSet=atlas-uayian-shard-0&authSource=admin&appName=Cluster0');
    console.log('✅ MongoDB connected');

    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ MySQL connected & tables synced');

    // ── 1. USERS ──────────────────────────────────────────────────────────
    log('1/6  Migrating Users...');
    const mongoUsers = await MongoUser.find({});
    console.log(`Found ${mongoUsers.length} users`);
    let usersMigrated = 0;
    for (const u of mongoUsers) {
        try {
            await User.findOrCreate({
                where: { email: u.email },
                defaults: { name: u.name, email: u.email, password: u.password, role: u.role || 'admin', createdAt: u.createdAt, updatedAt: u.updatedAt }
            });
            usersMigrated++;
        } catch (err) { console.warn(`  ⚠️  Skipped user ${u.email}: ${err.message}`); }
    }
    console.log(`✅ ${usersMigrated}/${mongoUsers.length} users migrated`);

    // ── 2. CATEGORIES ─────────────────────────────────────────────────────
    log('2/6  Migrating Categories...');
    const mongoCategories = await MongoCategory.find({});
    console.log(`Found ${mongoCategories.length} categories`);
    let catsMigrated = 0;
    for (const c of mongoCategories) {
        try {
            await Category.findOrCreate({ where: { name: c.name }, defaults: { name: c.name, createdAt: c.createdAt, updatedAt: c.updatedAt } });
            catsMigrated++;
        } catch (err) { console.warn(`  ⚠️  Skipped category ${c.name}: ${err.message}`); }
    }
    console.log(`✅ ${catsMigrated}/${mongoCategories.length} categories migrated`);

    // ── 3. GALLERY ────────────────────────────────────────────────────────
    log('3/6  Migrating Gallery (Cloudinary → R2)...');
    const mongoGallery = await MongoGallery.find({});
    console.log(`Found ${mongoGallery.length} images`);
    let galleryMigrated = 0;
    for (const img of mongoGallery) {
        try {
            let newSrc = img.src;
            if (img.src && img.src.includes('cloudinary.com')) {
                newSrc = await uploadImageToR2(img.src, 'gallery');
            }
            await Gallery.create({ src: newSrc, alt: img.alt || 'School Gallery Image', category: img.category || 'General', createdAt: img.createdAt, updatedAt: img.updatedAt });
            galleryMigrated++;
        } catch (err) { console.warn(`  ⚠️  Skipped gallery image: ${err.message}`); }
    }
    console.log(`✅ ${galleryMigrated}/${mongoGallery.length} images migrated`);

    // ── 4. EVENTS ─────────────────────────────────────────────────────────
    log('4/6  Migrating Events...');
    const mongoEvents = await MongoEvent.find({});
    console.log(`Found ${mongoEvents.length} events`);
    let eventsMigrated = 0;
    for (const e of mongoEvents) {
        try {
            await Event.create({ title: e.title, date: e.date, location: e.location || 'School Campus', description: e.description, category: e.category || 'General', link: e.link, createdAt: e.createdAt, updatedAt: e.updatedAt });
            eventsMigrated++;
        } catch (err) { console.warn(`  ⚠️  Skipped event: ${err.message}`); }
    }
    console.log(`✅ ${eventsMigrated}/${mongoEvents.length} events migrated`);

    // ── 5. ENQUIRIES ──────────────────────────────────────────────────────
    log('5/6  Migrating Enquiries...');
    const mongoEnquiries = await MongoEnquiry.find({});
    console.log(`Found ${mongoEnquiries.length} enquiries`);
    let enquiriesMigrated = 0;
    for (const enq of mongoEnquiries) {
        try {
            await Enquiry.create({ parentName: enq.parentName, studentName: enq.studentName, email: enq.email, phone: enq.phone, classApplying: enq.classApplying, message: enq.message, status: enq.status || 'New', createdAt: enq.createdAt, updatedAt: enq.updatedAt });
            enquiriesMigrated++;
        } catch (err) { console.warn(`  ⚠️  Skipped enquiry: ${err.message}`); }
    }
    console.log(`✅ ${enquiriesMigrated}/${mongoEnquiries.length} enquiries migrated`);

    // ── 6. TRANSFER CERTIFICATES ──────────────────────────────────────────
    log('6/6  Migrating Transfer Certificates (images → R2)...');
    const mongoTCs = await MongoTC.find({});
    console.log(`Found ${mongoTCs.length} TCs`);
    let tcsMigrated = 0;
    for (const tc of mongoTCs) {
        try {
            let newImageFile = tc.imageFile;
            if (tc.imageFile && tc.imageFile.startsWith('http')) {
                newImageFile = await uploadImageToR2(tc.imageFile, 'tc');
            }
            await TC.findOrCreate({
                where: { admissionNo: tc.admissionNo },
                defaults: { studentName: tc.studentName, admissionNo: tc.admissionNo, issueDate: tc.issueDate || new Date(), className: tc.className, tcNumber: tc.tcNumber, imageFile: newImageFile, pdfUrl: tc.pdfUrl, createdAt: tc.createdAt, updatedAt: tc.updatedAt }
            });
            tcsMigrated++;
        } catch (err) { console.warn(`  ⚠️  Skipped TC ${tc.admissionNo}: ${err.message}`); }
    }
    console.log(`✅ ${tcsMigrated}/${mongoTCs.length} TCs migrated`);

    // ── SUMMARY ───────────────────────────────────────────────────────────
    log('MIGRATION SUMMARY');
    console.log(`  Users      : ${usersMigrated}/${mongoUsers.length}`);
    console.log(`  Categories : ${catsMigrated}/${mongoCategories.length}`);
    console.log(`  Gallery    : ${galleryMigrated}/${mongoGallery.length}`);
    console.log(`  Events     : ${eventsMigrated}/${mongoEvents.length}`);
    console.log(`  Enquiries  : ${enquiriesMigrated}/${mongoEnquiries.length}`);
    console.log(`  TCs        : ${tcsMigrated}/${mongoTCs.length}`);
    console.log('\n✅ Migration complete!\n');

    await mongoose.disconnect();
    await sequelize.close();
    process.exit(0);
};

migrate().catch((err) => {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
});

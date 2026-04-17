import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
});

export const uploadToR2 = (folder) => multer({
    storage: multerS3({
        s3: r2Client,
        bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const filename = `${folder}/${Date.now()}${ext}`;
            cb(null, filename);
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) cb(null, true);
        else cb(new Error('Only JPG, PNG, or WebP images are allowed'));
    },
    limits: { fileSize: 1 * 1024 * 1024 },
});

export const getR2Url = (key) => {
    if (!key) return '';
    if (key.startsWith('http')) return key;
    return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
};

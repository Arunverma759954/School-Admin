import mongoose from 'mongoose';

const gallerySchema = mongoose.Schema(
    {
        src: {
            type: String,
            required: true,
        },
        alt: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            default: 'General',
        },
    },
    {
        timestamps: true,
    }
);

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;

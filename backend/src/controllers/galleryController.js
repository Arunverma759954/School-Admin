import Gallery from '../models/Gallery.js';

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGallery = async (req, res) => {
    try {
        const images = await Gallery.find({}).sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add new gallery image (base64 stored in MongoDB)
// @route   POST /api/gallery
// @access  Private/Admin
const addGallery = async (req, res) => {
    try {
        const { alt, category, src } = req.body;

        if (!src) {
            return res.status(400).json({ message: 'No image provided' });
        }

        const image = await Gallery.create({
            src,     // base64 data URL e.g. "data:image/jpeg;base64,/9j/4AAQ..."
            alt: alt || 'School Gallery Image',
            category: category || 'General',
        });

        res.status(201).json(image);
    } catch (error) {
        console.error('Gallery Upload Backend Error:', error);
        res.status(500).json({
            message: 'Server Error during upload',
            details: error.message,
        });
    }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGallery = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (image) {
            await image.deleteOne();
            res.json({ message: 'Image removed' });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGallery = async (req, res) => {
    try {
        const { alt, category, src } = req.body;
        const image = await Gallery.findById(req.params.id);

        if (image) {
            image.alt = alt || image.alt;
            image.category = category || image.category;
            if (src) {
                image.src = src; // update with new base64 if provided
            }
            const updatedImage = await image.save();
            res.json(updatedImage);
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export { getGallery, addGallery, deleteGallery, updateGallery };

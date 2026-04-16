import Category from '../models/Category.js';

const DEFAULT_CATEGORIES = [
    'Annual Function', 'Competition', 'Sports', 'Yoga',
    'Campus Life', 'Student Activities', 'Training', 'PTA',
    'Teacher Picnic', 'Republic Day', 'General'
];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        let categories = await Category.find({}).sort({ name: 1 });

        // Seed defaults if collection is empty
        if (categories.length === 0) {
            const docs = DEFAULT_CATEGORIES.map(name => ({ name }));
            await Category.insertMany(docs);
            categories = await Category.find({}).sort({ name: 1 });
        }

        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const exists = await Category.findOne({ name: name.trim() });
        if (exists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({ name: name.trim() });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Rename a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const exists = await Category.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
        if (exists) {
            return res.status(400).json({ message: 'Category name already in use' });
        }

        category.name = name.trim();
        const updated = await category.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.deleteOne();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getCategories, createCategory, updateCategory, deleteCategory };

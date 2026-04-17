import Category from '../models/Category.js';

const DEFAULT_CATEGORIES = [
    'Annual Function', 'Competition', 'Sports', 'Yoga',
    'Campus Life', 'Student Activities', 'Training', 'PTA',
    'Teacher Picnic', 'Republic Day', 'General'
];

const getCategories = async (req, res) => {
    try {
        let categories = await Category.findAll({ order: [['name', 'ASC']] });

        if (categories.length === 0) {
            await Category.bulkCreate(DEFAULT_CATEGORIES.map(name => ({ name })));
            categories = await Category.findAll({ order: [['name', 'ASC']] });
        }

        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name?.trim()) return res.status(400).json({ message: 'Category name is required' });

        const exists = await Category.findOne({ where: { name: name.trim() } });
        if (exists) return res.status(400).json({ message: 'Category already exists' });

        const category = await Category.create({ name: name.trim() });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name?.trim()) return res.status(400).json({ message: 'Category name is required' });

        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        const exists = await Category.findOne({ where: { name: name.trim() } });
        if (exists && exists.id !== category.id) return res.status(400).json({ message: 'Category name already in use' });

        category.name = name.trim();
        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        await category.destroy();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getCategories, createCategory, updateCategory, deleteCategory };

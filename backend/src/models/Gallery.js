import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Gallery = sequelize.define('Gallery', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    src: { type: DataTypes.STRING(1000), allowNull: false },
    alt: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false, defaultValue: 'General' },
}, { timestamps: true });

export default Gallery;

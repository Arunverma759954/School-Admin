import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Event = sequelize.define('Event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING, defaultValue: 'School Campus' },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING, defaultValue: 'General' },
    link: { type: DataTypes.STRING },
}, { timestamps: true });

const Enquiry = sequelize.define('Enquiry', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    parentName: { type: DataTypes.STRING, allowNull: false },
    studentName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING, allowNull: false },
    classApplying: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('New', 'Contacted', 'Resolved'), defaultValue: 'New' },
}, { timestamps: true });

const TC = sequelize.define('TC', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    studentName: { type: DataTypes.STRING, allowNull: false },
    admissionNo: { type: DataTypes.STRING, allowNull: false, unique: true },
    issueDate: { type: DataTypes.DATE, allowNull: false },
    className: { type: DataTypes.STRING, allowNull: false },
    tcNumber: { type: DataTypes.STRING },
    imageFile: { type: DataTypes.STRING(1000) },
    pdfUrl: { type: DataTypes.STRING(1000) },
}, { timestamps: true });

export { Event, Enquiry, TC };

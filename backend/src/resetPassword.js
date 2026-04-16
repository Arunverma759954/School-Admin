import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const users = await User.find({});
        console.log('Users in DB:', users.map(u => ({ email: u.email, role: u.role })));

        const user = await User.findOne({ email: 'arunverma7599@gmail.com' });

        if (!user) {
            console.log('User not found! Creating new admin...');
            const newUser = new User({
                name: 'Arun Verma',
                email: 'arunverma7599@gmail.com',
                password: 'admin123',
                role: 'admin',
            });
            await newUser.save();
            console.log('Admin user created. Login with admin123');
        } else {
            console.log('User found. Resetting password to admin123...');
            user.password = 'admin123';
            await user.save();
            console.log('Password reset successfully. Login with admin123');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

resetPassword();

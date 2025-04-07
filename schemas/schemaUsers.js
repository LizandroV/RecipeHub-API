import mongoose from 'mongoose';

const isValidName = (name) => name.length >= 2 && name.length <= 50;
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) =>
	password.length >= 8 && password.length <= 20;

// name, email, password, favorites
const usersSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			validate: {
				validator: isValidName,
				message: 'Name must be between 2 and 50 characters',
			},
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			trim: true,
			unique: true,
			lowercase: true,
			validate: {
				validator: isValidEmail,
				message: 'Email is invalid',
			},
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			trim: true,
			validate: {
				validator: isValidPassword,
				message: 'Password must be between 8 and 20 characters',
			},
		},
		favorites: {
			type: [String],
			required: false,
			default: [],
		},
	},
	{
		timestamps: true,
		collection: 'users',
	},
);

export default mongoose.model('users', usersSchema);

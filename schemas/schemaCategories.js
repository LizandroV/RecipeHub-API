import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Category name is required'],
			unique: true,
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'Description is required'],
			trim: true,
		},
	},
	{ timestamps: true, collection: 'categories' },
);

export default mongoose.model('Category', categorySchema);

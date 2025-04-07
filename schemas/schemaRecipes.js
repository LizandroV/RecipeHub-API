import mongoose from 'mongoose';

const recipesSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			required: [true, 'Title is required.'],
			minlength: [2, 'Title must be at least 2 characters long.'],
			maxlength: [20, 'Title cannot exceed 20 characters.'],
		},
		ingredients: {
			type: String,
			trim: true,
			required: [true, 'Ingredients are required.'],
			minlength: [2, 'Ingredients must be at least 2 characters.'],
		},
		instructions: {
			type: String,
			trim: true,
			required: [true, 'Instructions are required.'],
			minlength: [10, 'Instructions must be at least 10 characters.'],
		},
		category: {
			type: String,
			required: [true, 'Category is required.'],
			enum: {
				values: [
					'Dessert',
					'Appetizer',
					'Main Course',
					'Beverage',
					'Salad',
					'Other',
				],
				message: 'Invalid category.',
			},
		},
		author: {
			type: String,
			required: [true, 'Author is required.'],
			trim: true,
			minlength: [3, 'Author name must be at least 3 characters.'],
		},
		time: {
			type: String,
			required: [true, 'Preparation time is required.'],
			match: [
				/^\d{1,3}\s?(minutes|minute|min|hours|hour|h)$/i,
				'Time must be a valid string like "45 minutes" or "1 hour"',
			],
		},
		difficulty: {
			type: String,
			required: [true, 'Difficulty is required.'],
			enum: {
				values: ['Easy', 'Medium', 'Hard'],
				message: 'Difficulty must be Easy, Medium, or Hard.',
			},
		},
	},
	{
		timestamps: true,
		collection: 'recipes',
	},
);

export default mongoose.model('Recipe', recipesSchema);

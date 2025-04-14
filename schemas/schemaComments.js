import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Users',
			required: [true, 'User is required.'],
			validate: {
				validator: async function (value) {
					const Users = mongoose.model('Users');
					const exists = await Users.exists({ _id: value });
					return !!exists;
				},
				message: 'The User does not exist.',
			},
		},
		recipe: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Recipe',
			required: [true, 'Recipe is required.'],
			validate: {
				validator: async function (value) {
					const Recipe = mongoose.model('Recipe');
					const exists = await Recipe.exists({ _id: value });
					return !!exists;
				},
				message: 'The Recipe does not exist.',
			},
		},
		comment: {
			type: String,
			required: true,
			trim: true,
		},
		stared: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
	},
	{
		timestamps: true,
		collection: 'comments',
	},
);

export default mongoose.model('Comment', commentSchema);

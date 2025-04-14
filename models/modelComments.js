import mongoose from 'mongoose';
import Comment from '../schemas/schemaComments.js';
import User from '../schemas/schemaUsers.js';
import Recipe from '../schemas/schemaRecipes.js';
import CustomError from '../utils/CustomError.js';

class ModelComments {
	async create(comment) {
		const { user, recipe, comment: text, stared } = comment;

		if (
			!mongoose.Types.ObjectId.isValid(user) ||
			!mongoose.Types.ObjectId.isValid(recipe)
		) {
			throw new CustomError('Invalid user or recipe ID format', 400);
		}

		const userExists = await User.findById(user);
		const recipeExists = await Recipe.findById(recipe);

		if (!userExists || !recipeExists) {
			throw new CustomError('User or Recipe not found', 404);
		}

		try {
			const newComment = await Comment.create({
				user,
				recipe,
				comment: text,
				stared,
			});
			return newComment;
		} catch (error) {
			throw new CustomError(`Error creating comment: ${error.message}`, 500);
		}
	}

	async getByRecipe(recipeId) {
		if (!mongoose.Types.ObjectId.isValid(recipeId)) {
			throw new CustomError('Invalid recipe ID format', 400);
		}
		try {
			const comments = await Comment.find({ recipe: recipeId }).populate(
				'user',
				'name email',
			);
			return comments;
		} catch (error) {
			throw new CustomError(`Error retrieving comments: ${error.message}`, 500);
		}
	}

	async delete(id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new CustomError('Invalid comment ID format', 400);
		}
		try {
			const deleted = await Comment.findByIdAndDelete(id);
			if (!deleted) {
				throw new CustomError('Comment not found', 404);
			}
			return deleted;
		} catch (error) {
			throw new CustomError(`Error deleting comment: ${error.message}`, 500);
		}
	}
}

export default new ModelComments();

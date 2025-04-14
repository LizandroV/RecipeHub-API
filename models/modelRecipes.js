import mongoose from 'mongoose';
import Recipe from '../schemas/schemaRecipes.js';
import Category from '../schemas/schemaCategories.js';
import Comment from '../schemas/schemaComments.js';
import CustomError from '../utils/CustomError.js';

class ModelRecipes {
	async create(recipe) {
		try {
			const categoryExists = await Category.findById(recipe.category);
			if (!categoryExists) {
				throw new CustomError('Invalid category ID provided.', 400);
			}

			const newRecipe = await Recipe.create(recipe);
			return newRecipe;
		} catch (error) {
			throw new CustomError(`${error.message}`, 400);
		}
	}

	async getAll() {
		try {
			const recipes = await Recipe.find().populate('category');
			return recipes;
		} catch (error) {
			throw new CustomError(`Error retrieving recipes: ${error.message}`, 500);
		}
	}

	async getOne(id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new CustomError('Invalid ID format', 400);
		}
		try {
			const recipe = await Recipe.findById(id).populate('category').lean();

			if (!recipe) {
				throw new CustomError('Recipe not found', 404);
			}

			const comments = await Comment.find({ recipe: id }).populate(
				'user',
				'name email',
			);
			recipe.comments = comments;

			return recipe;
		} catch (error) {
			throw new CustomError(`Error retrieving recipe: ${error.message}`, 500);
		}
	}

	async update(id, recipe) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new CustomError('Invalid ID format', 400);
		}

		const allowedFields = [
			'title',
			'ingredients',
			'instructions',
			'category',
			'author',
			'time',
			'difficulty',
		];
		const invalidFields = Object.keys(recipe).filter(
			(key) => !allowedFields.includes(key),
		);
		if (invalidFields.length > 0) {
			throw new CustomError(`Invalid fields: ${invalidFields.join(', ')}`, 400);
		}

		if (recipe.category) {
			if (!mongoose.Types.ObjectId.isValid(recipe.category)) {
				throw new CustomError('Invalid category ID format', 400);
			}
			const categoryExists = await Category.findById(recipe.category);
			if (!categoryExists) {
				throw new CustomError('Category ID does not exist', 400);
			}
		}

		try {
			const updateRecipe = await Recipe.findByIdAndUpdate(id, recipe, {
				new: true,
				runValidators: true,
				context: 'query',
			}).populate('category');

			if (!updateRecipe) {
				throw new CustomError('Recipe not found', 404);
			}

			return updateRecipe;
		} catch (error) {
			throw new CustomError(`Error updating recipe: ${error.message}`, 500);
		}
	}

	async delete(id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new CustomError('Invalid ID format', 400);
		}
		try {
			const deleteRecipe = await Recipe.findByIdAndDelete(id);
			if (!deleteRecipe) {
				throw new CustomError('Recipe not found', 404);
			}
			return deleteRecipe;
		} catch (error) {
			throw new CustomError(`Error deleting recipe: ${error.message}`, 500);
		}
	}
}

export default new ModelRecipes();

import mongoose from 'mongoose';
import Category from '../schemas/schemaCategories.js';
import CustomError from '../utils/CustomError.js';

class ModelCategories {
	async create(category) {
		try {
			const newCategory = await Category.create(category);
			return newCategory;
		} catch (error) {
			throw new CustomError(`${error.message}`, 400);
		}
	}

	async getAll() {
		try {
			const categories = await Category.find();
			return categories;
		} catch (error) {
			throw new CustomError(
				`Error retrieving categories: ${error.message}`,
				500,
			);
		}
	}

	async getOne(id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new CustomError('Invalid ID format', 400);
		}
		try {
			const category = await Category.findById(id);
			if (!category) {
				throw new CustomError('Category not found', 404);
			}
			return category;
		} catch (error) {
			throw new CustomError(`Error retrieving category: ${error.message}`, 500);
		}
	}

	async update(id, category) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new CustomError('Invalid ID format', 400);
		}

		const allowedFields = ['name', 'description'];
		const invalidFields = Object.keys(category).filter(
			(key) => !allowedFields.includes(key),
		);

		if (invalidFields.length > 0) {
			throw new CustomError(`Invalid fields: ${invalidFields.join(', ')}`, 400);
		}

		try {
			const updatedCategory = await Category.findByIdAndUpdate(id, category, {
				new: true,
				runValidators: true,
				context: 'query',
			});

			if (!updatedCategory) {
				throw new CustomError('Category not found', 404);
			}

			return updatedCategory;
		} catch (error) {
			throw new CustomError(`Error updating category: ${error.message}`, 500);
		}
	}

	async delete(id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new CustomError('Invalid ID format', 400);
		}
		try {
			const deletedCategory = await Category.findByIdAndDelete(id);
			if (!deletedCategory) {
				throw new CustomError('Category not found', 404);
			}
			return deletedCategory;
		} catch (error) {
			throw new CustomError(`Error deleting category: ${error.message}`, 500);
		}
	}
}

export default new ModelCategories();

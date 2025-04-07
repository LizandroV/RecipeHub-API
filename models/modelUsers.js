import mongoose from 'mongoose';
import Users from '../schemas/schemaUsers.js';
import CustomError from '../utils/CustomError.js';

class ModelUsers {
	async create(user) {
		try {
			const newUser = await Users.create(user);
			return newUser;
		} catch (error) {
			throw new CustomError(`${error.message}`, 500);
		}
	}
	async getOneById(id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new CustomError('Invalid ID format', 400);
		}
		try {
			const user = await Users.findById(id);
			if (!user) {
				throw new CustomError('User not found', 404);
			}
			return user;
		} catch (error) {
			throw new CustomError(`Error retrieving User: ${error.message}`, 500);
		}
	}

	async getOne(filter) {
		try {
			const user = await Users.findOne(filter);
			return user;
		} catch (error) {
			throw new Error(`Error retrieving User: ${error.message}`);
		}
	}
	async update(id, user) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new CustomError('Invalid ID format', 400);
		}

		const allowedFields = ['name', 'email', 'password', 'favorites'];
		const invalidFields = Object.keys(user).filter(
			(key) => !allowedFields.includes(key),
		);

		if (invalidFields.length > 0) {
			throw new CustomError(`Invalid fields: ${invalidFields.join(', ')}`, 400);
		}

		try {
			const updateUser = await Users.findByIdAndUpdate(id, user, {
				new: true,
				runValidators: true,
				context: 'query',
			});

			if (!updateUser) {
				throw new CustomError('User not found', 404);
			}

			return updateUser;
		} catch (error) {
			throw new CustomError(`Error updating User: ${error.message}`, 500);
		}
	}

	async delete(id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new CustomError('Invalid ID format', 400);
		}
		try {
			const deletedUser = await Users.findByIdAndDelete(id);
			if (!deletedUser) {
				throw new CustomError('User not found', 404);
			}
			return deletedUser;
		} catch (error) {
			throw new CustomError(`Error deleting User: ${error.message}`, 500);
		}
	}
}

export default new ModelUsers();

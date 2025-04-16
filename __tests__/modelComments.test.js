/* global beforeAll, afterAll, afterEach, beforeEach, describe, it, expect */
import mongoose from 'mongoose';
import ModelComments from '../models/modelComments.js';
import Comment from '../schemas/schemaComments.js';
import User from '../schemas/schemaUsers.js';
import Recipe from '../schemas/schemaRecipes.js';
import Category from '../schemas/schemaCategories.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
	// Inicializa el servidor de MongoDB en memoria
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	await User.deleteMany();
	await Recipe.deleteMany();
	await Category.deleteMany();
	await Comment.deleteMany();
});

afterEach(async () => {
	// Limpia las colecciones después de cada prueba
	await Comment.deleteMany();
	await User.deleteMany();
	await Recipe.deleteMany();
});

afterAll(async () => {
	// Desconecta y detiene el servidor de la base de datos
	await mongoose.disconnect();
	await mongoServer.stop();
});

describe('ModelComments', () => {
	it('should create a comment successfully', async () => {
		const user = await User.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: 'secret',
		});

		const category = await Category.create({
			name: 'Italian',
			description: 'Pasta and pizza classics',
		});

		const recipe = await Recipe.create({
			title: 'Spaghetti',
			description: 'Classic pasta dish',
			ingredients: ['Tomato', 'Pasta', 'Salt'],
			instructions: 'Boil pasta, make sauce, mix together',
			time: '30 minutes',
			difficulty: 'Easy',
			author: user._id,
			category: category._id,
		});

		const comment = await Comment.create({
			user: user._id,
			recipe: recipe._id,
			comment: 'Delicious!',
			stared: 5,
		});

		expect(comment.comment).toBe('Delicious!');
	});

	it('should retrieve comments by recipe ID', async () => {
		const user = await User.create({
			name: 'Jane Smith',
			email: 'jane@example.com',
			password: 'password123',
		});

		const category = await Category.create({
			name: 'Fresh Food',
			description: 'Healthy and refreshing meals',
		});

		const recipe = await Recipe.create({
			title: 'Salad',
			description: 'Fresh and healthy',
			ingredients: ['Lettuce', 'Tomato', 'Cucumber'],
			instructions: 'Chop veggies, mix together',
			time: '10 minutes',
			difficulty: 'Easy',
			author: user._id,
			category: category._id,
		});

		await ModelComments.create({
			user: user._id,
			recipe: recipe._id,
			comment: 'So refreshing!',
			stared: 4,
		});

		const comments = await ModelComments.getByRecipe(recipe._id);

		expect(comments.length).toBeGreaterThan(0);
		expect(comments[0].comment).toBe('So refreshing!');
		expect(comments[0].user.name).toBe('Jane Smith');
	});

	it('should delete a comment successfully', async () => {
		const user = await User.create({
			name: 'Carlos Pérez',
			email: 'carlos@example.com',
			password: 'clave123',
		});

		const category = await Category.create({
			name: 'Comfort Food',
			description: 'Warm dishes for cozy moments',
		});

		const recipe = await Recipe.create({
			title: 'Soup',
			description: 'Warm and tasty',
			ingredients: ['Carrot', 'Potato', 'Salt'],
			instructions: 'Boil water, add ingredients, cook until soft',
			time: '25 minutes',
			difficulty: 'Medium',
			author: user._id,
			category: category._id,
		});

		const comment = await ModelComments.create({
			user: user._id,
			recipe: recipe._id,
			comment: 'Perfect for winter!',
			stared: 5,
		});

		const deleted = await ModelComments.delete(comment._id);

		expect(deleted).toHaveProperty('_id');
		expect(deleted.comment).toBe('Perfect for winter!');

		const check = await Comment.findById(comment._id);
		expect(check).toBeNull();
	});
});

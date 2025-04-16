/* global beforeAll, afterAll, beforeEach, afterEach, describe, it, expect */
import mongoose from 'mongoose';
import ModelRecipes from '../models/modelRecipes.js';
import Recipe from '../schemas/schemaRecipes.js';
import Category from '../schemas/schemaCategories.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	await Recipe.deleteMany();
	await Category.deleteMany();
});

afterEach(async () => {
	await Recipe.deleteMany();
	await Category.deleteMany();
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

describe('ModelRecipes', () => {
	let category;

	beforeEach(async () => {
		category = await Category.create({
			name: 'Dessert',
			description: 'Sweet treats and baked goods',
		});
	});

	it('should create a recipe successfully', async () => {
		const recipeData = {
			title: 'Chocolate Cake',
			description: 'A rich and moist chocolate cake',
			ingredients: ['Flour', 'Cocoa Powder', 'Sugar', 'Eggs'],
			instructions: 'Mix ingredients, bake at 180°C for 30 minutes.',
			category: category._id,
			author: new mongoose.Types.ObjectId(),
			time: '45 minutes',
			difficulty: 'Medium',
		};

		const createdRecipe = await ModelRecipes.create(recipeData);

		expect(createdRecipe).toHaveProperty('_id');
		expect(createdRecipe.title).toBe(recipeData.title);
		expect(createdRecipe.ingredients).toEqual(recipeData.ingredients);
		expect(createdRecipe.instructions).toBe(recipeData.instructions);
		expect(createdRecipe.category.toString()).toBe(category._id.toString());
	});

	it('should throw an error when category does not exist', async () => {
		const invalidCategoryId = new mongoose.Types.ObjectId();

		const recipeData = {
			title: 'Tiramisu',
			description: 'An Italian layered dessert',
			ingredients: ['Mascarpone', 'Eggs', 'Coffee', 'Cocoa'],
			instructions: 'Layer ingredients and refrigerate.',
			category: invalidCategoryId,
			author: new mongoose.Types.ObjectId(),
			time: '20 minutes',
			difficulty: 'Hard',
		};

		await expect(ModelRecipes.create(recipeData)).rejects.toThrowError(
			'Invalid category ID provided.',
		);
	});

	it('should get all recipes', async () => {
		const recipeData = {
			title: 'Apple Pie',
			description: 'A traditional apple-filled pastry',
			ingredients: ['Apples', 'Sugar', 'Flour', 'Butter'],
			instructions: 'Prepare ingredients, bake for 60 minutes.',
			category: category._id,
			author: new mongoose.Types.ObjectId(),
			time: '60 minutes',
			difficulty: 'Easy',
		};

		await ModelRecipes.create(recipeData);

		const recipes = await ModelRecipes.getAll();
		expect(recipes).toHaveLength(1);
		expect(recipes[0].title).toBe('Apple Pie');
	});

	it('should get one recipe by ID', async () => {
		const recipeData = {
			title: 'Pumpkin Pie',
			description: 'A festive pie with pumpkin filling',
			ingredients: ['Pumpkin', 'Sugar', 'Flour', 'Cinnamon'],
			instructions: 'Mix and bake for 45 minutes.',
			category: category._id,
			author: new mongoose.Types.ObjectId(),
			time: '45 minutes',
			difficulty: 'Medium',
		};

		const createdRecipe = await ModelRecipes.create(recipeData);

		const fetchedRecipe = await ModelRecipes.getOne(createdRecipe._id);
		expect(fetchedRecipe.title).toBe('Pumpkin Pie');
		expect(fetchedRecipe.category.name).toBe('Dessert');
	});

	it('should update a recipe successfully', async () => {
		const recipeData = {
			title: 'Lemon Cake',
			description: 'Zesty and sweet lemon-flavored cake',
			ingredients: ['Lemon', 'Flour', 'Sugar', 'Eggs'],
			instructions: 'Mix, bake for 25 minutes.',
			category: category._id,
			author: new mongoose.Types.ObjectId(),
			time: '30 minutes',
			difficulty: 'Medium',
		};

		const createdRecipe = await ModelRecipes.create(recipeData);

		const updatedData = {
			title: 'Lemon Cake Deluxe',
			ingredients: ['Lemon', 'Flour', 'Sugar', 'Eggs', 'Butter'],
			instructions: 'Mix well, bake for 30 minutes.',
		};

		const updatedRecipe = await ModelRecipes.update(
			createdRecipe._id,
			updatedData,
		);
		expect(updatedRecipe.title).toBe('Lemon Cake Deluxe');
		expect(updatedRecipe.ingredients).toEqual(updatedData.ingredients);
	});

	it('should throw error for invalid fields during update', async () => {
		const recipeData = {
			title: 'Banana Bread',
			description: 'Moist bread made with ripe bananas',
			ingredients: ['Bananas', 'Flour', 'Sugar', 'Eggs'],
			instructions: 'Bake for 50 minutes.',
			category: category._id,
			author: new mongoose.Types.ObjectId(),
			time: '50 minutes',
			difficulty: 'Medium',
		};

		const createdRecipe = await ModelRecipes.create(recipeData);

		const invalidData = {
			unexpectedField: 'Unexpected Value',
		};

		await expect(
			ModelRecipes.update(createdRecipe._id, invalidData),
		).rejects.toThrowError('Invalid fields: unexpectedField');
	});

	it('should delete a recipe successfully', async () => {
		const recipeData = {
			title: 'Cheesecake',
			description: 'Creamy dessert with a biscuit base',
			ingredients: ['Cream Cheese', 'Sugar', 'Eggs', 'Crust'],
			instructions: 'Mix, bake, chill.',
			category: category._id,
			author: new mongoose.Types.ObjectId(),
			time: '60 minutes',
			difficulty: 'Hard',
		};

		const createdRecipe = await ModelRecipes.create(recipeData);

		const deletedRecipe = await ModelRecipes.delete(createdRecipe._id);
		expect(deletedRecipe.title).toBe('Cheesecake');

		const checkDeleted = await Recipe.findById(createdRecipe._id);
		expect(checkDeleted).toBeNull();
	});

	it('should throw an error for invalid recipe ID during delete', async () => {
		const invalidId = new mongoose.Types.ObjectId();

		await expect(ModelRecipes.delete(invalidId)).rejects.toThrowError(
			'Recipe not found',
		);
	});
});

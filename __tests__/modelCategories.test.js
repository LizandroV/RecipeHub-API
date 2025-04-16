/* global beforeAll, afterAll, afterEach, describe, it, expect */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ModelCategories from '../models/modelCategories.js';
import Category from '../schemas/schemaCategories.js';

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri);
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

afterEach(async () => {
	await Category.deleteMany(); // Clean the collection after each test
});

describe('ModelCategories', () => {
	it('should create a category correctly', async () => {
		const newCategory = await ModelCategories.create({
			name: 'Pasta',
			description: 'All kinds of pasta',
		});

		expect(newCategory).toHaveProperty('_id');
		expect(newCategory.name).toBe('Pasta');
		expect(newCategory.description).toBe('All kinds of pasta');
	});

	it('should get all categories', async () => {
		await ModelCategories.create({
			name: 'Salads',
			description: 'Fresh food',
		});

		const categories = await ModelCategories.getAll();
		expect(categories.length).toBe(1);
		expect(categories[0].name).toBe('Salads');
	});

	it('should get a category by its ID', async () => {
		const category = await ModelCategories.create({
			name: 'Drinks',
			description: 'Juices and sodas',
		});

		const result = await ModelCategories.getOne(category._id);
		expect(result.name).toBe('Drinks');
	});

	it('should update a category', async () => {
		const category = await ModelCategories.create({
			name: 'Meats',
			description: 'Grilled and more',
		});

		const updated = await ModelCategories.update(category._id, {
			name: 'Meats and BBQ',
		});

		expect(updated.name).toBe('Meats and BBQ');
		expect(updated.description).toBe('Grilled and more');
	});

	it('should delete a category', async () => {
		const category = await ModelCategories.create({
			name: 'Soups',
			description: 'Broths and soups',
		});

		const deleted = await ModelCategories.delete(category._id);
		expect(deleted.name).toBe('Soups');

		const all = await ModelCategories.getAll();
		expect(all.length).toBe(0);
	});
});

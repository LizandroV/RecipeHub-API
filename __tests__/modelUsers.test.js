/* global beforeAll, afterAll, beforeEach, afterEach, describe, test, expect */
import mongoose from 'mongoose';
import ModelUsers from '../models/ModelUsers.js'; // Asegúrate que tenga la extensión .js si usas ESModules
import CustomError from '../utils/CustomError.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Users from '../schemas/schemaUsers.js';

let mongoServer;
let userId;

beforeAll(async () => {
	// Iniciar MongoDB en memoria y conectar
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

afterEach(async () => {
	// Limpiar los datos entre pruebas para evitar contaminación
	await Users.deleteMany();
});

afterAll(async () => {
	// Desconectar y cerrar el servidor en memoria
	await mongoose.disconnect();
	await mongoServer.stop();
});

describe('ModelUsers', () => {
	beforeEach(async () => {
		// Crear un usuario antes de cada prueba (cuando sea necesario)
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'securepassword',
			favorites: ['recipe1', 'recipe2'],
		};
		const createdUser = await ModelUsers.create(newUser);
		userId = createdUser._id;
	});

	test('should create a user', async () => {
		const newUser = {
			name: 'Jane Smith',
			email: 'jane.smith@example.com',
			password: 'anotherpassword',
			favorites: ['recipe3'],
		};

		const createdUser = await ModelUsers.create(newUser);

		expect(createdUser).toHaveProperty('_id');
		expect(createdUser.name).toBe(newUser.name);
		expect(createdUser.email).toBe(newUser.email);
		expect(createdUser.favorites).toEqual(newUser.favorites);
	});

	test('should retrieve a user by ID', async () => {
		const user = await ModelUsers.getOneById(userId);
		expect(user).toHaveProperty('_id');
		expect(user.name).toBe('John Doe');
		expect(user.email).toBe('john.doe@example.com');
	});

	test('should throw an error when retrieving an invalid user by ID', async () => {
		await expect(ModelUsers.getOneById('invalid-id')).rejects.toThrow(
			CustomError,
		);
		await expect(ModelUsers.getOneById('invalid-id')).rejects.toThrow(
			'Invalid ID format',
		);
	});

	test('should update a user', async () => {
		const updatedData = { name: 'John Updated' };
		const updatedUser = await ModelUsers.update(userId, updatedData);
		expect(updatedUser.name).toBe('John Updated');
	});

	test('should throw an error when updating a user with invalid fields', async () => {
		const invalidData = { invalidField: 'someValue' };
		await expect(ModelUsers.update(userId, invalidData)).rejects.toThrow(
			CustomError,
		);
		await expect(ModelUsers.update(userId, invalidData)).rejects.toThrow(
			'Invalid fields',
		);
	});

	test('should delete a user', async () => {
		const deletedUser = await ModelUsers.delete(userId);
		expect(deletedUser).toHaveProperty('_id');
		expect(deletedUser.name).toBe('John Doe');
		const userAfterDelete = await Users.findById(userId);
		expect(userAfterDelete).toBeNull();
	});

	test('should throw an error when deleting a non-existent user', async () => {
		// Asegura que el usuario sea eliminado la primera vez
		await ModelUsers.delete(userId);

		// Intenta eliminarlo de nuevo: ahora sí debe lanzar error
		await expect(ModelUsers.delete(userId)).rejects.toThrow(CustomError);
		await expect(ModelUsers.delete(userId)).rejects.toThrow('User not found');
	});

	test('should throw an error when getting a non-existent user with valid ObjectId', async () => {
		const fakeId = new mongoose.Types.ObjectId();
		await expect(ModelUsers.getOneById(fakeId)).rejects.toThrow(CustomError);
		await expect(ModelUsers.getOneById(fakeId)).rejects.toThrow(
			'User not found',
		);
	});
});

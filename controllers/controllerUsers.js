import modelUser from '../models/modelUsers.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../helpers/authentication.js';

class controllerUsers {
	constructor() {}

	async register(req, res) {
		/*
		#swagger.tags = ['Users']
		#swagger.summary = 'Register a new user'
		#swagger.requestBody = {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							name: { type: "string", example: "john" },
							email: { type: "string", example: "johndoe@example.com" },
							password: { type: "string", example: "SecurePass123" }
						},
						required: ["email", "password"]
					}
				}
			}
		}
		#swagger.responses[201] = {
			description: "User registered successfully"
		}
		#swagger.responses[409] = {
			description: "The user already exists"
		}
		#swagger.responses[500] = {
			description: "Server error"
		}
		*/
		try {
			const { name, email, password, favorites } = req.body;
			const usuarioExist = await modelUser.getOne({ email });
			if (usuarioExist) {
				return res.status(409).json({ error: 'The user already exists' });
			}
			const passEncrypt = await bcrypt.hash(password, 10);
			const data = await modelUser.create({
				name,
				email,
				password: passEncrypt,
				favorites,
			});
			return res.status(201).json(data);
		} catch (e) {
			return res.status(500).json({ message: `${e}` });
		}
	}

	async login(req, res) {
		/*
		#swagger.tags = ['Users']
		#swagger.summary = 'Login an existing user'
		#swagger.requestBody = {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							email: { type: "string", example: "johndoe@example.com" },
							password: { type: "string", example: "SecurePass123" }
						},
						required: ["email", "password"]
					}
				}
			}
		}
		#swagger.responses[200] = {
			description: "Login successful",
			content: {
				"application/json": {
					example: { msg: "Login Successful", token: "eyJhbGciOi..." }
				}
			}
		}
		#swagger.responses[400] = {
			description: "Invalid credentials"
		}
		#swagger.responses[500] = {
			description: "Server error"
		}
		*/
		try {
			const { email, password } = req.body;
			const usuarioExist = await modelUser.getOne({ email });
			if (!usuarioExist) {
				return res.status(400).json({ error: 'The user does not exist' });
			}
			const valid = await bcrypt.compare(password, usuarioExist.password);
			if (!valid) {
				return res.status(400).json({ msg: 'Password incorrect' });
			}
			const token = generateToken(email);
			return res.status(200).json({ msg: 'Login Successful', token });
		} catch (e) {
			return res.status(500).send(e);
		}
	}

	async profile(req, res) {
		/*
		#swagger.tags = ['Users']
		#swagger.summary = 'Get user profile data'
		#swagger.security = [{
			"bearerAuth": []
		}]
		#swagger.responses[200] = {
			description: "User profile retrieved successfully"
		}
		#swagger.responses[404] = {
			description: "User not found"
		}
		#swagger.responses[500] = {
			description: "Server error"
		}
		*/
		try {
			const user = await modelUser.getOne({ email: req.emailConnected });
			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}
			return res.status(200).json(user);
		} catch (e) {
			return res.status(500).json({ message: `Error fetching profile: ${e}` });
		}
	}

	async updateProfile(req, res) {
		/*
		#swagger.tags = ['Users']
		#swagger.summary = 'Update user profile'
		#swagger.security = [{
			"bearerAuth": []
		}]
		#swagger.requestBody = {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							name: { type: "string", example: "john" },
							email: { type: "string", example: "johndoe@example.com" },
							password: { type: "string", example: "SecurePass123" }
						},
						required: ["email", "password"]
					}
				}
			}
		}
		#swagger.responses[200] = {
			description: "Profile updated successfully"
		}
		#swagger.responses[400] = {
			description: "Invalid password format"
		}
		#swagger.responses[404] = {
			description: "User not found"
		}
		#swagger.responses[500] = {
			description: "Server error"
		}
		*/
		try {
			const user = await modelUser.getOne({ email: req.emailConnected });
			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}
			let updatedData = { ...req.body };
			if (updatedData.password) {
				const isValidPassword =
					updatedData.password.length >= 5 && updatedData.password.length <= 20;
				if (!isValidPassword) {
					return res
						.status(400)
						.json({ error: 'Password must be between 5 and 20 characters' });
				}
				updatedData.password = await bcrypt.hash(updatedData.password, 10);
			}
			const updated = await modelUser.update(user._id, updatedData);
			return res.status(200).json(updated);
		} catch (e) {
			return res.status(500).json({ message: `Error updating profile: ${e}` });
		}
	}

	async deleteProfile(req, res) {
		/*
		#swagger.tags = ['Users']
		#swagger.summary = 'Delete user profile'
		#swagger.security = [{
			"bearerAuth": []
		}]
		#swagger.responses[200] = {
			description: "User deleted successfully"
		}
		#swagger.responses[404] = {
			description: "User not found"
		}
		#swagger.responses[500] = {
			description: "Server error"
		}
		*/
		try {
			const user = await modelUser.getOne({ email: req.emailConnected });
			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}
			const deleted = await modelUser.delete(user._id);
			return res
				.status(200)
				.json({ message: 'User deleted successfully', deleted });
		} catch (e) {
			return res.status(500).json({ message: `Error deleting profile: ${e}` });
		}
	}
}

export default new controllerUsers();

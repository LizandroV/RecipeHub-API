import modelUser from '../models/modelUsers.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../helpers/authentication.js';

class controllerUsers {
	constructor() {}

	/**
	 * @swagger
	 * /users/register:
	 *   post:
	 *     summary: Register a new user
	 *     tags: [Users]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - name
	 *               - email
	 *               - password
	 *             properties:
	 *               name:
	 *                 type: string
	 *               email:
	 *                 type: string
	 *                 format: email
	 *               password:
	 *                 type: string
	 *                 format: password
	 *               favorites:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *     responses:
	 *       201:
	 *         description: User created successfully
	 *       409:
	 *         description: User already exists
	 *       500:
	 *         description: Server error
	 */
	async register(req, res) {
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

	/**
	 * @swagger
	 * /users/login:
	 *   post:
	 *     summary: Login an existing user
	 *     tags: [Users]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - email
	 *               - password
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 format: email
	 *               password:
	 *                 type: string
	 *                 format: password
	 *     responses:
	 *       200:
	 *         description: Login successful
	 *       400:
	 *         description: Invalid credentials
	 *       500:
	 *         description: Server error
	 */
	async login(req, res) {
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

	/**
	 * @swagger
	 * /users/profile:
	 *   get:
	 *     summary: Get user profile data (requires authentication)
	 *     tags: [Users]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Profile data retrieved
	 *       404:
	 *         description: User not found
	 *       500:
	 *         description: Error fetching profile
	 */
	async profile(req, res) {
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

	/**
	 * @swagger
	 * /users/profile:
	 *   put:
	 *     summary: Update user profile (requires authentication)
	 *     tags: [Users]
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               name:
	 *                 type: string
	 *               favorites:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *     responses:
	 *       200:
	 *         description: Profile updated
	 *       404:
	 *         description: User not found
	 *       500:
	 *         description: Error updating profile
	 */
	async updateProfile(req, res) {
		try {
			const user = await modelUser.getOne({ email: req.emailConnected });
			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}

			const updated = await modelUser.update(user._id, req.body);
			return res.status(200).json(updated);
		} catch (e) {
			return res.status(500).json({ message: `Error updating profile: ${e}` });
		}
	}

	/**
	 * @swagger
	 * /users/profile:
	 *   delete:
	 *     summary: Delete user profile (requires authentication)
	 *     tags: [Users]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: User deleted successfully
	 *       404:
	 *         description: User not found
	 *       500:
	 *         description: Error deleting profile
	 */
	async deleteProfile(req, res) {
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

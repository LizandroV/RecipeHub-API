import modelRecipe from '../models/modelRecipes.js';

class controllerRecipes {
	constructor() {
		this.recipe = [];
	}

	/**
	 * @swagger
	 * /recipes:
	 *   post:
	 *     summary: Create a new recipe
	 *     tags: [Recipes]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - title
	 *               - ingredients
	 *               - instructions
	 *             properties:
	 *               title:
	 *                 type: string
	 *               ingredients:
	 *                 type: string
	 *               instructions:
	 *                 type: string
	 *               category:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *               author:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *               image:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *               time:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *               difficult:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *     responses:
	 *       201:
	 *         description: Recipe created successfully
	 *       500:
	 *         description: Server error
	 */
	async create(req, res) {
		try {
			const data = await modelRecipe.create(req.body);
			res.status(201).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	/**
	 * @swagger
	 * /recipes/{id}:
	 *   put:
	 *     summary: Update a recipe by ID
	 *     tags: [Recipes]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Recipe ID
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               title:
	 *                 type: string
	 *               ingredients:
	 *                 type: string
	 *               instructions:
	 *                 type: string
	 *               category:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *               author:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *               image:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *               time:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *               difficult:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *     responses:
	 *       200:
	 *         description: Recipe updated successfully
	 *       500:
	 *         description: Server error
	 */
	async update(req, res) {
		try {
			const { id } = req.params;
			const data = await modelRecipe.update(id, req.body);
			res.status(200).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	/**
	 * @swagger
	 * /recipes/{id}:
	 *   delete:
	 *     summary: Delete a recipe by ID
	 *     tags: [Recipes]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Recipe ID
	 *     responses:
	 *       204:
	 *         description: Recipe deleted successfully
	 *       500:
	 *         description: Server error
	 */
	async delete(req, res) {
		try {
			const { id } = req.params;
			const data = await modelRecipe.delete(id);
			res.status(204).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	/**
	 * @swagger
	 * /recipes:
	 *   get:
	 *     summary: Get all recipes
	 *     tags: [Recipes]
	 *     responses:
	 *       200:
	 *         description: A list of recipes
	 *       500:
	 *         description: Server error
	 */
	async getAll(req, res) {
		try {
			const data = await modelRecipe.getAll();
			res.status(200).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	/**
	 * @swagger
	 * /recipes/{id}:
	 *   get:
	 *     summary: Get a single recipe by ID
	 *     tags: [Recipes]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Recipe ID
	 *     responses:
	 *       200:
	 *         description: Recipe data retrieved
	 *       500:
	 *         description: Server error
	 */
	async getOne(req, res) {
		try {
			const { id } = req.params;
			const data = await modelRecipe.getOne(id);
			res.status(200).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}
}

export default new controllerRecipes();

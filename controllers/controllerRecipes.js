import modelRecipe from '../models/modelRecipes.js';

class controllerRecipes {
	constructor() {
		this.recipe = [];
	}

	async create(req, res) {
		/*
		#swagger.tags = ['Recipes']
		#swagger.summary = 'Create a new recipe'
		#swagger.security = [{
			"bearerAuth": []
		}]
		#swagger.description = 'Crafts a brand new recipe with the given data.'
		#swagger.requestBody = {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							title: { type: "string", example: "Spaghetti Bolognese" },
							ingredients: { type: "string", example: "Spaghetti, minced meat, tomato sauce, onion, garlic" },
							instructions: { type: "string", example: "Cook spaghetti. Brown meat. Add sauce. Mix and serve." },
							category: { type: "string", example: "660ff010f25b7f9f94f42c2a" },
							author: { type: "string", example: "John Doe" },
							time: { type: "string", example: "45 minutes" },
							difficulty: { type: "string", example: "Medium" }
						},
						required: ["title", "ingredients", "instructions", "category", "author", "time", "difficulty"]
					}
				}
			}
		}
		#swagger.responses[201] = {
			description: "Recipe created successfully"
		}
		#swagger.responses[500] = {
			description: "Server error while creating the recipe"
		}
		*/
		try {
			const data = await modelRecipe.create(req.body);
			res.status(201).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	async update(req, res) {
		/*
		#swagger.tags = ['Recipes']
		#swagger.summary = 'Update a recipe by ID'
		#swagger.security = [{
			"bearerAuth": []
		}]
		#swagger.description = 'Finds a recipe by ID and updates it with the provided data.'
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'ID of the recipe to update',
			required: true,
			schema: { type: 'string' }
		}
		#swagger.requestBody = {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							title: { type: "string", example: "Spaghetti Bolognese" },
							ingredients: { type: "string", example: "Spaghetti, minced meat, tomato sauce, onion, garlic" },
							instructions: { type: "string", example: "Cook spaghetti. Brown meat. Add sauce. Mix and serve." },
							category: { type: "string", example: "660ff010f25b7f9f94f42c2a" },
							author: { type: "string", example: "John Doe" },
							time: { type: "string", example: "45 minutes" },
							difficulty: { type: "string", example: "Medium" }
						},
						required: ["title", "ingredients", "instructions", "category", "author", "time", "difficulty"]
					}
				}
			}
		}
		#swagger.responses[200] = {
			description: "Recipe updated successfully"
		}
		#swagger.responses[500] = {
			description: "Server error while updating the recipe"
		}
		*/
		try {
			const { id } = req.params;
			const data = await modelRecipe.update(id, req.body);
			res.status(200).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	async delete(req, res) {
		/*
		#swagger.tags = ['Recipes']
		#swagger.summary = 'Delete a recipe by ID'
		#swagger.security = [{
			"bearerAuth": []
		}]
		#swagger.description = 'Removes a recipe entirely from the collection, using its unique ID.'
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'ID of the recipe to delete',
			required: true,
			schema: { type: 'string' }
		}
		#swagger.responses[204] = {
			description: "Recipe deleted successfully (no content)"
		}
		#swagger.responses[500] = {
			description: "Server error while deleting the recipe"
		}
		*/
		try {
			const { id } = req.params;
			const data = await modelRecipe.delete(id);
			res.status(204).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	async getAll(req, res) {
		/*
		#swagger.tags = ['Recipes']
		#swagger.summary = 'Get all recipes'
		#swagger.description = 'Retrieves the complete collection of delicious recipes from the archives.'
		#swagger.responses[200] = {
			description: "List of all recipes retrieved successfully"
		}
		#swagger.responses[500] = {
			description: "Server error while fetching recipes"
		}
		*/
		try {
			const data = await modelRecipe.getAll();
			res.status(200).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	async getOne(req, res) {
		/*
		#swagger.tags = ['Recipes']
		#swagger.summary = 'Get a single recipe by ID'
		#swagger.description = 'Fetches the details of a single recipe, chosen by its ID — a culinary gem.'
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'ID of the recipe to retrieve',
			required: true,
			schema: { type: 'string' }
		}
		#swagger.responses[200] = {
			description: "Recipe retrieved successfully"
		}
		#swagger.responses[500] = {
			description: "Server error while retrieving the recipe"
		}
		*/
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

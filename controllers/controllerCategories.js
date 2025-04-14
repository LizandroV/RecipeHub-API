import modelCategory from '../models/modelCategories.js';

class controllerCategories {
	constructor() {
		this.category = [];
	}

	async create(req, res) {
		/*
		#swagger.tags = ['Categories']
		#swagger.summary = 'Create a new category'
		#swagger.security = [{
			"bearerAuth": []
		}]
		#swagger.description = 'Adds a new category to the cookbook archive — a new culinary family is born.'
		#swagger.requestBody = {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							name: { type: "string", example: "Desserts" },
							description: { type: "string", example: "Sweet and sugary treats to end your meal." }
						},
						required: ["name", "description"]
					}
				}
			}
		}
		#swagger.responses[201] = {
			description: "Category created successfully"
		}
		#swagger.responses[500] = {
			description: "Server error while creating the category"
		}
		*/
		try {
			const data = await modelCategory.create(req.body);
			res.status(201).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	async update(req, res) {
		/*
		#swagger.tags = ['Categories']
		#swagger.summary = 'Update a category by ID'
		#swagger.security = [{
			"bearerAuth": []
		}]
		#swagger.description = 'Refines a category — trims its name or rewrites its story.'
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'ID of the category to update',
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
							name: { type: "string", example: "Appetizers" },
							description: { type: "string", example: "Small dishes to whet the appetite." }
						},
						required: ["name", "description"]
					}
				}
			}
		}
		#swagger.responses[200] = {
			description: "Category updated successfully"
		}
		#swagger.responses[500] = {
			description: "Server error while updating the category"
		}
		*/
		try {
			const { id } = req.params;
			const data = await modelCategory.update(id, req.body);
			res.status(200).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	async delete(req, res) {
		/*
		#swagger.tags = ['Categories']
		#swagger.summary = 'Delete a category by ID'
		#swagger.security = [{
			"bearerAuth": []
		}]
		#swagger.description = 'Erases a category from the scrolls — use with care.'
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'ID of the category to delete',
			required: true,
			schema: { type: 'string' }
		}
		#swagger.responses[204] = {
			description: "Category deleted successfully (no content)"
		}
		#swagger.responses[500] = {
			description: "Server error while deleting the category"
		}
		*/
		try {
			const { id } = req.params;
			const data = await modelCategory.delete(id);
			res.status(204).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	async getAll(req, res) {
		/*
		#swagger.tags = ['Categories']
		#swagger.summary = 'Get all categories'
		#swagger.description = 'Retrieves the list of all culinary categories known to your kitchen.'
		#swagger.responses[200] = {
			description: "List of all categories retrieved successfully"
		}
		#swagger.responses[500] = {
			description: "Server error while fetching categories"
		}
		*/
		try {
			const data = await modelCategory.getAll();
			res.status(200).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	async getOne(req, res) {
		/*
		#swagger.tags = ['Categories']
		#swagger.summary = 'Get a single category by ID'
		#swagger.description = 'Fetches the noble lineage of a single category by its ID.'
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'ID of the category to retrieve',
			required: true,
			schema: { type: 'string' }
		}
		#swagger.responses[200] = {
			description: "Category retrieved successfully"
		}
		#swagger.responses[500] = {
			description: "Server error while retrieving the category"
		}
		*/
		try {
			const { id } = req.params;
			const data = await modelCategory.getOne(id);
			res.status(200).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}
}

export default new controllerCategories();

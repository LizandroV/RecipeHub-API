import modelComments from '../models/modelComments.js';

class controllerComments {
	constructor() {
		this.comments = [];
	}

	async create(req, res) {
		/*
			#swagger.tags = ['Comments']
			#swagger.summary = 'Create a new comment on a recipe'
			#swagger.security = [{ "bearerAuth": [] }]
			#swagger.description = 'A user pens down their thoughts on a recipe, leaving stars and words of wisdom.'
			#swagger.requestBody = {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								recipe: { type: "string", example: "64401f92d4a23108b1cd32f5" },
								comment: { type: "string", example: "Wow, that flavor burst!" },
								stared: { type: "integer", minimum: 1, maximum: 5, example: 4 }
							},
							required: ["recipe", "comment", "stared"]
						}
					}
				}
			}
		*/

		try {
			const userId = req.user._id;
			const { recipe, comment, stared } = req.body;

			const data = await modelComments.create({
				user: userId,
				recipe,
				comment,
				stared,
			});
			res.status(201).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	async getByRecipe(req, res) {
		/*
		#swagger.tags = ['Comments']
		#swagger.summary = 'Get all comments for a recipe'
		#swagger.description = 'Retrieves all praises and critiques left by users for a specific recipe.'
		#swagger.parameters['recipeId'] = {
			in: 'path',
			description: 'ID of the recipe to fetch comments for',
			required: true,
			schema: { type: 'string' }
		}
		#swagger.responses[200] = {
			description: "Comments retrieved successfully"
		}
		#swagger.responses[500] = {
			description: "Server error while retrieving comments"
		}
		*/
		try {
			const { recipeId } = req.params;
			const data = await modelComments.getByRecipe(recipeId);
			res.status(200).json(data);
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}

	async delete(req, res) {
		/*
		#swagger.tags = ['Comments']
		#swagger.summary = 'Delete a comment by ID'
		#swagger.security = [{
			"bearerAuth": []
		}]
		#swagger.description = 'Removes a comment from the annals of culinary discourse.'
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'ID of the comment to delete',
			required: true,
			schema: { type: 'string' }
		}
		#swagger.responses[204] = {
			description: "Comment deleted successfully (no content)"
		}
		#swagger.responses[500] = {
			description: "Server error while deleting the comment"
		}
		*/
		try {
			const { id } = req.params;
			await modelComments.delete(id);
			res.status(204).end();
		} catch (error) {
			res.status(500).json({ message: `${error}` });
		}
	}
}

export default new controllerComments();

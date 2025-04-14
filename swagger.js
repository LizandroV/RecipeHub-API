import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger.json';
const endPointsFiles = ['./server.js'];

const doc = {
	openapi: '3.0.0',
	info: {
		title: 'RecipeHub API',
		description: 'API for managing users and recipes in RecipeHub.',
		version: '1.0.0',
	},
	servers: [
		{
			url: 'https://recipehub-api-jxvk.onrender.com',
			description: 'Production Server',
		},
		{
			url: 'http://localhost:8080',
			description: 'Development Server',
		},
	],
	tags: [
		{
			name: 'Users',
			description: 'Operations related to user accounts',
		},
		{
			name: 'Recipes',
			description: 'Operations related to managing recipes',
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
		},
		schemas: {
			User: {
				type: 'object',
				properties: {
					name: { type: 'string' },
					email: { type: 'string' },
					password: { type: 'string' },
					favorites: {
						type: 'array',
						items: { type: 'string' },
					},
				},
				required: ['name', 'email', 'password'],
				example: {
					name: 'Jane Doe',
					email: 'jane@example.com',
					password: 'StrongPassword123',
					favorites: ['recipe123', 'recipe456'],
				},
			},
			Recipe: {
				type: 'object',
				properties: {
					title: { type: 'string' },
					ingredients: { type: 'string' },
					instructions: { type: 'string' },
					category: {
						type: 'string',
						description: 'ID from Categories Collection',
					},
					author: { type: 'string' },
					time: { type: 'string' },
					difficulty: {
						type: 'string',
						enum: ['Easy', 'Medium', 'Hard'],
					},
				},
				required: [
					'title',
					'ingredients',
					'instructions',
					'category',
					'author',
					'time',
					'difficulty',
				],
				example: {
					title: 'Spaghetti Carbonara',
					ingredients: 'eggs, bacon, parmesan, pasta',
					instructions:
						'Boil pasta. Fry bacon. Mix everything with parmesan and eggs.',
					category: '6613b68f7399f5b4c59cbced',
					author: 'Mario Ross',
					time: '30 minutes',
					difficulty: 'Medium',
				},
			},
			Category: {
				type: 'object',
				properties: {
					name: { type: 'string' },
					description: { type: 'string' },
				},
				required: ['name'],
				example: {
					name: 'Soups',
					description: 'Warm and hearty broths for all seasons.',
				},
			},
			Comment: {
				type: 'object',
				properties: {
					user: { type: 'string' },
					recipe: { type: 'string' },
					comment: { type: 'string' },
					stared: { type: 'integer', minimum: 1, maximum: 5 },
				},
				required: ['user', 'recipe', 'comment', 'stared'],
				example: {
					user: '67f4aed8ba92c740e7a0e6ab',
					recipe: '6613b68f7399f5b4c59cbced',
					comment: 'Delicious and easy to make!',
					stared: 5,
				},
			},
		},

		parameters: {
			recipeId: {
				in: 'path',
				name: 'id',
				required: true,
				schema: {
					type: 'string',
				},
				description: 'ID of the recipe',
				example: '60d0fe4f5311236168a109ca',
			},
		},
	},
	paths: {
		// USERS
		'/users/register': {
			post: {
				tags: ['Users'],
				summary: 'Register a new user',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/User' },
						},
					},
				},
				responses: {
					201: { description: 'User registered successfully' },
					400: { description: 'Invalid data' },
				},
			},
		},
		'/users/login': {
			post: {
				tags: ['Users'],
				summary: 'Login user',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									email: { type: 'string', example: 'johndoe@example.com' },
									password: { type: 'string', example: 'SecurePass123' },
								},
								required: ['email', 'password'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Login successful',
						content: {
							'application/json': {
								example: {
									token: 'JWT_TOKEN_HERE',
								},
							},
						},
					},
					401: { description: 'Invalid credentials' },
				},
			},
		},
		'/users/profile': {
			get: {
				tags: ['Users'],
				summary: 'Get user profile',
				security: [{ bearerAuth: [] }],
				responses: {
					200: { description: 'Profile retrieved' },
					401: { description: 'Unauthorized' },
				},
			},
			put: {
				tags: ['Users'],
				summary: 'Update user profile',
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/User',
							},
						},
					},
				},
				responses: {
					200: { description: 'Profile updated' },
					401: { description: 'Unauthorized' },
				},
			},
			delete: {
				tags: ['Users'],
				summary: 'Delete user profile',
				security: [{ bearerAuth: [] }],
				responses: {
					204: { description: 'Profile deleted' },
					401: { description: 'Unauthorized' },
				},
			},
		},

		// RECIPES
		'/recipes': {
			get: {
				tags: ['Recipes'],
				summary: 'Get all recipes',
				responses: {
					200: { description: 'List of recipes' },
				},
			},
			post: {
				tags: ['Recipes'],
				summary: 'Create a new recipe',
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Recipe' },
						},
					},
				},
				responses: {
					201: { description: 'Recipe created' },
					401: { description: 'Unauthorized' },
				},
			},
		},
		'/recipes/{id}': {
			get: {
				tags: ['Recipes'],
				summary: 'Get a recipe by ID',
				parameters: [{ $ref: '#/components/parameters/recipeId' }],
				responses: {
					200: { description: 'Recipe retrieved' },
					404: { description: 'Recipe not found' },
				},
			},
			put: {
				tags: ['Recipes'],
				summary: 'Update a recipe by ID',
				security: [{ bearerAuth: [] }],
				parameters: [{ $ref: '#/components/parameters/recipeId' }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Recipe' },
						},
					},
				},
				responses: {
					200: { description: 'Recipe updated' },
					401: { description: 'Unauthorized' },
				},
			},
			delete: {
				tags: ['Recipes'],
				summary: 'Delete a recipe by ID',
				security: [{ bearerAuth: [] }],
				parameters: [{ $ref: '#/components/parameters/recipeId' }],
				responses: {
					204: { description: 'Recipe deleted' },
					401: { description: 'Unauthorized' },
				},
			},
		},
		// CATEGORIES
		'/categories': {
			get: {
				tags: ['Categories'],
				summary: 'Get all categories',
				responses: {
					200: { description: 'List of all categories retrieved successfully' },
					500: { description: 'Server error while fetching categories' },
				},
			},
			post: {
				tags: ['Categories'],
				summary: 'Create a new category',
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Category' },
						},
					},
				},
				responses: {
					201: { description: 'Category created successfully' },
					500: { description: 'Server error while creating the category' },
				},
			},
		},
		'/categories/{id}': {
			get: {
				tags: ['Categories'],
				summary: 'Get a single category by ID',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' },
					},
				],
				responses: {
					200: { description: 'Category retrieved successfully' },
					500: { description: 'Server error while retrieving the category' },
				},
			},
			put: {
				tags: ['Categories'],
				summary: 'Update a category by ID',
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' },
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Category' },
						},
					},
				},
				responses: {
					200: { description: 'Category updated successfully' },
					500: { description: 'Server error while updating the category' },
				},
			},
			delete: {
				tags: ['Categories'],
				summary: 'Delete a category by ID',
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' },
					},
				],
				responses: {
					204: { description: 'Category deleted successfully' },
					500: { description: 'Server error while deleting the category' },
				},
			},
		},

		// COMMENTS
		'/comments': {
			post: {
				tags: ['Comments'],
				summary: 'Create a new comment on a recipe',
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Comment' },
						},
					},
				},
				responses: {
					201: { description: 'Comment created successfully' },
					500: { description: 'Server error while creating the comment' },
				},
			},
		},
		'/comments/{id}': {
			delete: {
				tags: ['Comments'],
				summary: 'Delete a comment by ID',
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' },
					},
				],
				responses: {
					204: { description: 'Comment deleted successfully' },
					500: { description: 'Server error while deleting the comment' },
				},
			},
		},
		'/comments/recipe/{recipeId}': {
			get: {
				tags: ['Comments'],
				summary: 'Get all comments for a recipe',
				parameters: [
					{
						name: 'recipeId',
						in: 'path',
						required: true,
						schema: { type: 'string' },
					},
				],
				responses: {
					200: { description: 'Comments retrieved successfully' },
					500: { description: 'Server error while retrieving comments' },
				},
			},
		},
	},
};

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endPointsFiles, doc);

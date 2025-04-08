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
					name: { type: 'string', example: 'Jane Doe' },
					email: { type: 'string', example: 'jane@example.com' },
					password: { type: 'string', example: 'StrongPassword123' },
					favorites: {
						type: 'array',
						items: { type: 'string' },
						example: ['recipe123', 'recipe456'],
					},
				},
				required: ['name', 'email', 'password'],
			},
			Login: {
				type: 'object',
				properties: {
					email: { type: 'string', example: 'jane@example.com' },
					password: { type: 'string', example: 'StrongPassword123' },
				},
				required: ['email', 'password'],
			},
			Recipe: {
				type: 'object',
				properties: {
					title: { type: 'string', example: 'Spaghetti Carbonara' },
					ingredients: {
						type: 'array',
						items: { type: 'string' },
						example: ['eggs', 'bacon', 'parmesan', 'pasta'],
					},
					instructions: {
						type: 'string',
						example: 'Boil pasta, fry bacon, mix all.',
					},
					prepTime: { type: 'integer', example: 15 },
					cookTime: { type: 'integer', example: 10 },
					userId: { type: 'string', example: 'user123' },
				},
				required: ['title', 'ingredients', 'instructions'],
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
	},
};

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endPointsFiles, doc);

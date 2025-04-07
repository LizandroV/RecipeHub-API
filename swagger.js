import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger.json';
const endPointsFiles = ['./server.js'];

const doc = {
	openapi: '3.0.0',
	info: {
		title: 'Recipe & User API',
		description: 'API for managing users and recipes.',
		version: '1.0.0',
	},
	servers: [
		{
			url: 'http://localhost:5000',
			description: 'Development Server',
		},
	],
	tags: [
		{
			name: 'Users',
			description: 'Operations related to user management',
		},
		{
			name: 'Recipes',
			description: 'Operations related to recipe management',
		},
	],
	components: {
		securitySchemes: {
			BearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
		},
		schemas: {
			User: {
				type: 'object',
				properties: {
					name: { type: 'string', example: 'John Doe' },
					email: { type: 'string', example: 'john.doe@example.com' },
					password: { type: 'string', example: 'SecurePassword123' },
				},
				required: ['name', 'email', 'password'],
			},
			Recipe: {
				type: 'object',
				properties: {
					title: { type: 'string', example: 'Pasta Primavera' },
					ingredients: {
						type: 'array',
						items: { type: 'string' },
						example: ['Pasta', 'Tomato', 'Basil'],
					},
					instructions: {
						type: 'string',
						example: 'Boil pasta, mix with sauce.',
					},
					category: { type: 'string', example: 'Italian' },
					author: { type: 'string', example: 'Jane Doe' },
					time: { type: 'integer', example: 30 },
					difficulty: { type: 'string', example: 'Easy' },
				},
				required: ['title', 'ingredients', 'instructions'],
			},
		},
		parameters: {
			userId: {
				in: 'path',
				name: 'id',
				required: true,
				schema: {
					type: 'string',
				},
				description: 'User ID',
			},
			recipeId: {
				in: 'path',
				name: 'id',
				required: true,
				schema: {
					type: 'string',
				},
				description: 'Recipe ID',
			},
		},
	},
	paths: {
		// Users paths
		'/users/register': {
			post: {
				tags: ['Users'],
				summary: 'Register a new user',
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
					201: { description: 'User created successfully' },
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
									email: { type: 'string', example: 'john.doe@example.com' },
									password: { type: 'string', example: 'SecurePassword123' },
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
									token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
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
				security: [{ BearerAuth: [] }],
				responses: {
					200: { description: 'Success' },
					401: { description: 'Unauthorized' },
				},
			},
			put: {
				tags: ['Users'],
				summary: 'Update user profile',
				security: [{ BearerAuth: [] }],
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
					400: { description: 'Invalid data' },
					401: { description: 'Unauthorized' },
				},
			},
			delete: {
				tags: ['Users'],
				summary: 'Delete user profile',
				security: [{ BearerAuth: [] }],
				responses: {
					204: { description: 'Profile deleted' },
					401: { description: 'Unauthorized' },
				},
			},
		},

		// Recipes paths
		'/recipes': {
			get: {
				tags: ['Recipes'],
				summary: 'Get all recipes',
				responses: {
					200: {
						description: 'Success',
						content: {
							'application/json': {
								example: [
									{
										title: 'Pasta Primavera',
										ingredients: ['Pasta', 'Tomato', 'Basil'],
										instructions: 'Boil pasta, mix with sauce.',
									},
								],
							},
						},
					},
				},
			},
			post: {
				tags: ['Recipes'],
				summary: 'Create a new recipe',
				security: [{ BearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Recipe',
							},
						},
					},
				},
				responses: {
					201: { description: 'Recipe created successfully' },
					400: { description: 'Invalid data' },
				},
			},
		},
		'/recipes/{id}': {
			get: {
				tags: ['Recipes'],
				summary: 'Get a recipe by ID',
				parameters: [{ $ref: '#/components/parameters/recipeId' }],
				responses: {
					200: { description: 'Success' },
					404: { description: 'Recipe not found' },
				},
			},
			put: {
				tags: ['Recipes'],
				summary: 'Update a recipe',
				parameters: [{ $ref: '#/components/parameters/recipeId' }],
				security: [{ BearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Recipe',
							},
						},
					},
				},
				responses: {
					200: { description: 'Recipe updated' },
					400: { description: 'Invalid data' },
					404: { description: 'Recipe not found' },
				},
			},
			delete: {
				tags: ['Recipes'],
				summary: 'Delete a recipe',
				parameters: [{ $ref: '#/components/parameters/recipeId' }],
				security: [{ BearerAuth: [] }],
				responses: {
					204: { description: 'Recipe deleted' },
					404: { description: 'Recipe not found' },
				},
			},
		},
	},
};

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endPointsFiles, doc);

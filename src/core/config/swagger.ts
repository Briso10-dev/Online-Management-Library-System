// Fichier de configuration pour la doc
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { envs } from './env';

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Projet Worketyamo',
		version: '1.0.0',
		description: 'Documentation '
	},
	servers: [
		{
			url: `http://localhost:${envs.PORT}` // Change this to the URL of your API
		}
	],
	components: {
		schemas: {
			User: {
				type: "object",
				properties: {
					userID: {
						type: "string"
					},
					email: {
						type: "string"
					},
					name: {
						type: "string"
					},
					password: {
						type: "string"
					},
				}
			},
			Error: {
				type: "object",
				properties: {
					message: {
						type: "string"
					}
				}
			}
		},
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT"
			}
		}
	}
}

const options = {
	swaggerDefinition,
	apis: ['./src/routes/*.ts'] // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

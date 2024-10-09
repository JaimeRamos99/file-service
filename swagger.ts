import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger Express API',
      version: '1.0.0',
      description: 'A simple Express API with Swagger documentation',
    },
  },
  apis: ['./docs/*.yaml'],
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUi = swaggerUI;

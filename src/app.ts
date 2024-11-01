import express from 'express';
import { filesRouter, healthRouter } from './routes/';
import { errorHandler, checkAuthToken } from './middlewares';
import { swaggerUi, swaggerSpec } from '../swagger';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', healthRouter);

app.use(checkAuthToken);

app.use('/files', filesRouter);

app.use(errorHandler);

export default app;

import express from 'express';
import { filesRouter, healthRouter } from './routes/';
import { env, Logger } from './utils';
import { errorHandler, checkAuthToken } from './middlewares';
import { swaggerUi, swaggerSpec } from '../swagger';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', healthRouter);

app.use(checkAuthToken);

app.use('/files', filesRouter);

app.use(errorHandler);

app.listen(env.FILE_SERVICE_PORT, () => {
  Logger.info(`File service listening on port ${env.FILE_SERVICE_PORT}`);
});

import express from 'express';
import { filesRouter } from './routes/';
import { env, Logger } from './utils';
import { errorHandler } from './middlewares';

const app = express();

app.use('/files', filesRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  Logger.info(`File service listening on port ${env.PORT}`);
});

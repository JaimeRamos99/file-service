import express from 'express';
import { filesRouter } from './routes/';
import { env } from './utils';
import { errorHandler } from './middlewares';

const app = express();

app.use('/files', filesRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});

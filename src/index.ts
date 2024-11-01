import app from './app';
import { env, Logger } from './utils';

app.listen(env.FILE_SERVICE_PORT, () => {
  Logger.info(`File service listening on port ${env.FILE_SERVICE_PORT}`);
});

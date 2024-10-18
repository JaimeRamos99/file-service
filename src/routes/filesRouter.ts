import express from 'express';
import { upload, checkFilePresence, rateLimiter } from '../middlewares';
import { FileController } from '../controllers';
import { RedisCacheAdapter } from '../cache/adapters/redis';

const filesRouter = express.Router();
const fileController = new FileController(new RedisCacheAdapter());

filesRouter.use(rateLimiter);
filesRouter.get('/:fileUniqueName/signed-url', fileController.getSignedURL);
filesRouter.post('/upload', upload.single('file'), checkFilePresence, fileController.uploadFile);
filesRouter.post(
  '/extract-attributes',
  upload.single('file'),
  checkFilePresence,
  fileController.extractFileAttributes,
);

export default filesRouter;

import express from 'express';
import { upload, validateFileUpload } from '../middlewares';
import { FileController } from '../controllers';
import { RedisCacheAdapter } from '../cache/adapters/redis';

const filesRouter = express.Router();
const fileController = new FileController(new RedisCacheAdapter());

filesRouter.get('/:fileName/signed-url', fileController.getSignedURL);
filesRouter.post('/upload', upload.single('file'), validateFileUpload, fileController.uploadFile);
filesRouter.post(
  '/extract-attributes',
  upload.single('file'),
  validateFileUpload,
  fileController.extractFileAttributes,
);

export default filesRouter;

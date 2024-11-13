import express from 'express';
import { upload, checkFilePresence, rateLimiter } from '../middlewares';
import { FileController } from '../controllers';
import { RedisCacheAdapter } from '../cache/adapters/redis';
import { FileService } from '../services';
import { FileStorageManager, GCSStorageProvider } from '../integrations/fileStorage';
import { FileInterpreterManager, GCPDocumentAI } from '../integrations/fileInterpreter';

const filesRouter = express.Router();

const fileController = new FileController(
  new FileService(),
  new FileStorageManager(new GCSStorageProvider()),
  new FileInterpreterManager(new GCPDocumentAI()),
  new RedisCacheAdapter(),
);

filesRouter.use(rateLimiter);
filesRouter.get('/:fileUniqueName/signed-url', fileController.getSignedUrl);
filesRouter.delete('/:id', fileController.deleteFile);
filesRouter.post('/upload', upload.single('file'), checkFilePresence, fileController.uploadFile);
filesRouter.post(
  '/extract-attributes',
  upload.single('file'),
  checkFilePresence,
  fileController.extractFileAttributes,
);

export default filesRouter;

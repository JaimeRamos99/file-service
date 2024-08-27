import express from 'express';
import { upload, validateFileUpload } from '../middlewares';
import { fileInterpreterController, fileUploadController, fileSignedURLController } from '../controllers';

const filesRouter = express.Router();

filesRouter.get('/:fileName/signed-url', fileSignedURLController);
filesRouter.post('/upload', upload.single('file'), validateFileUpload, fileUploadController);
filesRouter.post('/extract-attributes', upload.single('file'), validateFileUpload, fileInterpreterController);

export default filesRouter;

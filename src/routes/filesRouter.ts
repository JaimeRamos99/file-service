import express from 'express';
import { upload, validateFileUpload } from '../middlewares';
import { fileInterpreterController, fileUploadController } from '../controllers';

const filesRouter = express.Router();

filesRouter.post('/upload', upload.single('file'), validateFileUpload, fileUploadController);

filesRouter.post('/extract-attributes', upload.single('file'), validateFileUpload, fileInterpreterController);

export default filesRouter;

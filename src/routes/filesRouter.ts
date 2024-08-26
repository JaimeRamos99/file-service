import express from 'express';
import fs from 'fs';
import { upload } from '../middlewares';
import FileStorageManager from '../entities/fileStorage/fileStorageManager';
import GCSStorageProvider from '../entities/fileStorage/providers/GCSStorageProvider';
import FileInterpreterManager from '../entities/fileInterpreter/fileInterpreterManager';
import { GCPDocumentAI } from '../entities/fileInterpreter/providers/GCPDocumentAI';

const filesRouter = express.Router();

filesRouter.post('/upload', upload.single('file'), async(req, res) => {
    try {
        const filePath = req.file?.path;
        if(!filePath) {
          return res.status(400).send({ error: true, message: 'No file uploaded.' });
        }
    
        // upload file to cloud provider
        const fileStorageManager = new FileStorageManager(new GCSStorageProvider());
        await fileStorageManager.uploadFile(filePath);
        
        // extract file attributes
        const fileInterpreterManager = new FileInterpreterManager(new GCPDocumentAI());
        await fileInterpreterManager.processFile(filePath);
    
        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete temporary file:', err);
        });
    
        res.status(200).send({ error: false, message: 'File uploaded successfully' });
      } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send({ error: true, message: 'Internal server error' });
      }
});

export default filesRouter;
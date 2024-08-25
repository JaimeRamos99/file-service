import express from 'express';
import fs from 'fs';
import { upload } from './middlewares';
import { env } from './utils'
import FileStorageManager from './fileStorage/fileStorageManager';
import GCSStorageProvider from './fileStorage/providers/GCSStorageProvider';

const app = express();

app.post('/upload', upload.single('file'), async(req, res) => {
  try {
    const filePath = req.file?.path;
    if(!filePath) {
      return res.status(400).send({ error: true, message: 'No file uploaded.' });
    }

    const fileStorageManager = new FileStorageManager(new GCSStorageProvider());
    await fileStorageManager.uploadFile(filePath);
    
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete temporary file:', err);
    });

    res.status(200).send({ error: false, message: 'File uploaded successfully' });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).send({ error: true, message: 'Internal server error' });
  }
});

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`)
});
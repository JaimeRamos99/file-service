import express from 'express';
import { upload } from './middlewares';
import { env } from './utils'
import FileStorageManager from './fileStorage/fileStorageManager';
import GCSStorageProvider from './fileStorage/providers/GCSStorageProvider';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/upload', upload.single('file'), async(req, res) => {
  const filePath = req.file?.path;
  if(!filePath) {
    return
  }
  const fileStorageManager = new FileStorageManager(new GCSStorageProvider());
  const response = await fileStorageManager.uploadFile(filePath);
  console.log(response);
  res.send('Hello World!')
});

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`)
});
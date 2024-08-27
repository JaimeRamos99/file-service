import { Request, Response, NextFunction } from 'express';
import { FileStorageManager, GCSStorageProvider } from '../entities/fileStorage';

export async function fileUploadController(req: Request, res: Response, next: NextFunction) {
  try {
    const filePath = req.file!.path;

    // upload file to cloud provider
    const fileStorageManager = new FileStorageManager(new GCSStorageProvider());
    await fileStorageManager.uploadFile(filePath);

    res.status(200).send({ error: false, message: 'File uploaded successfully' });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).send({ error: true, message: 'Internal server error' });
  }
}

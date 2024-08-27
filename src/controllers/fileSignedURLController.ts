import { Request, Response, NextFunction } from 'express';
import { FileStorageManager, GCSStorageProvider } from '../entities/fileStorage';

export async function fileSignedURLController(req: Request, res: Response, next: NextFunction) {
  const { fileName } = req.params;
  try {
    const fileStorageManager = new FileStorageManager(new GCSStorageProvider());

    const signedURL = await fileStorageManager.getSignedURL(fileName);
    res.status(200).send({ error: false, message: 'Signed URL succesfully generated', body: { signedURL } });
  } catch (err) {
    console.error(`Error getting signed URL for file: ${fileName}`, err);
    res.status(500).send({ error: true, message: 'Internal server error' });
  }
}

import { FileService } from '../services';
import { Request, Response } from 'express';
import { FileStorageManager, GCSStorageProvider } from '../integrations/fileStorage';
import { FileInterpreterManager, GCPDocumentAI } from '../integrations/fileInterpreter';
import { env } from '../utils';
import { wrapAsyncController } from './wrapAsyncController';
import { FileUploadInput } from '../entities';
import { ICacheAdapter } from '../cache/adapters';

export default class FileController {
  private fileService: FileService;
  private fileStorageManager: FileStorageManager;
  private fileInterpreterManager: FileInterpreterManager;
  private cache: ICacheAdapter;

  constructor(cache: ICacheAdapter) {
    this.fileService = new FileService();
    this.fileStorageManager = new FileStorageManager(new GCSStorageProvider());
    this.fileInterpreterManager = new FileInterpreterManager(new GCPDocumentAI());
    this.cache = cache;
  }

  public getSignedURL = wrapAsyncController(async (req: Request, res: Response) => {
    const { fileUniqueName } = req.params;

    const fileExist = await this.fileService.fileExists(fileUniqueName);
    if (!fileExist) {
      res.status(404).send({ error: true, message: 'File not found' });
      return;
    }

    const cachedSignedURL = await this.cache.get(fileUniqueName);
    if (cachedSignedURL) {
      res
        .status(200)
        .send({ error: false, message: 'Returning cache URL', body: { signedURL: cachedSignedURL } });
      return;
    }

    const signedURL = await this.fileStorageManager.getSignedURL(fileUniqueName);
    await this.cache.set(fileUniqueName, signedURL, env.CACHE_TTL_MS_SIGNED_URL);
    res.status(200).send({ error: false, message: 'Signed URL succesfully generated', body: { signedURL } });
  });

  public uploadFile = wrapAsyncController(async (req: Request, res: Response) => {
    const { file, body } = req;
    const { tripId, tripEventId, fileTypeId }: FileUploadInput = body;

    const newFile = await this.fileService.uploadAndSaveFile(file!, {
      tripId,
      tripEventId,
      fileTypeId,
    });

    res.status(200).send({ error: false, message: 'File uploaded successfully', body: newFile });
  });

  public extractFileAttributes = wrapAsyncController(async (req: Request, res: Response) => {
    const { buffer } = req.file!;

    const response = await this.fileInterpreterManager.processFile(buffer);

    res.status(200).send({ error: false, body: response });
  });
}

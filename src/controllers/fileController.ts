import { FileService } from '../services';
import { Request, Response } from 'express';
import { FileStorageManager, GCSStorageProvider } from '../integrations/fileStorage';
import { FileInterpreterManager, GCPDocumentAI } from '../integrations/fileInterpreter';
import { deleteFile, env } from '../utils';
import { wrapAsyncController } from './wrapAsyncController';
import { UploadInput } from '../entities';
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
    const { fileName } = req.params;

    const fileExist = await this.fileService.fileExists(fileName);
    if (!fileExist) {
      res.status(404).send({ error: true, message: 'File not found' });
      return;
    }

    const cachedSignedURL = await this.cache.get(fileName);
    if (cachedSignedURL) {
      res
        .status(200)
        .send({ error: false, message: 'Returning cache URL', body: { signedURL: cachedSignedURL } });
      return;
    }

    const signedURL = await this.fileStorageManager.getSignedURL(fileName);
    await this.cache.set(fileName, signedURL, env.CACHE_TTL_MS_SIGNED_URL);
    res.status(200).send({ error: false, message: 'Signed URL succesfully generated', body: { signedURL } });
  });

  public uploadFile = wrapAsyncController(async (req: Request, res: Response) => {
    const { file, body } = req;
    const { trip_id, trip_event_id, file_type_id }: UploadInput = body;

    const newFile = await this.fileService.uploadAndSaveFile(file!, { trip_id, trip_event_id, file_type_id });

    const filePath = file!.path;
    deleteFile(filePath);

    res.status(200).send({ error: false, message: 'File uploaded successfully', body: newFile });
  });

  public extractFileAttributes = wrapAsyncController(async (req: Request, res: Response) => {
    const filePath = req.file!.path;
    const response = await this.fileInterpreterManager.processFile(filePath);

    deleteFile(filePath);

    res.status(200).send({ error: false, body: response });
  });
}

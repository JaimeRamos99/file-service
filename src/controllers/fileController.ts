import { FileService } from '../services';
import { Request, Response, NextFunction } from 'express';
import { FileStorageManager, GCSStorageProvider } from '../integrations/fileStorage';
import { FileInterpreterManager, GCPDocumentAI } from '../integrations/fileInterpreter';
import { deleteFile } from '../utils';
import { wrapAsyncController } from './wrapAsyncController';

export default class FileController {
  private fileService: FileService;
  private fileStorageManager: FileStorageManager;
  private fileInterpreterManager: FileInterpreterManager;

  constructor() {
    this.fileService = new FileService();
    this.fileStorageManager = new FileStorageManager(new GCSStorageProvider());
    this.fileInterpreterManager = new FileInterpreterManager(new GCPDocumentAI());
  }

  public getSignedURL = wrapAsyncController(async (req: Request, res: Response) => {
    const { fileName } = req.params;
    const fileExist = await this.fileService.fileExists(fileName);
    if (!fileExist) {
      res.status(404).send({ error: true, message: 'File not found' });
      return;
    }

    const signedURL = await this.fileStorageManager.getSignedURL(fileName);
    res.status(200).send({ error: false, message: 'Signed URL succesfully generated', body: { signedURL } });
  });

  public uploadFile = wrapAsyncController(async (req: Request, res: Response) => {
    const filePath = req.file!.path;
    const fileName = await this.fileStorageManager.uploadFile(filePath);

    deleteFile(filePath);

    res.status(200).send({ error: false, message: 'File uploaded successfully', body: { fileName } });
  });

  public extractFileAttributes = wrapAsyncController(async (req: Request, res: Response) => {
    const filePath = req.file!.path;
    const response = await this.fileInterpreterManager.processFile(filePath);

    deleteFile(filePath);

    res.status(200).send({ error: false, body: response });
  });
}

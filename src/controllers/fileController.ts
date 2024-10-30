import { FileService } from '../services';
import { Request, Response } from 'express';
import { FileStorageManager } from '../integrations/fileStorage';
import { FileInterpreterManager } from '../integrations/fileInterpreter';
import { env, sendResponse } from '../utils';
import { wrapAsyncController } from './wrapAsyncController';
import { FileUploadInput } from '../entities';
import { ICacheAdapter } from '../cache/adapters';
import { StatusCodes } from 'http-status-codes';

export default class FileController {
  constructor(
    private fileService: FileService,
    private fileStorageManager: FileStorageManager,
    private fileInterpreterManager: FileInterpreterManager,
    private cache: ICacheAdapter,
  ) {
    this.fileService = fileService;
    this.fileStorageManager = fileStorageManager;
    this.fileInterpreterManager = fileInterpreterManager;
    this.cache = cache;
  }

  public getSignedUrl = wrapAsyncController(async (req: Request, res: Response): Promise<Response> => {
    const { fileUniqueName } = req.params;

    const fileExist = await this.fileService.fileExists(fileUniqueName);
    if (!fileExist) {
      return sendResponse(res, StatusCodes.NOT_FOUND, 'File not found', null, true);
    }

    const cachedSignedUrl = await this.cache.get(fileUniqueName);
    if (cachedSignedUrl) {
      return sendResponse(res, StatusCodes.OK, 'Returning cached URL', { signedUrl: cachedSignedUrl }, false);
    }

    const signedUrl = await this.fileStorageManager.getSignedUrl(fileUniqueName);
    await this.cache.set(fileUniqueName, signedUrl, env.CACHE_TTL_MS_SIGNED_URL);
    return sendResponse(res, StatusCodes.OK, 'Signed URL succesfully generated', { signedUrl }, false);
  });

  public uploadFile = wrapAsyncController(async (req: Request, res: Response): Promise<Response> => {
    const { file, body } = req;
    const { tripId, tripEventId, fileTypeId }: FileUploadInput = body;

    if ((!tripId && !tripEventId) || !fileTypeId) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, 'Missing input parameters', null, true);
    }

    const newFile = await this.fileService.uploadAndSaveFile(file!, {
      tripId,
      tripEventId,
      fileTypeId,
    });
    return sendResponse(res, StatusCodes.OK, 'File uploaded successfully', newFile, false);
  });

  public extractFileAttributes = wrapAsyncController(
    async (req: Request, res: Response): Promise<Response> => {
      const { buffer } = req.file!;

      const response = await this.fileInterpreterManager.processFile(buffer);
      return sendResponse(res, StatusCodes.OK, 'Attributes extracted succesfully', response, false);
    },
  );
}

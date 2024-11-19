import { createHash } from 'crypto';
import { FileService } from '../services';
import { Request, Response } from 'express';
import { FileStorageManager } from '../integrations/fileStorage';
import { FileInterpreterManager } from '../integrations/fileInterpreter';
import { calculateOffsetAndLimit, env, sendResponse } from '../utils';
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
    await this.cache.set(
      `${env.CACHE_KEY_PREFIX_SIGNED_URL}${fileUniqueName}`,
      signedUrl,
      env.CACHE_TTL_MS_SIGNED_URL,
    );
    return sendResponse(res, StatusCodes.OK, 'Signed URL succesfully generated', { signedUrl }, false);
  });

  public uploadFile = wrapAsyncController(async (req: Request, res: Response): Promise<Response> => {
    const { file, body } = req;
    const { tripId, tripEventId, fileTypeId }: FileUploadInput = body;

    if ((!tripId && !tripEventId) || !fileTypeId) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, 'Missing input parameters', null, true);
    }

    const userId = res.locals.user.sub;
    const newFile = await this.fileService.uploadAndSaveFile(file!, {
      fileTypeId,
      tripId,
      tripEventId,
      userId,
    });
    return sendResponse(res, StatusCodes.OK, 'File uploaded successfully', newFile, false);
  });

  public extractFileAttributes = wrapAsyncController(
    async (req: Request, res: Response): Promise<Response> => {
      const { buffer } = req.file!;

      const fileHash = createHash('sha256').update(buffer).digest('hex');
      const cacheKey = `${env.CACHE_KEY_PREFIX_FILE_ATTRIBUTES}${fileHash}`;

      const cachedFileAttributes = await this.cache.get(cacheKey);

      if (cachedFileAttributes) {
        return sendResponse(
          res,
          StatusCodes.OK,
          'Returning cached File attributes',
          { signedUrl: JSON.parse(cachedFileAttributes) },
          false,
        );
      }

      const response = await this.fileInterpreterManager.processFile(buffer);

      await this.cache.set(cacheKey, JSON.stringify(response), env.CACHE_TTL_MS_FILE_ATTRIBUTES);

      return sendResponse(res, StatusCodes.OK, 'Attributes extracted succesfully', response, false);
    },
  );

  public deleteFile = wrapAsyncController(async (req: Request, res: Response): Promise<Response> => {
    const { id: fileId } = req.params;
    const file = await this.fileService.getFileById(fileId);

    if (!file) {
      return sendResponse(res, StatusCodes.NOT_FOUND, 'File not found', null, true);
    }

    // file already deleted
    if (file.is_deleted) {
      return sendResponse(res, StatusCodes.NO_CONTENT, '', null, false);
    }

    // file deleted succesfully
    await this.fileService.softDeleteFile(fileId);
    return sendResponse(res, StatusCodes.NO_CONTENT, '', null, false);
  });

  public listFiles = wrapAsyncController(async (req: Request, res: Response): Promise<Response> => {
    const { page, pageSize } = req.query;
    const { offset, limit } = calculateOffsetAndLimit(page as string, pageSize as string);

    const userId = res.locals.user.sub;
    const files = await this.fileService.getUserFiles(userId, offset, limit);

    return sendResponse(res, StatusCodes.OK, 'Files retrieved successfully', files, false);
  });
}

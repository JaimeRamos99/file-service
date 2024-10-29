import { Request, Response } from 'express';
import { FileController } from '../../src/controllers';
import { ICacheAdapter } from '../../src/cache/adapters';
import { StatusCodes } from 'http-status-codes';
import { FileService } from '../../src/services';
import { FileStorageManager } from '../../src/integrations/fileStorage';
import { FileInterpreterManager } from '../../src/integrations/fileInterpreter';

describe('fileController', () => {
  let fileController: FileController;
  let fileServiceMock: jest.Mocked<FileService>;
  let fileStorageManagerMock: jest.Mocked<FileStorageManager>;
  let fileInterpreterManagerMock: jest.Mocked<FileInterpreterManager>;
  let cacheMock: jest.Mocked<ICacheAdapter>;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();

    fileServiceMock = {
      fileExists: jest.fn(),
      uploadAndSaveFile: jest.fn(),
    } as unknown as jest.Mocked<FileService>;

    fileStorageManagerMock = {
      getSignedURL: jest.fn(),
    } as unknown as jest.Mocked<FileStorageManager>;

    fileInterpreterManagerMock = {
      processFile: jest.fn(),
    } as unknown as jest.Mocked<FileInterpreterManager>;

    cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ICacheAdapter>;

    fileController = new FileController(
      fileServiceMock,
      fileStorageManagerMock,
      fileInterpreterManagerMock,
      cacheMock,
    );

    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;
  });

  describe('getSignedURL', () => {
    it('should return cached signed URL if available', async () => {
      const fileUniqueName = 'file_unique_name_test_01.pdf';
      const next = jest.fn();

      req.params = { fileUniqueName };

      fileServiceMock.fileExists.mockResolvedValue(true);
      cacheMock.get.mockResolvedValue('cached-signed-url.com');

      await fileController.getSignedURL(req, res, next);

      expect(fileServiceMock.fileExists).toHaveBeenCalledWith(fileUniqueName);
      expect(cacheMock.get).toHaveBeenCalledWith(fileUniqueName);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith({
        error: false,
        message: 'Returning cached URL',
        body: { signedURL: 'cached-signed-url.com' },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});

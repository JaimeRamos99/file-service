import { Request, Response } from 'express';
import { FileController } from '../../../src/controllers';
import { ICacheAdapter } from '../../../src/cache/adapters';
import { StatusCodes } from 'http-status-codes';
import { FileService } from '../../../src/services';
import { FileStorageManager } from '../../../src/integrations/fileStorage';
import { env } from '../../../src/utils';
import { initializeFileControllerTestSetup } from '../../setup/fileControllerTestSetup';

describe('FileController - getSignedUrl', () => {
  let fileController: FileController;
  let fileServiceMock: jest.Mocked<FileService>;
  let fileStorageManagerMock: jest.Mocked<FileStorageManager>;

  let cacheMock: jest.Mocked<ICacheAdapter>;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ fileController, fileServiceMock, fileStorageManagerMock, cacheMock, req, res } =
      initializeFileControllerTestSetup());
  });
  const next = jest.fn();

  function setFileExists(exists: boolean) {
    fileServiceMock.fileExists.mockResolvedValue(exists);
  }

  function setCacheGet(value: string | null) {
    cacheMock.get.mockResolvedValue(value);
  }

  function setFileUniqueName(name: string) {
    req.params = { fileUniqueName: name };
  }

  describe('Success Cases', () => {
    it('should return 404 Not Found if file unique name does not exist in the DB', async () => {
      const inexistentFile = 'inexistent_file.pdf';

      // Set the file unique name in the request parameters
      setFileUniqueName(inexistentFile);

      // Simulate that the file does not exist in the database
      setFileExists(false);

      await fileController.getSignedUrl(req, res, next);

      // Verify that fileService.fileExists was called once with the correct parameter
      expect(fileServiceMock.fileExists).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.fileExists).toHaveBeenCalledWith(inexistentFile);

      // Verify that the response status was set to 404 Not Found
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);

      // Verify that the correct error message was sent in the response
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        error: true,
        message: 'File not found',
        data: null,
      });
      // Verify that cache and storage methods were not called
      expect(cacheMock.get).not.toHaveBeenCalled();
      expect(fileStorageManagerMock.getSignedUrl).not.toHaveBeenCalled();
      expect(cacheMock.set).not.toHaveBeenCalled();

      // Verify that next was not called, indicating no unhandled errors were passed
      expect(next).not.toHaveBeenCalled();
    });

    it('should return cached signed URL if available', async () => {
      const fileUniqueName = 'file_unique_name_test_01.pdf';
      const signedUrl = 'cached-signed-url.com';

      // Set the file unique name in the request parameters
      setFileUniqueName(fileUniqueName);

      // Simulate that the file exists in the database
      setFileExists(true);

      // Simulate that the signed URL is available in the cache
      setCacheGet(signedUrl);

      await fileController.getSignedUrl(req, res, next);

      // Verify that fileService.fileExists was called once with the correct parameter
      expect(fileServiceMock.fileExists).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.fileExists).toHaveBeenCalledWith(fileUniqueName);

      // Verify that cache.get was called once with the correct parameter
      expect(cacheMock.get).toHaveBeenCalledTimes(1);
      expect(cacheMock.get).toHaveBeenCalledWith(fileUniqueName);

      // Verify that the response status was set to 200 OK
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);

      // Verify that the correct response was sent
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        error: false,
        message: 'Returning cached URL',
        data: { signedUrl },
      });

      // Ensure that no further processing occurred
      expect(fileStorageManagerMock.getSignedUrl).not.toHaveBeenCalled();
      expect(cacheMock.set).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should generate and return a new signed URL if not in cache', async () => {
      const fileUniqueName = 'file_unique_name_test_02.pdf';
      const signedUrl = 'new-signed-URL.com';

      // Set the file unique name in the request parameters
      setFileUniqueName(fileUniqueName);

      // Simulate that the file exists in the database
      setFileExists(true);

      // Simulate a cache miss (signed URL not available in cache)
      setCacheGet(null);

      // Mock the generation of a new signed URL
      fileStorageManagerMock.getSignedUrl.mockResolvedValueOnce(signedUrl);

      // Mock the successful caching of the new signed URL
      cacheMock.set.mockResolvedValue(undefined);

      await fileController.getSignedUrl(req, res, next);

      // Verify that fileService.fileExists was called once with the correct parameter
      expect(fileServiceMock.fileExists).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.fileExists).toHaveBeenCalledWith(fileUniqueName);

      // Verify that cache.get was called once with the correct parameter
      expect(cacheMock.get).toHaveBeenCalledTimes(1);
      expect(cacheMock.get).toHaveBeenCalledWith(fileUniqueName);

      // Verify that fileStorageManager.getSignedUrl was called once to generate a new signed URL
      expect(fileStorageManagerMock.getSignedUrl).toHaveBeenCalledTimes(1);
      expect(fileStorageManagerMock.getSignedUrl).toHaveBeenCalledWith(fileUniqueName);

      // Verify that cache.set was called once to store the new signed URL
      expect(cacheMock.set).toHaveBeenCalledTimes(1);
      expect(cacheMock.set).toHaveBeenCalledWith(
        `signedUrl:${fileUniqueName}`,
        signedUrl,
        env.CACHE_TTL_MS_SIGNED_URL,
      );

      // Verify that the response status was set to 200 OK
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);

      // Verify that the correct response was sent
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        error: false,
        message: 'Signed URL succesfully generated',
        data: { signedUrl },
      });

      // Verify that next was not called, indicating no errors occurred
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should pass errors to next function when fileService.fileExists throws an exception', async () => {
      const fileUniqueName = 'file_unique_name_test_03.pdf';

      setFileUniqueName(fileUniqueName);

      // Simulate an exception thrown by fileService.fileExists
      const error = new Error('Database connection failed');
      fileServiceMock.fileExists.mockRejectedValue(error);

      await fileController.getSignedUrl(req, res, next);

      // Ensure that fileExists was called correctly
      expect(fileServiceMock.fileExists).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.fileExists).toHaveBeenCalledWith(fileUniqueName);

      // Ensure that next was called with the error
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);

      // Ensure that no further processing occurred
      expect(cacheMock.get).not.toHaveBeenCalled();
      expect(fileStorageManagerMock.getSignedUrl).not.toHaveBeenCalled();
      expect(cacheMock.set).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it('should call next with error when cache.get throws an exception', async () => {
      const fileUniqueName = 'file_unique_name_test_04.pdf';

      setFileUniqueName(fileUniqueName);

      // Simulate that the file exists
      setFileExists(true);

      // Simulate an exception thrown by cache.get
      const error = new Error('Cache retrieval failed');
      cacheMock.get.mockRejectedValue(error);

      await fileController.getSignedUrl(req, res, next);

      // Ensure that fileExists and cache.get were called correctly
      expect(fileServiceMock.fileExists).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.fileExists).toHaveBeenCalledWith(fileUniqueName);
      expect(cacheMock.get).toHaveBeenCalledTimes(1);
      expect(cacheMock.get).toHaveBeenCalledWith(fileUniqueName);

      // Ensure that next was called with the error
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);

      // Ensure that no further processing occurred
      expect(fileStorageManagerMock.getSignedUrl).not.toHaveBeenCalled();
      expect(cacheMock.set).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it('should call next with error when fileStorageManager.getSignedUrl throws an exception', async () => {
      const fileUniqueName = 'file_unique_name_test_05.pdf';

      setFileUniqueName(fileUniqueName);

      // Simulate that the file exists
      setFileExists(true);

      // Simulate cache miss
      setCacheGet(null);

      // Simulate an exception thrown by fileStorageManager.getSignedUrl
      const error = new Error('Failed to generate signed URL');
      fileStorageManagerMock.getSignedUrl.mockRejectedValue(error);

      await fileController.getSignedUrl(req, res, next);

      // Verify method calls
      expect(fileServiceMock.fileExists).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.fileExists).toHaveBeenCalledWith(fileUniqueName);
      expect(cacheMock.get).toHaveBeenCalledTimes(1);
      expect(cacheMock.get).toHaveBeenCalledWith(fileUniqueName);
      expect(fileStorageManagerMock.getSignedUrl).toHaveBeenCalledTimes(1);
      expect(fileStorageManagerMock.getSignedUrl).toHaveBeenCalledWith(fileUniqueName);

      // Ensure that next was called with the error
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);

      // Ensure that no further processing occurred
      expect(cacheMock.set).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it('should call next with error when cache.set throws an exception', async () => {
      const fileUniqueName = 'file_unique_name_test_06.pdf';
      const signedUrl = 'http://signed-url.com';

      setFileUniqueName(fileUniqueName);

      // Simulate that the file exists
      setFileExists(true);

      // Simulate cache miss
      setCacheGet(null);

      // Simulate successful generation of signed URL
      fileStorageManagerMock.getSignedUrl.mockResolvedValue(signedUrl);

      // Simulate an exception thrown by cache.set
      const error = new Error('Cache set failed');
      cacheMock.set.mockRejectedValue(error);

      await fileController.getSignedUrl(req, res, next);

      // Verify method calls
      expect(fileServiceMock.fileExists).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.fileExists).toHaveBeenCalledWith(fileUniqueName);
      expect(cacheMock.get).toHaveBeenCalledTimes(1);
      expect(cacheMock.get).toHaveBeenCalledWith(fileUniqueName);
      expect(fileStorageManagerMock.getSignedUrl).toHaveBeenCalledTimes(1);
      expect(fileStorageManagerMock.getSignedUrl).toHaveBeenCalledWith(fileUniqueName);
      expect(cacheMock.set).toHaveBeenCalledTimes(1);
      expect(cacheMock.set).toHaveBeenCalledWith(
        `signedUrl:${fileUniqueName}`,
        signedUrl,
        env.CACHE_TTL_MS_SIGNED_URL,
      );

      // Ensure that the response was not sent
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();

      // Ensure that next was called with the error
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

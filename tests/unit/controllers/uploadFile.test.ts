import { Request, Response } from 'express';
import { FileController } from '../../../src/controllers';
import { StatusCodes } from 'http-status-codes';
import { FileService } from '../../../src/services';
import { initializeFileControllerTestSetup } from '../helpers/fileControllerTestSetup';

describe('FileController - uploadFile', () => {
  let fileController: FileController;
  let fileServiceMock: jest.Mocked<FileService>;
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ fileController, fileServiceMock, req, res } = initializeFileControllerTestSetup());

    next = jest.fn();
  });

  describe('Success Cases', () => {
    it('should successfully upload a file and return the new file object', async () => {
      // Set up the request with file and body data
      req.file = { buffer: Buffer.from('Test file content') } as Express.Multer.File;
      req.body = {
        tripId: 'trip123',
        fileTypeId: 'type789',
      };

      // Mock the response from uploadAndSaveFile // REFACTOR
      const newFile = { file_id: 'file123' };

      fileServiceMock.uploadAndSaveFile.mockResolvedValue(newFile);

      await fileController.uploadFile(req, res, next);

      // Verify that uploadAndSaveFile was called correctly
      expect(fileServiceMock.uploadAndSaveFile).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.uploadAndSaveFile).toHaveBeenCalledWith(req.file, {
        fileTypeId: req.body.fileTypeId,
        tripId: req.body.tripId,
        tripEventId: undefined,
        userId: res.locals.user.sub,
      });

      // Verify that res.status and res.send were called with the correct arguments
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        error: false,
        message: 'File uploaded successfully',
        data: newFile,
      });

      // Verify that next was not called
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should return an error when required body parameters are missing', async () => {
      req.file = { buffer: Buffer.from('Test file content') } as Express.Multer.File;
      req.body = {}; // Missing tripId, tripEventId, fileTypeId

      await fileController.uploadFile(req, res, next);

      // Verify that uploadAndSaveFile was not called
      expect(fileServiceMock.uploadAndSaveFile).not.toHaveBeenCalled();

      // Verify that res.status and res.send were not called
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        error: true,
        message: 'Missing input parameters',
        data: null,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error when fileService.uploadAndSaveFile throws an exception', async () => {
      req.file = { buffer: Buffer.from('Test file content') } as Express.Multer.File;
      req.body = {
        tripId: 'trip123',
        tripEventId: 'event456',
        fileTypeId: 'type789',
      };

      // Simulate an exception thrown by uploadAndSaveFile
      const error = new Error('Upload failed');
      fileServiceMock.uploadAndSaveFile.mockRejectedValue(error);

      await fileController.uploadFile(req, res, next);

      // Verify that uploadAndSaveFile was called with the correct arguments
      expect(fileServiceMock.uploadAndSaveFile).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.uploadAndSaveFile).toHaveBeenCalledWith(req.file, {
        fileTypeId: req.body.fileTypeId,
        tripId: req.body.tripId,
        tripEventId: req.body.tripEventId,
        userId: res.locals.user.sub,
      });

      // Verify that next was called with the error
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);

      // Verify that res.status and res.send were not called
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });
});

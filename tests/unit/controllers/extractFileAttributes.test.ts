import { Request, Response } from 'express';
import { FileController } from '../../../src/controllers';
import { FileInterpreterManager } from '../../../src/integrations/fileInterpreter';
import { initializeFileControllerTestSetup } from '../helpers/fileControllerTestSetup';
import { StatusCodes } from 'http-status-codes';

describe('FileController - extractFileAttributes', () => {
  let fileController: FileController;
  let fileInterpreterManagerMock: jest.Mocked<FileInterpreterManager>;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ fileController, fileInterpreterManagerMock, req, res } = initializeFileControllerTestSetup());
  });
  const next = jest.fn();

  describe('Success Cases', () => {
    it('should successfully extract and return the attributes from a file', async () => {
      req.file = { buffer: Buffer.from('Testing Buffer') } as Express.Multer.File;

      const extractedAttributes = { key: 'value' };

      fileInterpreterManagerMock.processFile.mockResolvedValue(extractedAttributes);

      await fileController.extractFileAttributes(req, res, next);

      // Verify that processFile was called correctly
      expect(fileInterpreterManagerMock.processFile).toHaveBeenCalledTimes(1);
      expect(fileInterpreterManagerMock.processFile).toHaveBeenCalledWith(req.file.buffer);

      // Verify that res.status and res.send were called with the correct arguments
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        error: false,
        message: 'Attributes extracted succesfully',
        body: extractedAttributes,
      });

      // Verify that next was not called
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should call next with error when req.file is undefined', async () => {
      // req.file is undefined

      await fileController.extractFileAttributes(req, res, next);

      // Verify that next was called with an error
      expect(next).toHaveBeenCalledTimes(1);

      // Verify that processFile was not called
      expect(fileInterpreterManagerMock.processFile).not.toHaveBeenCalled();

      // Verify that res.status and res.send were not called
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it('should call next with error when fileInterpreterManager.processFile throws an exception', async () => {
      // Set up the request with a file buffer
      req.file = { buffer: Buffer.from('Testing Buffer') } as Express.Multer.File;

      // Simulate an exception thrown by processFile
      const error = new Error('Processing failed');
      fileInterpreterManagerMock.processFile.mockRejectedValue(error);

      await fileController.extractFileAttributes(req, res, next);

      // Verify that processFile was called with the correct buffer
      expect(fileInterpreterManagerMock.processFile).toHaveBeenCalledTimes(1);
      expect(fileInterpreterManagerMock.processFile).toHaveBeenCalledWith(req.file.buffer);

      // Verify that next was called with the error
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);

      // Verify that res.status and res.send were not called
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });
});

import { Request, Response } from 'express';
import { FileController } from '../../src/controllers';
import { ICacheAdapter } from '../../src/cache/adapters';
import { FileService } from '../../src/services';
import { FileStorageManager } from '../../src/integrations/fileStorage';
import { FileInterpreterManager } from '../../src/integrations/fileInterpreter';

export function initializeFileControllerTestSetup() {
  // Create mocks
  const fileServiceMock = {
    fileExists: jest.fn(),
    uploadAndSaveFile: jest.fn(),
  } as unknown as jest.Mocked<FileService>;

  const fileStorageManagerMock = {
    getSignedUrl: jest.fn(),
  } as unknown as jest.Mocked<FileStorageManager>;

  const fileInterpreterManagerMock = {
    processFile: jest.fn(),
  } as unknown as jest.Mocked<FileInterpreterManager>;

  const cacheMock = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<ICacheAdapter>;

  // Initialize controller with mocks
  const fileController = new FileController(
    fileServiceMock,
    fileStorageManagerMock,
    fileInterpreterManagerMock,
    cacheMock,
  );

  // Create request and response objects
  const req = {} as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  } as unknown as jest.Mocked<Response>;

  return {
    fileController,
    fileServiceMock,
    fileStorageManagerMock,
    fileInterpreterManagerMock,
    cacheMock,
    req,
    res,
  };
}

jest.mock('../../src/cache/adapters/redis/redisAdapter', () => {
  return {
    RedisCacheAdapter: jest.fn().mockImplementation(() => {
      return {
        connectClient: jest.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

const userId = 'test-user-id';
jest.mock('../../src/middlewares/authorization', () => ({
  checkAuthToken: jest.fn((req, res, next) => {
    res.locals.user = { sub: userId };
    next();
  }),
}));

import request from 'supertest';
import app from '../../src/app';
import FileService from '../../src/services/fileService';
import { checkAuthToken } from '../../src/middlewares/authorization';
import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';

const mockFile = {
  file_id: uuidv4(),
  file_original_name: 'test-file.pdf',
  file_type_id: uuidv4(),
  is_deleted: false,
  file_extension: 'pdf',
  file_size: 1024,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  created_by: 'user123',
  updated_by: 'user123',
  file_hash: 'abc123hash',
  file_unique_name: 'unique123name',
};

describe('File Service - Upload and Retrieve File', () => {
  let uploadAndSaveFileMock: jest.SpyInstance;
  const tripId = uuidv4();

  beforeEach(() => {
    jest.clearAllMocks();
    uploadAndSaveFileMock = jest
      .spyOn(FileService.prototype, 'uploadAndSaveFile')
      .mockResolvedValue(mockFile);
  });

  it('should ensure checkAuthToken is mocked', () => {
    expect(jest.isMockFunction(checkAuthToken)).toBe(true);
  });

  it('should upload a file', async () => {
    // upload a file
    const uploadResponse = await request(app)
      .post('/files/upload')
      .attach('file', Buffer.from('Test file content'), 'test-file.pdf')
      .field('tripId', tripId)
      .field('fileTypeId', mockFile.file_type_id);

    expect(uploadResponse.status).toBe(StatusCodes.OK);
    expect(uploadResponse.body).toBeDefined();
    expect(uploadResponse.body.message).toBe('File uploaded successfully');
    expect(uploadResponse.body.error).toBe(false);
    expect(uploadResponse.body.data).toBeDefined();

    // Assert the data returned matches expected values
    expect(uploadResponse.body.data).toMatchObject({
      file_id: mockFile.file_id,
      file_unique_name: mockFile.file_unique_name,
      file_original_name: mockFile.file_original_name,
      file_type_id: mockFile.file_type_id,
      file_extension: mockFile.file_extension,
      file_size: mockFile.file_size,
      is_deleted: false,
      created_by: mockFile.created_by,
      updated_by: mockFile.updated_by,
      file_hash: mockFile.file_hash,
    });

    // Ensure the service method was called with correct parameters
    expect(uploadAndSaveFileMock).toHaveBeenCalledWith(expect.any(Object), {
      fileTypeId: mockFile.file_type_id,
      tripId,
      tripEventId: undefined,
      userId: userId,
    });
  });

  it('should return 400 Bad Request when missing tripId and tripEventId', async () => {
    // Attempt to upload without tripId and tripEventId
    const uploadResponse = await request(app)
      .post('/files/upload')
      .attach('file', Buffer.from('Test file content'), 'test-file.pdf')
      .field('fileTypeId', mockFile.file_type_id);

    // Assert the response status and structure
    expect(uploadResponse.status).toBe(StatusCodes.BAD_REQUEST);
    expect(uploadResponse.body.message).toBe('Missing input parameters');
    expect(uploadResponse.body.error).toBe(true);
    expect(uploadResponse.body.data).toBeNull();

    // Ensure the service method was not called
    expect(uploadAndSaveFileMock).not.toHaveBeenCalled();
  });

  it('should return 400 Bad Request when missing fileTypeId', async () => {
    // Attempt to upload without fileTypeId
    const uploadResponse = await request(app)
      .post('/files/upload')
      .attach('file', Buffer.from('Test file content'), 'test-file.pdf')
      .field('tripId', tripId);

    // Assert the response status and structure
    expect(uploadResponse.status).toBe(StatusCodes.BAD_REQUEST);
    expect(uploadResponse.body.message).toBe('Missing input parameters');
    expect(uploadResponse.body.error).toBe(true);
    expect(uploadResponse.body.data).toBeNull();

    // Ensure the service method was not called
    expect(uploadAndSaveFileMock).not.toHaveBeenCalled();
  });
});

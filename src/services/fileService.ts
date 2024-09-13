import { IFile, FileUploadInput } from '../entities';
import { FileStorageManager, GCSStorageProvider } from '../integrations/fileStorage';
import { FileRepository, FileTripEventRepository } from '../repositories';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { CustomError } from '../middlewares';
import { StatusCodes } from 'http-status-codes';

class FileService {
  private fileRepository = new FileRepository();
  private fileTripEventRepository = new FileTripEventRepository();
  private fileStorageManager = new FileStorageManager(new GCSStorageProvider());

  async fileExists(fileName: string): Promise<boolean> {
    const file = await this.fileRepository.getFileByUniqueName(fileName);
    return file ? true : false;
  }

  async uploadAndSaveFile(file: Express.Multer.File, input: FileUploadInput): Promise<IFile> {
    const { tripId, tripEventId, fileTypeId } = input;
    const { mimetype, size, buffer, originalname } = file;

    const ext = path.extname(originalname).toLowerCase();
    const baseName = path.basename(originalname, ext).replace(/[^a-zA-Z0-9_.-]/g, '');
    const uniqueName = `${uuidv4()}_${baseName}${ext}`;
    const fileHash = createHash('sha256').update(buffer).digest('hex');

    const fileHashCounts = await this.fileRepository.countFilesByHashAndTrip(fileHash, tripId, tripEventId);
    if (isNaN(fileHashCounts)) {
      throw new CustomError('Error checking file existence.', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    if (fileHashCounts > 0) {
      throw new CustomError('File already uploaded.', StatusCodes.CONFLICT);
    }

    const fileData: IFile = {
      file_original_name: originalname,
      file_unique_name: uniqueName,
      file_type_id: fileTypeId,
      file_extension: mimetype,
      file_size: size,
      file_hash: fileHash,
    };

    const [newFile] = await Promise.all([
      this.fileRepository.saveFile(fileData),
      this.fileStorageManager.uploadFile(buffer, uniqueName),
    ]);

    if (newFile.file_id) {
      const fileTripEventData = {
        file_id: newFile.file_id,
        trip_id: fileTypeId,
        trip_event_id: tripEventId,
      };
      await this.fileTripEventRepository.create(fileTripEventData);
    }

    return newFile;
  }
}

export default FileService;

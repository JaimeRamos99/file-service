import { IFile, UploadInput } from '../entities';
import { FileStorageManager, GCSStorageProvider } from '../integrations/fileStorage';
import { FileRepository, FileTripEventRepository } from '../repositories';

class FileService {
  private fileRepository = new FileRepository();
  private fileTripEventRepository = new FileTripEventRepository();
  private fileStorageManager = new FileStorageManager(new GCSStorageProvider());

  async fileExists(fileName: string): Promise<boolean> {
    const file = await this.fileRepository.getFileByName(fileName);
    return file ? true : false;
  }

  async uploadAndSaveFile(file: Express.Multer.File, input: UploadInput): Promise<IFile> {
    const { trip_id, trip_event_id, file_type_id } = input;
    const { filename, mimetype, size, path } = file;
    const fileData: IFile = {
      file_name: filename,
      file_type_id,
      file_extension: mimetype,
      file_size: size,
    };

    const [newFile] = await Promise.all([
      this.fileRepository.saveFile(fileData),
      this.fileStorageManager.uploadFile(path),
    ]);

    if (newFile.file_id) {
      const fileTripEventData = {
        file_id: newFile.file_id,
        trip_id,
        trip_event_id,
      };
      await this.fileTripEventRepository.create(fileTripEventData);
    }

    return newFile;
  }
}

export default FileService;

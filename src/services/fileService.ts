import { IFile } from '../entities/file';
import { FileRepository } from '../repositories';

class FileService {
  private fileRepository = new FileRepository();

  async fileExists(fileName: string): Promise<boolean> {
    const file = await this.fileRepository.getFileByName(fileName);
    return file ? true : false;
  }

  async saveFile(file: Express.Multer.File): Promise<IFile> {
    const { filename, mimetype, size } = file;
    const fileData: IFile = {
      file_name: filename,
      file_type: 'TBD',
      file_extension: mimetype,
      file_size: size,
    };
    return await this.fileRepository.saveFile(fileData);
  }
}

export default FileService;

import { FileRepository } from '../repositories';

class FileService {
  private fileRepository = new FileRepository();

  async fileExists(fileName: string): Promise<boolean> {
    const file = await this.fileRepository.getFileByName(fileName);
    return file ? true : false;
  }
}

export default FileService;

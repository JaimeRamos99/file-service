export interface IFileStorageProvider {
  uploadFile(filePath: string): Promise<string>;
  getFileLink(fileName: string): Promise<string>;
  deleteFile(): Promise<void>;
}

export interface IStorageConfig {
  bucketName: string;
  options: Record<string, any>;
}

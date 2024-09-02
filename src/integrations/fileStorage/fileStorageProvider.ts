export interface IFileStorageProvider {
  uploadFile(filePath: string): Promise<void>;
  getSignedURL(fileName: string): Promise<string>;
  deleteFile(): Promise<void>;
}

export interface IStorageConfig {
  bucketName: string;
  options: Record<string, string>;
}

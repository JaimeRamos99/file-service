export interface IFileStorageProvider {
  uploadFile(filePath: string): Promise<void>;
  getSignedURL(fileName: string): Promise<string>;
  deleteFile(): Promise<void>;
}

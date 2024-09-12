export interface IFileStorageProvider {
  uploadFile(fileBuffer: Buffer, fileName: string): Promise<void>;
  getSignedURL(fileName: string): Promise<string>;
  deleteFile(): Promise<void>;
}

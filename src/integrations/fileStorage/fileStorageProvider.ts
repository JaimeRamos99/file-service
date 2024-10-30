export interface IFileStorageProvider {
  uploadFile(fileBuffer: Buffer, fileName: string): Promise<void>;
  getSignedUrl(fileName: string): Promise<string>;
  deleteFile(): Promise<void>;
}

export interface IFileStorageProvider {
    uploadFile(): Promise<string>;
    getFileLink(): Promise<string>;
    deleteFile(): Promise<void>;
}

export interface IStorageConfig {
    bucketName: string;
    options: Record<string, any>
}
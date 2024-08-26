import { IFileStorageProvider } from "./fileStorageProvider";

export default class FileStorageManager {
    private provider: IFileStorageProvider;
    constructor(provider: IFileStorageProvider) {
        this.provider = provider;
    }

    async uploadFile(FilePath: string) {
        await this.provider.uploadFile(FilePath)
    }
};
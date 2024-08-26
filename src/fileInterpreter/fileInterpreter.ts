export interface IFileInterpreter {
    extractDocumentFields(filePath: string): unknown;
}
export interface IFileInterpreter {
  extractDocumentFields(filePath: string): Promise<Record<string, string> | undefined>;
}

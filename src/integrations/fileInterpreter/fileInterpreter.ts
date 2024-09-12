export interface IFileInterpreter {
  extractDocumentFields(file: Buffer): Promise<Record<string, string> | undefined>;
}

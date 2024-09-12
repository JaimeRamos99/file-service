import { IFileInterpreter } from './fileInterpreter';

export default class FileInterpreterManager {
  private interpreter: IFileInterpreter;
  constructor(interpreter: IFileInterpreter) {
    this.interpreter = interpreter;
  }

  async processFile(file: Buffer) {
    return await this.interpreter.extractDocumentFields(file);
  }
}

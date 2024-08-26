import { IFileInterpreter } from "./fileInterpreter";

export default class FileInterpreterManager {
    private interpreter: IFileInterpreter;
    constructor(interpreter: IFileInterpreter) {
        this.interpreter = interpreter;
    }

    async processFile(FilePath: string) {
        await this.interpreter.extractDocumentFields(FilePath)
    }
};
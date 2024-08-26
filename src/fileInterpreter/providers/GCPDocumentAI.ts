import { env } from "../../utils";
import { IFileInterpreter } from "../fileInterpreter";
import { promises as fs } from 'fs';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai/build/src/v1';


const client = new DocumentProcessorServiceClient();

export class GCPDocumentAI implements IFileInterpreter{
    private processorName: string;
    
    constructor() {
        this.processorName = `projects/${env.GCP_PROJECT_ID}/locations/${env.GCP_DOCUMENTAI_LOCATION}/processors/${env.GCP_DOCUMENTAI_PROCESSOR_ID}`;
    }

    async extractDocumentFields(filePath: string) {
        // Read the file into memory.
        const imageFile = await fs.readFile(filePath);
        // Convert the file data to a Buffer and base64 encode it.
        const encodedImage = Buffer.from(imageFile).toString('base64');

        const request = {
            name: this.processorName,
            rawDocument: {
                content: encodedImage,
                mimeType: 'application/pdf',
            },
        };
        const [result] = await client.processDocument(request);

    }
}
import { env } from '../../../utils';
import { IFileInterpreter } from '../fileInterpreter';
import { promises as fs } from 'fs';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai/build/src/v1';
import { ExtractedAttributes } from '../interfaces';

const client = new DocumentProcessorServiceClient();

export default class GCPDocumentAI implements IFileInterpreter {
  private processorName: string;

  constructor() {
    this.processorName = `projects/${env.GCP_PROJECT_ID}/locations/${env.GCP_DOCUMENTAI_LOCATION}/processors/${env.GCP_DOCUMENTAI_PROCESSOR_ID}`;
  }

  async extractDocumentFields(filePath: string): Promise<Record<string, string> | undefined> {
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
    const { document } = result;

    return document?.entities?.reduce((accumulator: Record<string, string>, entity) => {
      if (entity.type) {
        accumulator[entity.type] =
          entity.type === ExtractedAttributes.EVENT_DATE
            ? (entity.normalizedValue?.text ?? 'Unknown Date')
            : (entity.mentionText ?? 'Unknown Date');
      }
      return accumulator;
    }, {});
  }
}

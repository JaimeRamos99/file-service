import { Request, Response, NextFunction } from 'express';
import { deleteFile } from '../utils';
import { FileInterpreterManager, GCPDocumentAI } from '../entities/fileInterpreter';

export async function fileInterpreterController(req: Request, res: Response, next: NextFunction) {
  try {
    const filePath = req.file!.path;

    // extract file attributes
    const fileInterpreterManager = new FileInterpreterManager(new GCPDocumentAI());
    const response = await fileInterpreterManager.processFile(filePath);

    // delete local file
    deleteFile(filePath);

    res.status(200).send({ error: false, body: response });
  } catch (err) {
    console.error('Error extracting file attributes:', err);
    res.status(500).send({ error: true, message: 'Internal server error' });
  }
}

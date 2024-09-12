import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

const allowedFileTypes: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

const storage = multer.memoryStorage();

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedFileTypes[ext] && allowedFileTypes[ext] === file.mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type!'));
  }
};

// Initialize Multer with storage configuration
export const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5, files: 1 }, // 5MB limit
  fileFilter,
});

export const checkFilePresence = (req: Request, res: Response, next: NextFunction) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ error: true, message: 'No file uploaded.' });
  }
  next();
};

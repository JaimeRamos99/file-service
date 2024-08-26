import multer, { FileFilterCallback, } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { env } from '../utils/secretManager'
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const allowedFileTypes: Record<string, string> = {
  '.pdf': 'application/pdf',
};

// Directory to save the uploaded files
const UPLOAD_DIR = path.join(process.cwd(), env.UPLOAD_TEMP_FOLDER_NAME);

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_DIR); 
    },
    filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_.-]/g, '');
    const uniqueName = `${uuidv4()}_${baseName}${ext}`;
      cb(null, uniqueName);
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedFileTypes[ext] && allowedFileTypes[ext] === file.mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only PDF is allowed!'));
  }
};

// Initialize Multer with storage configuration
export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5, files: 1 }, // 5MB limit
    fileFilter,
});

export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
    const filePath = req.file?.path;
    if (!filePath) {
        return res.status(400).send({ error: true, message: 'No file uploaded.' });
    }
    next();
};
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory to save the uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + Date.now() + path.extname(file.originalname)); // Append timestamp to file name
    }
});
  
// Initialize Multer with storage configuration
export const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      // Check the file extension to ensure it's a PDF
      if (path.extname(file.originalname).toLowerCase() !== '.pdf') {
        // Pass null as to the first argument to indicate no system error
        // Pass false as the second argument because it only indicates the file is rejected
        return cb(new Error('Only PDFs are allowed'));
      }
      // If the file is a PDF, accept the file
      cb(null, true);
    }
});
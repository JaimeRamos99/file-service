import express from "express";
import { upload, validateFileUpload } from "../middlewares";
import {
  FileStorageManager,
  GCSStorageProvider,
} from "../entities/fileStorage";
import {
  FileInterpreterManager,
  GCPDocumentAI,
} from "../entities/fileInterpreter";
import { deleteFile } from "../utils";

const filesRouter = express.Router();

filesRouter.post(
  "/upload",
  upload.single("file"),
  validateFileUpload,
  async (req, res) => {
    try {
      const filePath = req.file!.path;

      // upload file to cloud provider
      const fileStorageManager = new FileStorageManager(
        new GCSStorageProvider(),
      );
      await fileStorageManager.uploadFile(filePath);

      res
        .status(200)
        .send({ error: false, message: "File uploaded successfully" });
    } catch (err) {
      console.error("Error uploading file:", err);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
);

filesRouter.post(
  "/extract-attributes",
  upload.single("file"),
  validateFileUpload,
  async (req, res) => {
    const filePath = req.file!.path;

    // extract file attributes
    const fileInterpreterManager = new FileInterpreterManager(
      new GCPDocumentAI(),
    );
    await fileInterpreterManager.processFile(filePath);

    // delete local file
    deleteFile(filePath);
  },
);

export default filesRouter;

import fs from "fs";

/**
 * Deletes a specified file and logs any errors encountered during the deletion.
 * @param {string} filePath - The path of the file to delete.
 */
export function deleteFile(filePath: string): void {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Failed to delete file:", err);
    } else {
      console.log(`File deleted: ${filePath}`);
    }
  });
}

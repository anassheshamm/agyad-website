import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultDirectory = path.resolve(moduleDirectory, "../../../uploads");

// On Hostinger, set UPLOAD_DIR to a folder OUTSIDE the deployed project
export const uploadsDirectory = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : defaultDirectory;

export const ensureUploadsDirectory = () => mkdir(uploadsDirectory, { recursive: true });
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultDirectory = path.resolve(moduleDirectory, "../../../uploads");

export const uploadsDirectory = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : defaultDirectory;

export const thumbsDirectory = path.join(uploadsDirectory, "thumbs");

export const ensureUploadsDirectory = async () => {
  await mkdir(uploadsDirectory, { recursive: true });
  await mkdir(thumbsDirectory, { recursive: true });
};
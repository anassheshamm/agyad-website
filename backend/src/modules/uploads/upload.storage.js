import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDirectory = path.resolve(moduleDirectory, "../../../uploads");

export const ensureUploadsDirectory = () => mkdir(uploadsDirectory, { recursive: true });

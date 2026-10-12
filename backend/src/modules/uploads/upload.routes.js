import { Router } from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import auth from "../../middleware/auth.middleware.js";
import { ensureUploadsDirectory, uploadsDirectory } from "./upload.storage.js";

const router = Router();
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 10 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error("Only JPG, PNG, and WebP images are allowed");
      error.status = 400;
      return callback(error);
    }
    return callback(null, true);
  },
});

function getImageExtension(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "png";
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

function uploadError(error) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") return { status: 413, message: "Each image must be 2 MB or smaller" };
    if (error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE") return { status: 400, message: "You can upload up to 10 images per request" };
    return { status: 400, message: "The uploaded files could not be processed" };
  }
  return { status: error.status || 500, message: error.status ? error.message : "Image upload failed" };
}

router.post("/", auth, (req, res, next) => {
  upload.array("images", 10)(req, res, async (error) => {
    if (error) {
      const result = uploadError(error);
      return res.status(result.status).json({ success: false, message: result.message });
    }
    try {
      const files = req.files || [];
      if (!files.length) return res.status(400).json({ success: false, message: "Select at least one image" });
      const detected = files.map((file) => getImageExtension(file.buffer));
      if (detected.some((extension) => !extension)) {
        return res.status(400).json({ success: false, message: "One or more files are not valid JPG, PNG, or WebP images" });
      }

      await ensureUploadsDirectory();
      const saved = [];
      try {
        for (let index = 0; index < files.length; index += 1) {
          const filename = `${randomUUID()}.${detected[index]}`;
          const filePath = path.join(uploadsDirectory, filename);
          await writeFile(filePath, files[index].buffer, { flag: "wx", mode: 0o644 });
          saved.push({ url: `/uploads/${filename}`, filePath });
        }
      } catch (saveError) {
        await Promise.allSettled(saved.map(({ filePath }) => unlink(filePath)));
        throw saveError;
      }
      return res.status(201).json({ success: true, data: { images: saved.map(({ url }) => ({ url })) } });
    } catch (saveError) {
      return next(saveError);
    }
  });
});

export default router;

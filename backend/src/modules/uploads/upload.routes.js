import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import path from "node:path";
import auth from "../../middleware/auth.middleware.js";
import { ensureUploadsDirectory, uploadsDirectory, thumbsDirectory } from "./upload.storage.js";

const router = Router();
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per image (original upload)
const MAX_FILES = 10;
const FULL_WIDTH = 1920;
const THUMB_WIDTH = 480;

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error("Only JPG, PNG, and WebP images are allowed");
      error.status = 400;
      return callback(error);
    }
    return callback(null, true);
  },
});

// Check the real file signature, not just the declared mime type
function isSupportedImage(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return true;
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return true;
  return false;
}

// Saves a resized full image + a small thumbnail, both as WebP
async function processImage(buffer) {
  const filename = `${randomUUID()}.webp`;
  const fullPath = path.join(uploadsDirectory, filename);
  const thumbPath = path.join(thumbsDirectory, filename);

  try {
    const source = sharp(buffer).rotate(); // fixes phone photo orientation
    await source
      .clone()
      .resize({ width: FULL_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(fullPath);
    await source
      .clone()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(thumbPath);
  } catch (error) {
    console.error("Image processing failed:", error.message);
    await Promise.allSettled([unlink(fullPath), unlink(thumbPath)]);
    const err = new Error("One of the images could not be processed");
    err.status = 400;
    throw err;
  }

  return {
    url: `/uploads/${filename}`,
    thumbUrl: `/uploads/thumbs/${filename}`,
    paths: [fullPath, thumbPath],
  };
}

function uploadError(error) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") return { status: 413, message: "Each image must be 10 MB or smaller" };
    if (error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE") return { status: 400, message: `You can upload up to ${MAX_FILES} images per request` };
    return { status: 400, message: "The uploaded files could not be processed" };
  }
  return { status: error.status || 500, message: error.status ? error.message : "Image upload failed" };
}

router.post("/", auth, (req, res, next) => {
  upload.array("images", MAX_FILES)(req, res, async (error) => {
    if (error) {
      const result = uploadError(error);
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const saved = [];
    try {
      const files = req.files || [];
      if (!files.length) return res.status(400).json({ success: false, message: "Select at least one image" });
      if (files.some((file) => !isSupportedImage(file.buffer))) {
        return res.status(400).json({ success: false, message: "One or more files are not valid JPG, PNG, or WebP images" });
      }

      await ensureUploadsDirectory();

      // One at a time to keep memory/CPU low on shared hosting
      for (const file of files) {
        saved.push(await processImage(file.buffer));
      }

      return res.status(201).json({
        success: true,
        data: { images: saved.map(({ url, thumbUrl }) => ({ url, thumbUrl })) },
      });
    } catch (saveError) {
      await Promise.allSettled(saved.flatMap(({ paths }) => paths.map((p) => unlink(p))));
      return next(saveError);
    }
  });
});

export default router;
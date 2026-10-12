import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import serviceRoutes from "./modules/services/service.routes.js";
import galleryRoutes from "./modules/gallery/gallery.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import uploadRoutes from "./modules/uploads/upload.routes.js";
import { uploadsDirectory } from "./modules/uploads/upload.storage.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDirectory, { index: false }));

app.get("/api/health", (_req, res) => res.status(200).json({
  success: true,
  message: "Bab Ajyad API is running",
}));

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/contact", contactRoutes);

app.use((err, _req, res, _next) => {
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ success: false, message: err.message });
  }
  console.error(err);
  if (err.name === "ValidationError") return res.status(400).json({ success: false, message: "Validation failed" });
  if (err.name === "CastError") return res.status(400).json({ success: false, message: "Invalid ID" });
  if (err.code === 11000) return res.status(409).json({ success: false, message: "A record with that value already exists" });
  return res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;

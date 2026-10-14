import express from "express";
import cors from "cors";
import mongoose from "mongoose";
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
// app.use("/uploads", express.static(uploadsDirectory, { index: false }));
app.use("/uploads", express.static(uploadsDirectory, { index: false, maxAge: "30d", immutable: true }));

const databaseConnected = () => mongoose.connection.readyState === 1;

app.get("/api/health", (_req, res) => {
  const readyState = mongoose.connection.readyState;
  const connected = readyState === 1;
  const databaseStatus = ["disconnected", "connected", "connecting", "disconnecting"][readyState] || "unknown";
  return res.status(connected ? 200 : 503).json({
    success: connected,
    server: "running",
    database: {
      connected,
      status: databaseStatus,
    },
  });
});

const requireDatabase = (_req, res, next) => {
  if (!databaseConnected()) {
    return res.status(503).json({
      success: false,
      message: "Database unavailable",
    });
  }
  return next();
};

app.use("/api/auth", requireDatabase, authRoutes);
app.use("/api/services", requireDatabase, serviceRoutes);
app.use("/api/gallery", requireDatabase, galleryRoutes);
app.use("/api/projects", requireDatabase, projectRoutes);
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

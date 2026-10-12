import mongoose from "mongoose";
import * as service from "./service.service.js";
const send = (res, data, status = 200) =>
  res.status(status).json({ success: true, data });
export async function list(_req, res, next) {
  try {
    return send(res, await service.list());
  } catch (e) {
    return next(e);
  }
}
export async function listAll(_req, res, next) {
  try {
    return send(res, await service.listAll());
  } catch (e) {
    return next(e);
  }
}
export async function get(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const d = await service.get(req.params.id);
    return d
      ? send(res, d)
      : res.status(404).json({ success: false, message: "Service not found" });
  } catch (e) {
    return next(e);
  }
}
export async function create(req, res, next) {
  try {
    return send(res, await service.create(req.body), 201);
  } catch (e) {
    return next(e);
  }
}
export async function update(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const d = await service.update(req.params.id, req.body);
    return d
      ? send(res, d)
      : res.status(404).json({ success: false, message: "Service not found" });
  } catch (e) {
    return next(e);
  }
}
export async function remove(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const d = await service.remove(req.params.id);
    return d
      ? send(res, d)
      : res.status(404).json({ success: false, message: "Service not found" });
  } catch (e) {
    return next(e);
  }
}

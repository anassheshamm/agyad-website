import Project from "./project.model.js";
import mongoose from "mongoose";
export const list = ({ featured }) => Project.find({ isPublished: true, ...(featured === "true" ? { isFeatured: true } : {}) }).sort({ order: 1, year: -1, createdAt: -1 });
export const get = (id) => Project.findOne({ ...(mongoose.isValidObjectId(id) ? { _id: id } : { slug: id }), isPublished: true });
const slugify = (value) => String(value || "").toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
const uniqueSlug = async (base) => {
  let candidate = base;
  let suffix = 2;
  while (await Project.exists({ slug: candidate })) candidate = `${base}-${suffix++}`;
  return candidate;
};
const validateImageCount = (coverImage, images) => {
  const uniqueImages = new Set([coverImage, ...(images || [])].filter((url) => typeof url === "string" && url.trim()).map((url) => url.trim()));
  if (uniqueImages.size > 10) {
    const error = new Error("A project can have up to 10 unique images, including its cover image");
    error.status = 400;
    throw error;
  }
};

export const create = async (data) => {
  validateImageCount(data.coverImage, data.images);
  const baseSlug = slugify(data.slug) || slugify(data.title) || "project";
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = await uniqueSlug(baseSlug);
    try {
      return await Project.create({ ...data, slug });
    } catch (error) {
      // A concurrent request can claim the candidate after the uniqueness check.
      if (error.code !== 11000 || attempt === 4) throw error;
    }
  }
  return null;
};

export const update = async (id, data) => {
  if (!mongoose.isValidObjectId(id)) return null;
  const existing = await Project.findById(id);
  if (!existing) return null;
  validateImageCount(
    Object.hasOwn(data, "coverImage") ? data.coverImage : existing.coverImage,
    Object.hasOwn(data, "images") ? data.images : existing.images,
  );
  return Project.findByIdAndUpdate(id, { ...data, slug: existing.slug }, { new: true, runValidators: true });
};
export const remove = (id) => mongoose.isValidObjectId(id) ? Project.findByIdAndDelete(id) : null;

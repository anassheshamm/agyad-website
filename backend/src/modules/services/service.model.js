import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    items: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_document, result) => {
        // Older service records may still contain the removed icon property.
        delete result.icon;
        return result;
      },
    },
  },
);
export default mongoose.models.Service || mongoose.model("Service", schema);

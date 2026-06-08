import mongoose from "mongoose";
const s = new mongoose.Schema({
  name:     { type: String, required: true, unique: true },
  slug:     { type: String, required: true, unique: true },
  icon:     { type: String, default: "💼" },
  description: { type: String, default: "" },
  jobCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.models.Category || mongoose.model("Category", s);

import mongoose from "mongoose";
const s = new mongoose.Schema({
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  logo:        { type: String, default: null },
  coverImage:  { type: String, default: null },
  description: { type: String, default: "" },
  industry:    { type: String, required: true },
  size:        { type: String, enum: ["1-10","11-50","51-200","201-500","501-1000","1000+"], default: "1-10" },
  founded:     { type: Number, default: null },
  website:     { type: String, default: "" },
  location:    { type: String, default: "" },
  socialLinks: { linkedin: { type: String, default: "" }, twitter: { type: String, default: "" }, facebook: { type: String, default: "" } },
  isApproved:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  ratings:     { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
}, { timestamps: true });
export default mongoose.models.Company || mongoose.model("Company", s);

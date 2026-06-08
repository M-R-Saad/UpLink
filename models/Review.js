import mongoose from "mongoose";
const s = new mongoose.Schema({
  company:           { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  user:              { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating:            { type: Number, required: true, min: 1, max: 5 },
  title:             { type: String, default: "" },
  comment:           { type: String, required: true },
  pros:              { type: String, default: "" },
  cons:              { type: String, default: "" },
  isCurrentEmployee: { type: Boolean, default: false },
  employmentType:    { type: String, enum: ["full-time","part-time","contract","intern"], default: "full-time" },
  isApproved:        { type: Boolean, default: true },
  isAnonymous:       { type: Boolean, default: false },
}, { timestamps: true });
s.index({ company: 1, user: 1 }, { unique: true });
export default mongoose.models.Review || mongoose.model("Review", s);

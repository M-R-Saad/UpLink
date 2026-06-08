import mongoose from "mongoose";
const s = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  label:           { type: String, required: true },
  keywords:        [{ type: String }],
  categories:      [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  jobTypes:        [{ type: String }],
  locationType:    { type: String, enum: ["any","remote","onsite","hybrid"], default: "any" },
  locations:       [{ type: String }],
  frequency:       { type: String, enum: ["instant","daily","weekly"], default: "instant" },
  isActive:        { type: Boolean, default: true },
  lastTriggeredAt: { type: Date, default: null },
}, { timestamps: true });
export default mongoose.models.JobAlert || mongoose.model("JobAlert", s);

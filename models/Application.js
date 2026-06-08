import mongoose from "mongoose";
const statusHistorySchema = new mongoose.Schema({
  status: String, changedAt: { type: Date, default: Date.now }, note: { type: String, default: "" },
}, { _id: false });
const s = new mongoose.Schema({
  job:           { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicant:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company:       { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  resumeURL:     { type: String, required: true },
  coverLetter:   { type: String, default: "" },
  status:        { type: String, enum: ["pending","reviewed","shortlisted","interview","rejected","hired"], default: "pending" },
  statusHistory: [statusHistorySchema],
  employerNote:  { type: String, default: "" },
  isWithdrawn:   { type: Boolean, default: false },
}, { timestamps: true });
s.index({ job: 1, applicant: 1 }, { unique: true });
export default mongoose.models.Application || mongoose.model("Application", s);

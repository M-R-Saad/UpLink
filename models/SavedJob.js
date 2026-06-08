import mongoose from "mongoose";
const s = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job:  { type: mongoose.Schema.Types.ObjectId, ref: "Job",  required: true },
}, { timestamps: true });
s.index({ user: 1, job: 1 }, { unique: true });
export default mongoose.models.SavedJob || mongoose.model("SavedJob", s);

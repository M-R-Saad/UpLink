import mongoose from "mongoose";
const s = new mongoose.Schema({
  title:            { type: String, required: true },
  slug:             { type: String, required: true, unique: true },
  company:          { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  postedBy:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category:         { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description:      { type: String, required: true },
  requirements:     [{ type: String }],
  responsibilities: [{ type: String }],
  skills:           [{ type: String }],
  jobType:          { type: String, enum: ["full-time","part-time","contract","internship","freelance"], required: true },
  locationType:     { type: String, enum: ["onsite","remote","hybrid"], default: "onsite" },
  location:         { type: String, default: "" },
  salary: {
    min:           { type: Number, default: null },
    max:           { type: Number, default: null },
    currency:      { type: String, default: "BDT" },
    period:        { type: String, enum: ["monthly","yearly","hourly"], default: "monthly" },
    isNegotiable:  { type: Boolean, default: false },
    isUndisclosed: { type: Boolean, default: false },
  },
  experience:        { type: String, enum: ["entry","mid","senior","lead","any"], default: "any" },
  deadline:          { type: Date, required: true },
  vacancies:         { type: Number, default: 1 },
  status:            { type: String, enum: ["active","paused","closed","draft"], default: "active" },
  isFeatured:        { type: Boolean, default: false },
  applicationCount:  { type: Number, default: 0 },
  viewCount:         { type: Number, default: 0 },
}, { timestamps: true });
s.index({ title: "text", description: "text", skills: "text" });
export default mongoose.models.Job || mongoose.model("Job", s);

import mongoose from "mongoose";
const experienceSchema = new mongoose.Schema({
  title: String, company: String, location: String,
  startDate: String, endDate: String, isCurrent: { type: Boolean, default: false }, description: String,
}, { _id: true });
const educationSchema = new mongoose.Schema({
  degree: String, institution: String, field: String,
  startYear: Number, endYear: Number, isOngoing: { type: Boolean, default: false },
}, { _id: true });
const s = new mongoose.Schema({
  user:              { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  headline:          { type: String, default: "" },
  bio:               { type: String, default: "" },
  phone:             { type: String, default: "" },
  location:          { type: String, default: "" },
  skills:            [{ type: String }],
  experience:        [experienceSchema],
  education:         [educationSchema],
  links: {
    github:    { type: String, default: "" },
    linkedin:  { type: String, default: "" },
    portfolio: { type: String, default: "" },
    other:     { type: String, default: "" },
  },
  resumeURL:         { type: String, default: null },
  resumeData:        { type: mongoose.Schema.Types.Mixed, default: null },
  isOpenToWork:      { type: Boolean, default: true },
  preferredJobTypes: [{ type: String }],
  preferredLocations:[{ type: String }],
}, { timestamps: true });
export default mongoose.models.Profile || mongoose.model("Profile", s);

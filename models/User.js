import mongoose from "mongoose";
const s = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, default: null },
  role:         { type: String, enum: ["jobseeker","employer","admin"], default: "jobseeker" },
  photoURL:     { type: String, default: null },
  authProvider: { type: String, enum: ["credentials","google"], default: "credentials" },
  isActive:     { type: Boolean, default: true },
  emailVerified:{ type: Boolean, default: false },
  company:      { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
}, { timestamps: true });
export default mongoose.models.User || mongoose.model("User", s);

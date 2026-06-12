import { connectDB } from "../../../../../lib/db";
import Application from "../../../../../models/Application";
import Job from "../../../../../models/Job";
import Profile from "../../../../../models/Profile";
import { auth } from "../../../../../lib/auth";
import { applySchema } from "../../../../../schemas/applicationSchemas";

export const runtime = "nodejs";

export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "jobseeker") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id: jobId } = await params;
    await connectDB();

    // Check job exists and is active
    const job = await Job.findById(jobId).populate("company", "isApproved");
    if (!job || job.status !== "active" || new Date(job.deadline) < new Date()) {
      return Response.json({ success: false, message: "Job is no longer accepting applications" }, { status: 400 });
    }
    if (!job.company?.isApproved) {
      return Response.json({ success: false, message: "Company not approved" }, { status: 400 });
    }

    // Check duplicate
    const existing = await Application.findOne({ job: jobId, applicant: session.user.id });
    if (existing) {
      return Response.json({ success: false, message: "You have already applied for this job" }, { status: 409 });
    }

    // Parse and validate body
    const body = await req.json();

    // If no resumeURL provided, try to get from profile
    let resumeURL = body.resumeURL;
    if (!resumeURL || resumeURL === "null") {
      const profile = await Profile.findOne({ user: session.user.id }).select("resumeURL");
      resumeURL = profile?.resumeURL;
    }

    if (!resumeURL || resumeURL === "null") {
      return Response.json({ success: false, message: "Please build or upload a resume first" }, { status: 400 });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: session.user.id,
      company: job.company._id,
      resumeURL,
      coverLetter: body.coverLetter || "",
      status: "pending",
      statusHistory: [{ status: "pending", changedAt: new Date(), note: "Application submitted" }],
    });

    // Increment job application count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    return Response.json({ success: true, data: application }, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return Response.json({ success: false, message: "You have already applied for this job" }, { status: 409 });
    }
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

import { connectDB } from "../../../../../lib/db";
import Application from "../../../../../models/Application";
import Job from "../../../../../models/Job";
import User from "../../../../../models/User";
import { auth } from "../../../../../lib/auth";

export const runtime = "nodejs";

// GET all applicants for a specific job (employer only)
export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "employer") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id: jobId } = await params;
    await connectDB();

    // Verify this employer owns the job
    const job = await Job.findById(jobId);
    if (!job) {
      return Response.json({ success: false, message: "Job not found" }, { status: 404 });
    }
    if (job.postedBy.toString() !== session.user.id) {
      return Response.json({ success: false, message: "You don't own this job" }, { status: 403 });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email photoURL")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ success: true, data: applications });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

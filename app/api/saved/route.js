import { connectDB } from "../../../lib/db";
import SavedJob from "../../../models/SavedJob";
import Job from "../../../models/Job";
import Company from "../../../models/Company";
import { auth } from "../../../lib/auth";

export const runtime = "nodejs";

// GET saved jobs
export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "jobseeker") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const saved = await SavedJob.find({ user: session.user.id })
      .populate({
        path: "job",
        select: "title slug jobType locationType location salary deadline status company applicationCount",
        populate: { path: "company", select: "name logo location" },
      })
      .sort({ createdAt: -1 })
      .lean();

    // Filter out null jobs (deleted jobs)
    const data = saved.filter((s) => s.job != null);

    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST — save a job
export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "jobseeker") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { jobId } = await req.json();
    if (!jobId) {
      return Response.json({ success: false, message: "jobId is required" }, { status: 400 });
    }

    // Upsert to prevent duplicates
    const saved = await SavedJob.findOneAndUpdate(
      { user: session.user.id, job: jobId },
      { user: session.user.id, job: jobId },
      { upsert: true, new: true }
    );

    return Response.json({ success: true, data: saved }, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return Response.json({ success: true, message: "Already saved" });
    }
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE — unsave a job
export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "jobseeker") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { jobId } = await req.json();
    if (!jobId) {
      return Response.json({ success: false, message: "jobId is required" }, { status: 400 });
    }

    await SavedJob.findOneAndDelete({ user: session.user.id, job: jobId });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

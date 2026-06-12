import { connectDB } from "../../../../lib/db";
import Application from "../../../../models/Application";
import Job from "../../../../models/Job";
import { auth } from "../../../../lib/auth";
import { updateStatusSchema } from "../../../../schemas/applicationSchemas";

export const runtime = "nodejs";

// GET single application (for employer viewing applicant details)
export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const application = await Application.findById(id)
      .populate("job", "title slug company")
      .populate("applicant", "name email photoURL")
      .lean();

    if (!application) {
      return Response.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    // Only the applicant or the job's employer can view
    const isApplicant = application.applicant._id.toString() === session.user.id;
    const isEmployer = session.user.role === "employer";
    if (!isApplicant && !isEmployer) {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    return Response.json({ success: true, data: application });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PATCH — employer updates application status
export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "employer") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const body = await req.json();
    const parsed = updateStatusSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ success: false, message: parsed.error.errors[0].message }, { status: 400 });
    }

    const application = await Application.findById(id).populate("job", "company postedBy");
    if (!application) {
      return Response.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    // Verify this employer owns the job
    if (application.job.postedBy.toString() !== session.user.id) {
      return Response.json({ success: false, message: "You don't own this job listing" }, { status: 403 });
    }

    application.status = parsed.data.status;
    if (parsed.data.employerNote !== undefined) {
      application.employerNote = parsed.data.employerNote;
    }
    application.statusHistory.push({
      status: parsed.data.status,
      changedAt: new Date(),
      note: parsed.data.employerNote || "",
    });

    await application.save();

    return Response.json({ success: true, data: application });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

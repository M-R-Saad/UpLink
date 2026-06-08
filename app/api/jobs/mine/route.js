import { connectDB } from "../../../../lib/db";
import Job from "../../../../models/Job";
import Company from "../../../../models/Company";
import { auth } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "employer") {
      return Response.json({ success: false, message: "Employers only" }, { status: 403 });
    }

    await connectDB();
    const company = await Company.findOne({ owner: session.user.id });
    if (!company) {
      return Response.json({ success: true, data: [] });
    }

    const jobs = await Job.find({ company: company._id })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return Response.json({ success: true, data: jobs });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

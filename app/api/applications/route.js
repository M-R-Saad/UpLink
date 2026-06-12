import { connectDB } from "../../../lib/db";
import Application from "../../../models/Application";
import Job from "../../../models/Job";
import Company from "../../../models/Company";
import { auth } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "jobseeker") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const filter = { applicant: session.user.id };
    if (status && status !== "all") filter.status = status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate({
          path: "job",
          select: "title slug jobType locationType location salary deadline status company",
          populate: { path: "company", select: "name logo" },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Application.countDocuments(filter),
    ]);

    // Also get status counts for filter tabs
    const counts = await Application.aggregate([
      { $match: { applicant: session.user.id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusCounts = { all: total };
    counts.forEach((c) => { statusCounts[c._id] = c.count; });

    return Response.json({
      success: true,
      data: applications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      statusCounts,
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

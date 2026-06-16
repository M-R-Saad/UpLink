import { connectDB } from "../../../../lib/db";
import Job from "../../../../models/Job";
import Company from "../../../../models/Company";
import User from "../../../../models/User";
import Application from "../../../../models/Application";

export const runtime = "nodejs";

// GET /api/home/stats — public, cached stats for landing page
export async function GET() {
  try {
    await connectDB();

    const [totalJobs, totalCompanies, totalApplications, totalSeekers] =
      await Promise.all([
        Job.countDocuments({ status: "active", deadline: { $gte: new Date() } }),
        Company.countDocuments({ isApproved: true, isActive: true }),
        Application.countDocuments(),
        User.countDocuments({ role: "jobseeker" }),
      ]);

    return Response.json(
      {
        success: true,
        data: { totalJobs, totalCompanies, totalApplications, totalSeekers },
      },
      {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
      }
    );
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

import { connectDB } from "../../../../lib/db";
import Job from "../../../../models/Job";
import Application from "../../../../models/Application";
import Company from "../../../../models/Company";
import { auth } from "../../../../lib/auth";

export const runtime = "nodejs";

// GET /api/employer/stats — employer only
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "employer") {
      return Response.json({ success: false, message: "Employers only" }, { status: 403 });
    }

    await connectDB();

    const company = await Company.findOne({ owner: session.user.id });
    if (!company) {
      return Response.json({
        success: true,
        data: {
          totalJobs: 0,
          activeListings: 0,
          totalApplicants: 0,
          applicationsThisWeek: 0,
          applicationsByDay: [],
          recentApplicants: [],
        },
      });
    }

    // Job counts
    const totalJobs = await Job.countDocuments({ company: company._id });
    const activeListings = await Job.countDocuments({
      company: company._id,
      status: "active",
      deadline: { $gte: new Date() },
    });

    // Application counts
    const totalApplicants = await Application.countDocuments({ company: company._id });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const applicationsThisWeek = await Application.countDocuments({
      company: company._id,
      createdAt: { $gte: oneWeekAgo },
    });

    // Applications by day — last 14 days for chart
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const dailyAgg = await Application.aggregate([
      {
        $match: {
          company: company._id,
          createdAt: { $gte: fourteenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days with 0
    const applicationsByDay = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = dailyAgg.find((a) => a._id === dateStr);
      applicationsByDay.push({
        date: dateStr,
        label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        count: found?.count || 0,
      });
    }

    // Recent applicants — last 10
    const recentApplicants = await Application.find({ company: company._id })
      .populate("applicant", "name email image")
      .populate("job", "title")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return Response.json({
      success: true,
      data: {
        totalJobs,
        activeListings,
        totalApplicants,
        applicationsThisWeek,
        applicationsByDay,
        recentApplicants,
      },
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

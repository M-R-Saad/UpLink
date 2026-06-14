import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import Job from "../../../../models/Job";
import Company from "../../../../models/Company";
import Application from "../../../../models/Application";
import Review from "../../../../models/Review";
import { auth } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Counts
    const [totalUsers, totalJobs, totalCompanies, totalApplications, totalReviews] =
      await Promise.all([
        User.countDocuments(),
        Job.countDocuments(),
        Company.countDocuments(),
        Application.countDocuments(),
        Review.countDocuments(),
      ]);

    // New this week
    const [newUsersThisWeek, newJobsThisWeek, newApplicationsThisWeek, pendingCompanies] =
      await Promise.all([
        User.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
        Job.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
        Application.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
        Company.countDocuments({ isApproved: false }),
      ]);

    // Jobs + applications by day — last 14 days for chart
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const [jobsByDay, appsByDay] = await Promise.all([
      Job.aggregate([
        { $match: { createdAt: { $gte: fourteenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Application.aggregate([
        { $match: { createdAt: { $gte: fourteenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Fill missing days
    const chartData = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      chartData.push({
        date: dateStr,
        label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        jobs: jobsByDay.find((j) => j._id === dateStr)?.count || 0,
        applications: appsByDay.find((a) => a._id === dateStr)?.count || 0,
      });
    }

    return Response.json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalCompanies,
        totalApplications,
        totalReviews,
        newUsersThisWeek,
        newJobsThisWeek,
        newApplicationsThisWeek,
        pendingCompanies,
        chartData,
      },
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

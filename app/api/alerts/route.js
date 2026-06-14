import { connectDB } from "../../../lib/db";
import JobAlert from "../../../models/JobAlert";
import { auth } from "../../../lib/auth";
import { createAlertSchema } from "../../../schemas/alertSchemas";

export const runtime = "nodejs";

// GET /api/alerts — seeker gets own alerts
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "jobseeker") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const alerts = await JobAlert.find({ user: session.user.id })
      .populate("categories", "name icon slug")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ success: true, data: alerts });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST /api/alerts — seeker creates alert
export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "jobseeker") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const parsed = createAlertSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ success: false, message: parsed.error.errors[0].message }, { status: 400 });
    }

    // Limit alerts per user to 10
    const count = await JobAlert.countDocuments({ user: session.user.id });
    if (count >= 10) {
      return Response.json({ success: false, message: "Maximum 10 alerts allowed" }, { status: 400 });
    }

    const alert = await JobAlert.create({
      ...parsed.data,
      user: session.user.id,
    });

    const populated = await JobAlert.findById(alert._id)
      .populate("categories", "name icon slug")
      .lean();

    return Response.json({ success: true, data: populated }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

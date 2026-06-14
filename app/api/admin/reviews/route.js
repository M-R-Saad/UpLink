import { connectDB } from "../../../../lib/db";
import Review from "../../../../models/Review";
import { auth } from "../../../../lib/auth";

export const runtime = "nodejs";

// GET /api/admin/reviews — admin: list all reviews with populated user + company
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("company", "name")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return Response.json({ success: true, data: reviews });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

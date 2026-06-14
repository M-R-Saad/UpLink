import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import { auth } from "../../../lib/auth";

export const runtime = "nodejs";

// GET /api/users — admin only, paginated users list
export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page   = Number(searchParams.get("page"))   || 1;
    const limit  = Number(searchParams.get("limit"))  || 20;
    const search = searchParams.get("search") || "";
    const role   = searchParams.get("role")   || "";

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return Response.json({
      success: true,
      data: users,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

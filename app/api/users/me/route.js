import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import { auth } from "../../../../lib/auth";

export const runtime = "nodejs";

// PATCH /api/users/me — update own profile photo
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const allowed = {};
    if (typeof body.photoURL === "string") {
      allowed.photoURL = body.photoURL || null;
    }
    if (typeof body.name === "string" && body.name.trim()) {
      allowed.name = body.name.trim();
    }

    if (Object.keys(allowed).length === 0) {
      return Response.json({ success: false, message: "No valid fields to update" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: allowed },
      { returnDocument: "after" }
    ).select("-password");

    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: user });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import { auth } from "../../../../lib/auth";

export const runtime = "nodejs";

// PATCH /api/users/[id] — admin updates role/status
export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const body = await req.json();
    const allowed = {};
    if (body.role && ["jobseeker", "employer", "admin"].includes(body.role)) {
      allowed.role = body.role;
    }
    if (typeof body.isActive === "boolean") {
      allowed.isActive = body.isActive;
    }

    if (Object.keys(allowed).length === 0) {
      return Response.json({ success: false, message: "No valid fields to update" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(id, allowed, { returnDocument: "after" }).select("-password");
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: user });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE /api/users/[id] — admin deactivates user
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    if (id === session.user.id) {
      return Response.json({ success: false, message: "Cannot delete yourself" }, { status: 400 });
    }

    await connectDB();
    await User.findByIdAndUpdate(id, { isActive: false });
    return Response.json({ success: true, message: "User deactivated" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

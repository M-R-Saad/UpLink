import { connectDB } from "../../../../lib/db";
import Company from "../../../../models/Company";
import { auth } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const company = await Company.findById(id);
    if (!company || (!company.isApproved && company.isActive)) {
      return Response.json({ success: false, message: "Company not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: company });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const company = await Company.findById(id);
    if (!company) {
      return Response.json({ success: false, message: "Company not found" }, { status: 404 });
    }

    // Only owner or admin can update
    const isOwner = company.owner.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await Company.findByIdAndUpdate(id, body, { new: true });
    return Response.json({ success: true, data: updated });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

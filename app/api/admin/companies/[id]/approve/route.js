import { connectDB } from "../../../../../../lib/db";
import Company from "../../../../../../models/Company";
import { auth } from "../../../../../../lib/auth";

export const runtime = "nodejs";

// PATCH /api/admin/companies/[id]/approve — approve or reject
export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const body = await req.json();
    const { isApproved } = body;

    const company = await Company.findByIdAndUpdate(
      id,
      { isApproved: !!isApproved },
      { returnDocument: "after" }
    );

    if (!company) {
      return Response.json({ success: false, message: "Company not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: company });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

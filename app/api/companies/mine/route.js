import { connectDB } from "../../../../lib/db";
import Company from "../../../../models/Company";
import { auth } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const company = await Company.findOne({ owner: session.user.id });
    return Response.json({ success: true, data: company || null });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

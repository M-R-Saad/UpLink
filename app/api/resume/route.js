import { connectDB } from "../../../lib/db";
import Profile from "../../../models/Profile";
import { auth } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const profile = await Profile.findOne({ user: session.user.id })
      .select("resumeData resumeURL");

    return Response.json({ success: true, data: profile || null });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { resumeData, resumeURL } = await req.json();

    const profile = await Profile.findOneAndUpdate(
      { user: session.user.id },
      { $set: { resumeData, ...(resumeURL && { resumeURL }) } },
      { new: true, upsert: true }
    );

    return Response.json({ success: true, data: profile });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

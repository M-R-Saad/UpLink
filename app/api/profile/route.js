import { connectDB } from "../../../lib/db";
import Profile from "../../../models/Profile";
import { auth } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    let profile = await Profile.findOne({ user: session.user.id });
    if (!profile) {
      profile = await Profile.create({ user: session.user.id });
    }

    return Response.json({ success: true, data: profile });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body    = await req.json();
    const profile = await Profile.findOneAndUpdate(
      { user: session.user.id },
      { $set: body },
      { new: true, upsert: true }
    );

    return Response.json({ success: true, data: profile });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

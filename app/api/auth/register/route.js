import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import { registerSchema } from "../../../../schemas/authSchemas";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ success: false, message: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ success: false, message: "Email already in use" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    return Response.json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

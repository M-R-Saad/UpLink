import { connectDB } from "../../../lib/db";
import Category from "../../../models/Category";
import { auth } from "../../../lib/auth";
import { createCategorySchema } from "../../../schemas/categorySchemas";
import { generateSlug } from "../../../lib/utils";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return Response.json({ success: true, data: categories });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ success: false, message: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, icon, description } = parsed.data;
    const slug = generateSlug(name);

    const existing = await Category.findOne({ slug });
    if (existing) {
      return Response.json({ success: false, message: "Category already exists" }, { status: 400 });
    }

    const category = await Category.create({ name, slug, icon, description });
    return Response.json({ success: true, data: category }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

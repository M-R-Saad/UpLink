import { connectDB } from "../../../../lib/db";
import Category from "../../../../models/Category";
import { auth } from "../../../../lib/auth";
import { generateSlug } from "../../../../lib/utils";

export const runtime = "nodejs";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const updateData = { ...body };
    if (body.name) updateData.slug = generateSlug(body.name);

    const category = await Category.findByIdAndUpdate(
      id, updateData, { new: true }
    );
    if (!category) {
      return Response.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: category });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    await Category.findByIdAndUpdate(id, { isActive: false });
    return Response.json({ success: true, message: "Category deleted" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

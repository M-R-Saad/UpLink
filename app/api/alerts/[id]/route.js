import { connectDB } from "../../../../lib/db";
import JobAlert from "../../../../models/JobAlert";
import { auth } from "../../../../lib/auth";
import { createAlertSchema } from "../../../../schemas/alertSchemas";

export const runtime = "nodejs";

// PATCH /api/alerts/[id] — update alert
export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "jobseeker") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const alert = await JobAlert.findById(id);
    if (!alert) {
      return Response.json({ success: false, message: "Alert not found" }, { status: 404 });
    }
    if (alert.user.toString() !== session.user.id) {
      return Response.json({ success: false, message: "Not your alert" }, { status: 403 });
    }

    const body = await req.json();

    // Allow toggling isActive without full validation
    if (Object.keys(body).length === 1 && typeof body.isActive === "boolean") {
      alert.isActive = body.isActive;
      await alert.save();
      const populated = await JobAlert.findById(alert._id)
        .populate("categories", "name icon slug")
        .lean();
      return Response.json({ success: true, data: populated });
    }

    // Full update with validation
    const parsed = createAlertSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ success: false, message: parsed.error.errors[0].message }, { status: 400 });
    }

    const updated = await JobAlert.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    ).populate("categories", "name icon slug").lean();

    return Response.json({ success: true, data: updated });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE /api/alerts/[id] — delete alert
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "jobseeker") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const alert = await JobAlert.findById(id);
    if (!alert) {
      return Response.json({ success: false, message: "Alert not found" }, { status: 404 });
    }
    if (alert.user.toString() !== session.user.id) {
      return Response.json({ success: false, message: "Not your alert" }, { status: 403 });
    }

    await JobAlert.findByIdAndDelete(id);
    return Response.json({ success: true, message: "Alert deleted" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

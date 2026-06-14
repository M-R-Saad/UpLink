import { connectDB } from "../../../../lib/db";
import Review from "../../../../models/Review";
import Company from "../../../../models/Company";
import { auth } from "../../../../lib/auth";

export const runtime = "nodejs";

// DELETE /api/admin/reviews/[id] — admin deletes a review and recalculates company rating
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const review = await Review.findById(id);
    if (!review) {
      return Response.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    const companyId = review.company;
    await Review.findByIdAndDelete(id);

    // Recalculate company ratings
    const [agg] = await Review.aggregate([
      { $match: { company: companyId, isApproved: true } },
      { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    await Company.findByIdAndUpdate(companyId, {
      ratings: {
        average: Math.round((agg?.average || 0) * 10) / 10,
        count: agg?.count || 0,
      },
    });

    return Response.json({ success: true, message: "Review deleted" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

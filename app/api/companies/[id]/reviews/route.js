import { connectDB } from "../../../../../lib/db";
import Review from "../../../../../models/Review";
import Company from "../../../../../models/Company";
import { auth } from "../../../../../lib/auth";
import { createReviewSchema } from "../../../../../schemas/reviewSchemas";

export const runtime = "nodejs";

// GET /api/companies/[id]/reviews — public, paginated reviews
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page  = Number(searchParams.get("page"))  || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const filter = { company: id, isApproved: true };
    const total  = await Review.countDocuments(filter);

    const reviews = await Review.find(filter)
      .populate("user", "name image")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Mask user info for anonymous reviews
    const masked = reviews.map((r) => {
      if (r.isAnonymous) {
        return { ...r, user: { name: "Anonymous", image: null } };
      }
      return r;
    });

    return Response.json({
      success: true,
      data: masked,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST /api/companies/[id]/reviews — seeker only
export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "jobseeker") {
      return Response.json({ success: false, message: "Job seekers only" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    // Check company exists
    const company = await Company.findById(id);
    if (!company) {
      return Response.json({ success: false, message: "Company not found" }, { status: 404 });
    }

    const body   = await req.json();
    const parsed = createReviewSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ success: false, message: parsed.error.errors[0].message }, { status: 400 });
    }

    // Check if user already reviewed this company
    const existing = await Review.findOne({ company: id, user: session.user.id });
    if (existing) {
      return Response.json({ success: false, message: "You have already reviewed this company" }, { status: 409 });
    }

    // Create review
    const review = await Review.create({
      ...parsed.data,
      company: id,
      user: session.user.id,
    });

    // Recalculate company ratings
    const [agg] = await Review.aggregate([
      { $match: { company: company._id, isApproved: true } },
      { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    await Company.findByIdAndUpdate(id, {
      ratings: {
        average: Math.round((agg?.average || 0) * 10) / 10,
        count: agg?.count || 0,
      },
    });

    // Return populated review
    const populated = await Review.findById(review._id).populate("user", "name image").lean();
    const result = populated.isAnonymous
      ? { ...populated, user: { name: "Anonymous", image: null } }
      : populated;

    return Response.json({ success: true, data: result }, { status: 201 });
  } catch (err) {
    // Duplicate key = already reviewed
    if (err.code === 11000) {
      return Response.json({ success: false, message: "You have already reviewed this company" }, { status: 409 });
    }
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

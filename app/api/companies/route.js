import { connectDB } from "../../../lib/db";
import Company from "../../../models/Company";
import User from "../../../models/User";
import { auth } from "../../../lib/auth";
import { createCompanySchema } from "../../../schemas/companySchemas";
import { generateSlug } from "../../../lib/utils";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page  = Number(searchParams.get("page"))  || 1;
    const limit = Number(searchParams.get("limit")) || 12;
    const search = searchParams.get("search") || "";

    const filter = {};
    const includeAll = searchParams.get("includeAll");
    if (!includeAll) {
      filter.isApproved = true;
      filter.isActive = true;
    }
    if (search) filter.name = { $regex: search, $options: "i" };

    const total = await Company.countDocuments(filter);
    const companies = await Company.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return Response.json({
      success: true,
      data: companies,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "employer") {
      return Response.json({ success: false, message: "Employers only" }, { status: 403 });
    }

    await connectDB();

    // Employer can only have one company
    const existing = await Company.findOne({ owner: session.user.id });
    if (existing) {
      return Response.json({ success: false, message: "You already have a company profile" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = createCompanySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ success: false, message: parsed.error.errors[0].message }, { status: 400 });
    }

    const slug = generateSlug(parsed.data.name);
    const slugExists = await Company.findOne({ slug });
    const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug;

    const company = await Company.create({
      ...parsed.data,
      owner: session.user.id,
      slug: finalSlug,
    });

    // Link company to the user
    await User.findByIdAndUpdate(session.user.id, { company: company._id });

    return Response.json({ success: true, data: company }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

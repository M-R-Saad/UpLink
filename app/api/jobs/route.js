import { connectDB } from "../../../lib/db";
import Job from "../../../models/Job";
import Company from "../../../models/Company";
import Category from "../../../models/Category";
import JobAlert from "../../../models/JobAlert";
import User from "../../../models/User";
import { auth } from "../../../lib/auth";
import { createJobSchema } from "../../../schemas/jobSchemas";
import { generateJobSlug } from "../../../lib/utils";
import { sendJobAlertEmail } from "../../../lib/resend";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page        = Number(searchParams.get("page"))   || 1;
    const limit       = Number(searchParams.get("limit"))  || 10;
    const search      = searchParams.get("search")         || "";
    const category    = searchParams.get("category")       || "";
    const type        = searchParams.get("type")           || "";
    const locationType= searchParams.get("locationType")   || "";
    const location    = searchParams.get("location")       || "";
    const experience  = searchParams.get("experience")     || "";
    const featured    = searchParams.get("featured")       || "";

    // Base filter — always applied on public queries
    const filter = {
      status:   "active",
      deadline: { $gte: new Date() },
    };

    if (category)     filter.category     = category;
    if (type)         filter.jobType      = type;
    if (locationType) filter.locationType = locationType;
    if (location)     filter.location     = { $regex: location, $options: "i" };
    if (experience)   filter.experience   = experience;
    if (featured)     filter.isFeatured   = true;

    // Text search
    if (search) filter.$text = { $search: search };

    // Only show jobs from approved companies
    const approvedCompanies = await Company.find({ isApproved: true, isActive: true }).distinct("_id");
    filter.company = { $in: approvedCompanies };

    const total = await Job.countDocuments(filter);
    const jobs  = await Job.find(filter)
      .populate("company",  "name logo location isApproved")
      .populate("category", "name slug icon")
      .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return Response.json({
      success: true,
      data: jobs,
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

    const company = await Company.findOne({ owner: session.user.id });
    if (!company) {
      return Response.json({ success: false, message: "Create a company profile first" }, { status: 400 });
    }

    const body   = await req.json();
    const parsed = createJobSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ success: false, message: parsed.error.errors[0].message }, { status: 400 });
    }

    const slug = generateJobSlug(parsed.data.title);
    const job  = await Job.create({
      ...parsed.data,
      slug,
      company:  company._id,
      postedBy: session.user.id,
      deadline: new Date(parsed.data.deadline),
    });

    // Increment category jobCount
    await Category.findByIdAndUpdate(parsed.data.category, { $inc: { jobCount: 1 } });

    // Trigger job alerts — only if company is approved
    if (company.isApproved) {
      triggerJobAlerts(job, company).catch(console.error);
    }

    const populated = await Job.findById(job._id)
      .populate("company",  "name logo")
      .populate("category", "name slug");

    return Response.json({ success: true, data: populated }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// Fire-and-forget — sends alert emails to matching job seekers
async function triggerJobAlerts(job, company) {
  const alerts = await JobAlert.find({ isActive: true });
  for (const alert of alerts) {
    const matchesKeyword = alert.keywords.length === 0 ||
      alert.keywords.some((k) =>
        job.title.toLowerCase().includes(k.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(k.toLowerCase()))
      );
    const matchesCategory = alert.categories.length === 0 ||
      alert.categories.some((c) => c.toString() === job.category.toString());
    const matchesType = alert.jobTypes.length === 0 ||
      alert.jobTypes.includes(job.jobType);
    const matchesLocation = alert.locationType === "any" ||
      alert.locationType === job.locationType;

    if (matchesKeyword && matchesCategory && matchesType && matchesLocation) {
      const user = await User.findById(alert.user);
      if (user?.email) {
        await sendJobAlertEmail({ to: user.email, userName: user.name, job, company });
        await JobAlert.findByIdAndUpdate(alert._id, { lastTriggeredAt: new Date() });
      }
    }
  }
}

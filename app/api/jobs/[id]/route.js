import { connectDB } from "../../../../lib/db";
import Job from "../../../../models/Job";
import Company from "../../../../models/Company";
import Category from "../../../../models/Category";
import { auth } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const job = await Job.findById(id)
      .populate("company",  "name logo location website size industry isApproved")
      .populate("category", "name slug icon")
      .populate("postedBy", "name");

    if (!job) {
      return Response.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    // Increment view count — fire and forget
    Job.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();

    return Response.json({ success: true, data: job });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const job = await Job.findById(id);
    if (!job) {
      return Response.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    const isOwner = job.postedBy.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body    = await req.json();
    const updated = await Job.findByIdAndUpdate(id, body, { new: true })
      .populate("company",  "name logo")
      .populate("category", "name slug");

    return Response.json({ success: true, data: updated });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const job = await Job.findById(id);
    if (!job) {
      return Response.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    const isOwner = job.postedBy.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await Job.findByIdAndUpdate(id, { status: "closed" });
    await Category.findByIdAndUpdate(job.category, { $inc: { jobCount: -1 } });

    return Response.json({ success: true, message: "Job closed" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

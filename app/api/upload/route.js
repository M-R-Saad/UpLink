import { auth } from "../../../lib/auth";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file     = formData.get("file");
    const folder   = formData.get("folder") || "uplink";

    if (!file) {
      return Response.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: "auto",
    });

    return Response.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

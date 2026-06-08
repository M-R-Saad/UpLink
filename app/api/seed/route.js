import { connectDB } from "../../../lib/db";
import Category from "../../../models/Category";
import { generateSlug } from "../../../lib/utils";

export const runtime = "nodejs";

const DEFAULT_CATEGORIES = [
  { name: "Engineering",        icon: "⚙️",  description: "Software, hardware and engineering roles" },
  { name: "Design",             icon: "🎨",  description: "UI/UX, graphic design and creative roles" },
  { name: "Marketing",          icon: "📣",  description: "Digital marketing, SEO and growth roles" },
  { name: "Finance",            icon: "💰",  description: "Accounting, banking and finance roles" },
  { name: "Sales",              icon: "📈",  description: "Sales, business development and account management" },
  { name: "Human Resources",    icon: "🤝",  description: "HR, recruiting and people operations" },
  { name: "Healthcare",         icon: "🏥",  description: "Medical, nursing and healthcare roles" },
  { name: "Education",          icon: "📚",  description: "Teaching, training and education roles" },
  { name: "Customer Service",   icon: "💬",  description: "Support, service and customer success roles" },
  { name: "Legal",              icon: "⚖️",  description: "Legal, compliance and regulatory roles" },
  { name: "Operations",         icon: "🏗️",  description: "Operations, logistics and supply chain" },
  { name: "Data & Analytics",   icon: "📊",  description: "Data science, analytics and BI roles" },
];

// Only accessible in development
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ success: false, message: "Not available in production" }, { status: 403 });
  }

  try {
    await connectDB();

    let created = 0;
    let skipped = 0;

    for (const cat of DEFAULT_CATEGORIES) {
      const slug = generateSlug(cat.name);
      const exists = await Category.findOne({ slug });
      if (!exists) {
        await Category.create({ ...cat, slug });
        created++;
      } else {
        skipped++;
      }
    }

    return Response.json({
      success: true,
      message: `Seeded ${created} categories, skipped ${skipped} existing`,
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// GET /api/companies/[id]/reviews — public reviews
// POST /api/companies/[id]/reviews — seeker submits review
export async function GET(req, { params }) { return Response.json({ success: true, data: [] }); }
export async function POST(req, { params }) { return Response.json({ success: true }); }

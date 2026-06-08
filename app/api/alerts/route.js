// GET /api/alerts — seeker gets own alerts
// POST /api/alerts — seeker creates alert
export async function GET(req) { return Response.json({ success: true, data: [] }); }
export async function POST(req) { return Response.json({ success: true }); }

// PATCH /api/users/[id] — admin updates role/status
// DELETE /api/users/[id] — admin deletes user
export async function PATCH(req, { params }) { return Response.json({ success: true }); }
export async function DELETE(req, { params }) { return Response.json({ success: true }); }

import { NextResponse } from "next/server";
import { scheduleAppointment } from "@/lib/adminStore";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/session";

export const runtime = "nodejs";

export async function PATCH(request, { params }) {
  const session = await verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const { id } = await params;
  const result = await scheduleAppointment({
    id,
    scheduledAt: body.scheduledAt
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, ...result });
}

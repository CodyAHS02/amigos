import { NextResponse } from "next/server";
import { addAdminChatMessage, getAdminChatMessages } from "@/lib/chatStore";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const session = await verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  return NextResponse.json({ messages: await getAdminChatMessages(id) });
}

export async function POST(request, { params }) {
  const session = await verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const result = await addAdminChatMessage({
    conversationId: id,
    adminName: session.email,
    body: body.message
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: result.message });
}

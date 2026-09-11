import { NextResponse } from "next/server";
import { getAdminChatConversations } from "@/lib/chatStore";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request) {
  const session = await verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({ conversations: await getAdminChatConversations() });
}

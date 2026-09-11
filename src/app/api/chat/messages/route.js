import { NextResponse } from "next/server";
import {
  CHAT_VISITOR_COOKIE,
  addVisitorMessage,
  createChatVisitorToken,
  getVisitorMessages
} from "@/lib/chatStore";

export const runtime = "nodejs";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

function setVisitorCookie(response, visitorToken) {
  response.cookies.set({
    name: CHAT_VISITOR_COOKIE,
    value: visitorToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE
  });
}

export async function GET(request) {
  let visitorToken = request.cookies.get(CHAT_VISITOR_COOKIE)?.value;

  if (!visitorToken) {
    visitorToken = createChatVisitorToken();
    const response = NextResponse.json({ messages: [] });

    setVisitorCookie(response, visitorToken);

    return response;
  }

  const { messages } = await getVisitorMessages(visitorToken);
  const response = NextResponse.json({ messages });

  setVisitorCookie(response, visitorToken);

  return response;
}

export async function POST(request) {
  const body = await request.json();
  const result = await addVisitorMessage(request.cookies.get(CHAT_VISITOR_COOKIE)?.value, body.message);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, message: result.message });

  setVisitorCookie(response, result.visitorToken);

  return response;
}

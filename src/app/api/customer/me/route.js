import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifyCustomerSession } from "@/lib/session";

export async function GET(request) {
  const session = await verifyCustomerSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session?.email || session.role !== "customer") {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

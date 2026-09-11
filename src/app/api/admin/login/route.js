import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/adminStore";
import { createAdminSession, ADMIN_SESSION_COOKIE, hasSessionSecret, SESSION_DURATION_SECONDS } from "@/lib/session";
import { validateLoginInput } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request) {
  const formData = await request.formData();
  const validation = validateLoginInput({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!hasSessionSecret()) {
    return NextResponse.json({ error: "Admin session secret is not configured." }, { status: 503 });
  }

  if (!validation.valid) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", errors: validation.errors }, { status: 400 });
  }

  let admin;

  try {
    admin = await authenticateAdmin(validation.values.email, validation.values.password);
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }

  if (!admin) {
    return NextResponse.json({ error: "Invalid admin email or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, next: "/admin/dashboard" });
  const sessionToken = await createAdminSession(admin.email);

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS
  });

  return response;
}

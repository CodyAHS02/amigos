import { NextResponse } from "next/server";
import { createCustomerAccount } from "@/lib/customerStore";
import { createCustomerSession, hasSessionSecret, SESSION_COOKIE, SESSION_DURATION_SECONDS } from "@/lib/session";
import { validateRegistrationInput } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const validation = validateRegistrationInput({ name, email, password });

  if (!hasSessionSecret()) {
    return NextResponse.json({ error: "Customer portal session secret is not configured." }, { status: 503 });
  }

  if (!validation.valid) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", errors: validation.errors }, { status: 400 });
  }

  let result;

  try {
    result = await createCustomerAccount(validation.values);
  } catch (error) {
    console.error("Customer registration failed:", error);
    return NextResponse.json({ error: "Unable to create account right now." }, { status: 500 });
  }

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  const response = NextResponse.json({ ok: true, next: "/customer/dashboard" });
  const sessionToken = await createCustomerSession(result.customer.email);

  response.cookies.set({
    name: SESSION_COOKIE,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS
  });

  return response;
}

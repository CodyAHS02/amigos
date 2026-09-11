import { NextResponse } from "next/server";
import { authenticateCustomer } from "@/lib/customerStore";
import { createCustomerSession, hasSessionSecret, SESSION_COOKIE, SESSION_DURATION_SECONDS } from "@/lib/session";
import { validateLoginInput } from "@/lib/validation";

export const runtime = "nodejs";

function safeRedirectPath(value) {
  if (!value || !value.startsWith("/customer") || value.startsWith("//") || value === "/customer/login") {
    return "/customer/dashboard";
  }

  return value;
}

export async function POST(request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const nextPath = safeRedirectPath(String(formData.get("next") || ""));
  const validation = validateLoginInput({ email, password });

  if (!hasSessionSecret()) {
    return NextResponse.json({ error: "Customer portal session secret is not configured." }, { status: 503 });
  }

  if (!validation.valid) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", errors: validation.errors }, { status: 400 });
  }

  let customer;

  try {
    customer = await authenticateCustomer(validation.values.email, validation.values.password);
  } catch (error) {
    console.error("Customer login failed:", error);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }

  if (!customer) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, next: nextPath });
  const sessionToken = await createCustomerSession(customer.email);

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

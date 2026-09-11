import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, SESSION_COOKIE, verifyAdminSession, verifyCustomerSession } from "./lib/session";

function buildLoginUrl(request) {
  const loginUrl = new URL("/customer/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);

  return loginUrl;
}

function buildAdminLoginUrl(request) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);

  return loginUrl;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const adminSession = await verifyAdminSession(adminToken);

    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (!adminSession) {
      return NextResponse.redirect(buildAdminLoginUrl(request));
    }

    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifyCustomerSession(token);

  if (pathname === "/customer") {
    return NextResponse.redirect(new URL("/customer/dashboard", request.url));
  }

  if (pathname === "/customer/login" || pathname === "/customer/register") {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(buildLoginUrl(request));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"]
};

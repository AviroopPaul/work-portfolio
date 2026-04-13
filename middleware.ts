import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (not /admin/login or /api/admin-auth)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login")
  ) {
    const cookie = req.cookies.get("admin_auth")?.value;
    if (cookie !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

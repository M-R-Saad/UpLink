import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  // Redirect logged-in users away from auth pages
  if ((pathname === "/login" || pathname === "/register") && session) {
    if (role === "employer") return NextResponse.redirect(new URL("/employer/dashboard", req.url));
    if (role === "admin")    return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect dashboard — jobseeker only
  if (pathname.startsWith("/dashboard")) {
    if (!session) return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url));
    if (role !== "jobseeker") return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect employer — employer only
  if (pathname.startsWith("/employer")) {
    if (!session) return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url));
    if (role !== "employer") return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect admin — admin only
  if (pathname.startsWith("/admin")) {
    if (!session) return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url));
    if (role !== "admin") return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/employer/:path*", "/admin/:path*", "/login", "/register"],
};

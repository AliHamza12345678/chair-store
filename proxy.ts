import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Next.js 16 ke liye hamen named function 'proxy' export karna hota hai
export const proxy = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // 1. Admin Area Protection
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      if (!token || token.role !== "ADMIN") {
        const loginUrl = new URL("/admin/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // 2. Customer Account Area Protection
    if (pathname.startsWith("/account")) {
      if (!token) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Hamesha authorized true rakhein taaki upar wala function dynamic routing handle kar sake
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/account/:path*",
  ],
};

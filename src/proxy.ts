import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    const role = token.role as string;

    // OWNER has full access
    if (role === "OWNER") {
      return NextResponse.next();
    }

    // Role-based routing restrictions
    if (role === "RECEPTIONIST") {
      if (!path.startsWith("/admin/bookings") && !path.startsWith("/admin/units") && path !== "/admin") {
        return NextResponse.redirect(new URL("/admin/bookings", req.url));
      }
    }

    if (role === "CAFE_CASHIER") {
      if (!path.startsWith("/admin/cafe") && path !== "/admin") {
        return NextResponse.redirect(new URL("/admin/cafe/pos", req.url));
      }
    }

    if (role === "POOL_SECURITY") {
      if (!path.startsWith("/admin/validasi-tiket") && !path.startsWith("/admin/pool") && path !== "/admin") {
        return NextResponse.redirect(new URL("/admin/validasi-tiket", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};

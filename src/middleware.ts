import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Redirect admin users trying to access user dashboard
    if (
      req.nextUrl.pathname.startsWith("/dashboard") &&
      req.nextauth.token?.role === "admin"
    ) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // Prevent non-admins from accessing admin routes
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
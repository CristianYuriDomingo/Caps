// middleware.ts
import { withAuth } from "next-auth/middleware"
import type { NextRequestWithAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req: NextRequestWithAuth) {
    // Add any additional middleware logic here
    console.log("User token:", req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true if user is authenticated
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    // Protect these routes
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/protected/:path*"
  ]
}
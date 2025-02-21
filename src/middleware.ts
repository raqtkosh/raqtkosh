import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  afterAuth: (auth, req) => {
    // Redirect signed-in users away from sign-in/sign-up pages
    if (auth.userId && (req.nextUrl.pathname === "/sign-in" || req.nextUrl.pathname === "/sign-up")) {
      return Response.redirect(new URL("/dashboard", req.url));
    }

    // Redirect unauthenticated users to sign-in page for protected routes
    if (!auth.userId && !auth.isPublicRoute) {
      return Response.redirect(new URL("/sign-in", req.url));
    }
  },
});

export const config = {
  matcher: [
    // Protect all routes except for public assets and specific public routes
    "/((?!_next|static|public|favicon.ico|sign-in|sign-up|api/webhook).*)",
  ],
};
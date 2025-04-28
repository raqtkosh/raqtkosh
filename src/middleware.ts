import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define route matchers
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
const isPublicRoute = createRouteMatcher(['/api/webhooks(.*)']); // Add public route matcher

export default clerkMiddleware(async (auth, req) => {
  // Skip protection for public routes
  if (isPublicRoute(req)) {
    console.log(`Public route accessed: ${req.url}`);
    return;
  }

  // Protect dashboard routes
  if (isDashboardRoute(req)) {
    await auth.protect();
  }
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

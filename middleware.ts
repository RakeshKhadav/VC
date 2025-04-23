import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',  // Only home page is public
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/faq(.*)',  // Make FAQ page public
  '/about(.*)' // Make About page public
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Don't run middleware on static files
    '/', // Run middleware on index page
    '/(api|trpc)(.*)' // Run middleware on API routes
  ],
};
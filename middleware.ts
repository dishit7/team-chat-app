import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/uploadthing(.*)', // Add this line to allow access to the UploadThing endpoint
]);

export default clerkMiddleware((auth, request) => {
  try {
    console.log('Request URL:', request.url);  // Add this line for logging the request URL
    if (!isPublicRoute(request)) {
      console.log('Route is protected:', request.url);  // Log when a route is being protected
      auth().protect();
    } else {
      console.log('Route is public:', request.url);  // Log when a route is public
    }
  } catch (error) {
    console.error('Clerk middleware error:', error);
  }
});


export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
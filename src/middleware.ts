// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Get the beta host from environment variables
const BETA_HOST = 'beta.serenity.studio';

export function middleware(req: NextRequest) {
  // Only run this logic if we are on the beta domain
  if (req.nextUrl.host === BETA_HOST) {
    const user = process.env.BASIC_AUTH_USER;
    const pass = process.env.BASIC_AUTH_PASS;

    // This should not happen if Vercel variables are set, but good to check
    if (!user || !pass) {
      return new NextResponse('Internal Server Error: Auth variables not set', {
        status: 500,
      });
    }

    // Get the auth credentials from the request
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]; // Get the "credentials" part
      const [providedUser, providedPass] = atob(authValue).split(':');

      // Check if the credentials match our environment variables
      if (providedUser === user && providedPass === pass) {
        // If they match, let the user proceed
        return NextResponse.next();
      }
    }

    // If no auth or wrong auth, send a 401 response
    // This triggers the browser's built-in login popup
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  // If not on the beta host, do nothing
  return NextResponse.next();
}

// This config tells the middleware to run on every page
// but to ignore static files and images
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
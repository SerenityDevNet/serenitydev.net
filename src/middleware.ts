import { NextRequest, NextResponse } from 'next/server';

// CAREFUL: Make sure this matches your ACTUAL beta domain. 
// You mentioned "beta.serenitydev.net" in logs, but here it says "beta.serenity.studio".
// Update this string if needed!
const BETA_HOST = 'beta.serenitydev.net'; 

export function middleware(req: NextRequest) {
  // 1. GLOBAL BYPASS: Always let Twitch Webhooks through
  // This runs before any password checks.
  if (req.nextUrl.pathname.startsWith('/api/webhooks')) {
    return NextResponse.next();
  }

  // 2. Beta Protection Logic
  if (req.nextUrl.host === BETA_HOST) {
    const user = process.env.BASIC_AUTH_USER;
    const pass = process.env.BASIC_AUTH_PASS;

    if (!user || !pass) {
      // Just pass through if vars aren't set (prevents breaking if you forget them)
      return NextResponse.next(); 
    }

    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [providedUser, providedPass] = atob(authValue).split(':');

      if (providedUser === user && providedPass === pass) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - api/webhooks (Allow Twitch)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)',
  ],
};
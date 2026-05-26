import { NextRequest, NextResponse } from 'next/server';

const isDev = process.env.NODE_ENV === 'development';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(self), microphone=(), geolocation=(self), payment=(self)',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://*.supabase.co https://*.stripe.com https://thecaptainboat.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co https://api.stripe.com wss://*.supabase.co",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
];

function getOriginAllowList(): string[] {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return [baseUrl, 'https://thecaptainboat.com', 'https://www.thecaptainboat.com'];
}

function isAllowedOrigin(request: NextRequest): boolean {
  if (isDev) return true;
  const origin = request.headers.get('origin');
  if (!origin) return true;
  if (origin.endsWith('.trycloudflare.com')) return true;
  if (origin.endsWith('.loca.lt')) return true;
  return getOriginAllowList().includes(origin);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CORS check for API routes
  if (pathname.startsWith('/api/') && !isAllowedOrigin(request)) {
    return new NextResponse(null, { status: 403, statusText: 'Forbidden' });
  }

  // CSRF protection for state-changing API requests
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    // Webhook routes exempt (they use signature verification)
    if (!pathname.startsWith('/api/webhooks/')) {
      const origin = request.headers.get('origin');
      const referer = request.headers.get('referer');
      if (!isDev && !origin && !referer) {
        return new NextResponse(JSON.stringify({ error: 'CSRF check failed' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  const response = NextResponse.next();

  // Apply security headers
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // CSP — relaxed in dev for hot reload
  if (!isDev) {
    response.headers.set('Content-Security-Policy', CSP_DIRECTIVES.join('; '));
  }

  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    if (origin && (isDev || getOriginAllowList().includes(origin))) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, stripe-signature');
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|__nextjs_font|favicon.ico|images/|sw\\.js|manifest\\.json).*)',
  ],
};

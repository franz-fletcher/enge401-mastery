// Middleware configuration
// The auth() function from NextAuth v5 can be used directly in Server Components
// and Server Actions for authentication.
//
// To re-enable middleware with route protection, you would need to:
// 1. Use a database that supports Edge Runtime (e.g., Vercel Postgres, PlanetScale)
// 2. Or use JWT sessions without database adapter in middleware
//
// For now, anonymous authentication is handled via the AuthProvider component
// and the auth() function in server components.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pass through all requests
  // Authentication is handled at the component level
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

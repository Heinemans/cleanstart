import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const PROTECTED_PATHS = ['/dashboard'];

// Paths that should be accessible only to non-authenticated users
const AUTH_PATHS = ['/login'];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path requires authentication
  const isProtectedPath = PROTECTED_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Check if path is for non-authenticated users
  const isAuthPath = AUTH_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Check if user is authenticated
  const hasToken = request.cookies.has('token');
  
  // Redirect non-authenticated users away from protected pages
  if (isProtectedPath && !hasToken) {
    const redirectUrl = new URL('/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Redirect authenticated users away from auth pages (like login)
  if (isAuthPath && hasToken) {
    const redirectUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the path the user is trying to access
  const path = request.nextUrl.pathname;
  
  // Define paths that require authentication
  const protectedPaths = ['/dashboard'];
  
  // Check if the requested path is protected
  const isProtectedPath = protectedPaths.some(pp => 
    path === pp || path.startsWith(`${pp}/`)
  );
  
  // If not a protected path, allow the request to continue
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  // Since our app uses client-side authentication with tokens stored in memory and HTTP-only cookies,
  // we can't rely solely on checking for the refresh token cookie as its path might be restricted.
  
  // Let's create a more reliable solution by creating a custom cookie when the user is authenticated
  // This cookie will be created by client-side code after successful authentication

  // Check for the auth state cookie (we'll use this as a signal for auth state)
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  
  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && isProtectedPath) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(path));
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
  ]
};

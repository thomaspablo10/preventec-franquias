import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('preventec_token')?.value;
  const role = request.cookies.get('preventec_role')?.value;

  const isLoginPage = pathname === '/login';
  const isAdminRoute = pathname.startsWith('/admin');
  const isPortalRoute = pathname.startsWith('/portal');

  if ((isAdminRoute || isPortalRoute) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminRoute && role && role !== 'admin') {
    return NextResponse.redirect(new URL('/portal', request.url));
  }

  if (isPortalRoute && role && role !== 'franchisee') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (isLoginPage && token && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (isLoginPage && token && role === 'franchisee') {
    return NextResponse.redirect(new URL('/portal', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/admin/:path*', '/portal/:path*'],
};
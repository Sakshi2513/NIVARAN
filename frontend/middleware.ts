import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTE_MIGRATION_MAP } from './lib/routeMigrationMap';

// Redefine UserRole enum locally for middleware since Next.js Edge Runtime might have issues importing some TS files
export enum UserRole {
  CITIZEN = 'Citizen',
  OFFICER = 'Officer',
  DEPARTMENT_HEAD = 'DepartmentHead',
  SUPERADMIN = 'SuperAdmin'
}

// Define protected route prefixes and their allowed roles
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/citizen': ['Citizen', 'citizen'],
  '/officer': ['Officer', 'officer', 'DepartmentHead', 'department_head', 'SuperAdmin', 'superadmin'],
  '/superadmin': ['SuperAdmin', 'superadmin']
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/about',
  '/contact'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. Handle Legacy Route Migrations
  if (ROUTE_MIGRATION_MAP[pathname]) {
    return NextResponse.redirect(new URL(ROUTE_MIGRATION_MAP[pathname], request.url));
  }

  // Allow access to public routes
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));

  // Get token and role from cookies
  const token = request.cookies.get('nivaran_token')?.value || request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value as UserRole;

  if (!token) {
    if (isPublicRoute) return NextResponse.next();
    
    // Redirect to login for protected routes
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists, redirect from login/register to their dashboard
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    return NextResponse.redirect(new URL(getDashboardUrl(userRole), request.url));
  }

  // Check role-based access for protected routes
  if (userRole) {
    for (const [routePrefix, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
      if (pathname.startsWith(routePrefix)) {
        if (!allowedRoles.includes(userRole)) {
          // If the user tries to access a route they don't have permission for, send them to their own dashboard
          return NextResponse.redirect(new URL(getDashboardUrl(userRole), request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

function getDashboardUrl(role: string): string {
  const normalizedRole = role?.toLowerCase();
  switch (normalizedRole) {
    case 'citizen':
      return '/citizen';
    case 'officer':
    case 'departmenthead':
    case 'department_head':
      return '/officer';
    case 'superadmin':
      return '/superadmin';
    default:
      return '/'; // Fallback to root instead of login to prevent loops
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)'
  ]
};
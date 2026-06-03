/**
 * Route Migration Map
 * 
 * Maps legacy URLs and invalid patterns to the new role-native architecture.
 */

export const ROUTE_MIGRATION_MAP: Record<string, string> = {
  '/track-issues': '/citizen/track',
  '/issues': '/citizen/track',
  '/complaints': '/citizen/track',
  '/citizen/complaints': '/citizen/track',
  '/report': '/citizen/file-complaint',
  '/dashboard': '/citizen', // Default legacy dashboard redirects to citizen
  '/officer-dashboard': '/officer',
  '/admin-dashboard': '/superadmin',
};

/**
 * Validates if a route is part of the new architecture
 */
export const isValidRoleRoute = (path: string): boolean => {
  return path.startsWith('/citizen') || path.startsWith('/officer') || path.startsWith('/superadmin') || path.startsWith('/auth');
};

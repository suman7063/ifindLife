/**
 * Navigation Utilities
 * Shared functions for determining active navigation states
 */

/**
 * Determines if a navigation path is currently active
 * @param currentPath - The current router pathname
 * @param targetPath - The navigation item's target path
 * @returns true if the path should be highlighted as active
 */
export const isPathActive = (currentPath: string, targetPath: string): boolean => {
  // Exact match for home/root paths
  if (targetPath.endsWith('/app') || targetPath.endsWith('/app/') || 
      targetPath.endsWith('/expert-app') || targetPath.endsWith('/expert-app/')) {
    return currentPath === targetPath || currentPath === targetPath + '/';
  }
  
  // Prefix match for nested paths
  return currentPath.startsWith(targetPath);
};

/**
 * Gets the display title for a route path
 * @param pathname - The current pathname
 * @returns A human-readable title for the current page
 */
export const getPageTitle = (pathname: string): string => {
  const pathMap: Record<string, string> = {
    '/mobile-app/app/services': 'Services',
    '/mobile-app/app/experts': 'Find Experts',
    '/mobile-app/app/profile': 'Profile',
    '/mobile-app/app/settings': 'Settings',
    '/mobile-app/app/notifications': 'Notifications',
    '/mobile-app/app/payment': 'Payment',
    '/mobile-app/expert-app/appointments': 'Appointments',
    '/mobile-app/expert-app/earnings': 'Earnings',
    '/mobile-app/expert-app/profile': 'Profile',
    '/mobile-app/expert-app/availability': 'Availability',
    '/mobile-app/expert-app/notifications': 'Notifications',
    '/mobile-app/expert-app/ratings-reviews': 'Ratings & Reviews',
  };

  return pathMap[pathname] || 'iFindLife';
};

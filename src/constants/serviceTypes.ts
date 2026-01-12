/**
 * Service Type Constants
 * 
 * Defines different types of services and their behavior:
 * - regular: Experts can select during onboarding (default)
 * - retreat: Admin manually assigns (like Offline Retreats)
 * - premium: Admin manually assigns (future use)
 * - exclusive: Admin manually assigns (future use)
 */

export enum ServiceType {
  REGULAR = 'regular',    // Experts can select during onboarding
  RETREAT = 'retreat',    // Admin manually assigns (Offline Retreats)
  PREMIUM = 'premium',    // Admin manually assigns (future)
  EXCLUSIVE = 'exclusive' // Admin manually assigns (future)
}

/**
 * Service types that require admin assignment
 * Experts cannot select these during onboarding
 */
export const ADMIN_ASSIGNED_TYPES: ServiceType[] = [
  ServiceType.RETREAT,
  ServiceType.PREMIUM,
  ServiceType.EXCLUSIVE
];

/**
 * Check if a service type requires admin assignment
 */
export function requiresAdminAssignment(serviceType: string | null | undefined): boolean {
  if (!serviceType) return false;
  return ADMIN_ASSIGNED_TYPES.includes(serviceType as ServiceType);
}

/**
 * Check if a service type allows expert selection
 */
export function allowsExpertSelection(serviceType: string | null | undefined): boolean {
  return !requiresAdminAssignment(serviceType);
}

/**
 * Get display name for service type
 */
export function getServiceTypeDisplayName(serviceType: string | null | undefined): string {
  switch (serviceType) {
    case ServiceType.REGULAR:
      return 'Regular Service';
    case ServiceType.RETREAT:
      return 'Offline Retreat';
    case ServiceType.PREMIUM:
      return 'Premium Service';
    case ServiceType.EXCLUSIVE:
      return 'Exclusive Service';
    default:
      return 'Regular Service';
  }
}


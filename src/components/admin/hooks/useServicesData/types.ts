
/**
 * Type definition for a service item
 * This represents an individual service that can be offered
 */
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

/**
 * Type definition for a service category
 * Categories contain multiple service items
 */
export interface ServiceCategory {
  id: string;
  name: string;
  items: ServiceItem[];
  title?: string;
  description?: string;
  href?: string;
  icon?: string;
  color?: string;
}

/**
 * Type for database service record
 * This represents the raw data structure from the database
 */
export interface DbService {
  id: number | string;
  name: string;
  description?: string;
  rate_usd?: number;
  rate_inr?: number;
  icon?: string;
  color?: string;
}

/**
 * Response type for service API operations
 */
export interface ServiceResponse {
  success: boolean;
  error?: string;
  data?: ServiceCategory[] | ServiceItem;
}

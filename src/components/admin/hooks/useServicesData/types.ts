
export interface ServiceCategory {
  id: string;
  name: string;
  items: any[];
  icon?: string;
  title?: string;
  description?: string;
  href?: string;
  color?: string;
}

// Interface for mapping DB records to UI components
export interface ServiceCategoryUI {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
  id?: string; // Add for compatibility
  name?: string; // Add for compatibility
  items?: any[]; // Add for compatibility
}

// Database service type from Supabase
export interface DbService {
  id: number;
  name: string;
  description?: string;
  rate_usd: number;
  rate_inr: number;
  icon?: string;
  color?: string;
}

// Utility function to convert DB format to UI format
export function mapDbServiceToUi(service: DbService): ServiceCategoryUI & Partial<ServiceCategory> {
  return {
    id: service.id.toString(),
    name: service.name,
    icon: service.icon || '🧠', // Default icon
    title: service.name,
    description: service.description || '',
    href: `/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`,
    color: service.color || 'bg-ifind-aqua/10', // Default color
    items: [] // Empty items array for compatibility
  };
}

// Utility function to convert UI format to ServiceCategory for internal usage
export function mapUiToServiceCategory(ui: ServiceCategoryUI): ServiceCategory {
  return {
    id: ui.id || ui.title || Math.random().toString(36).substring(2, 9),
    name: ui.name || ui.title,
    title: ui.title,
    description: ui.description,
    href: ui.href,
    icon: ui.icon,
    color: ui.color,
    items: ui.items || []
  };
}

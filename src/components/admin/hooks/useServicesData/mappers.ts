
import { ServiceCategory, ServiceItem } from './types';

/**
 * Map database service records to frontend service items
 * @param dbService Database service record
 * @returns Formatted service item for UI display
 */
export const mapDbServiceToServiceItem = (dbService: any): ServiceItem => {
  return {
    id: String(dbService.id || generateRandomId()),
    title: dbService.name || 'Untitled Service',
    description: dbService.description || '',
    href: `/services/${dbService.id}`,
    icon: getServiceIcon(dbService.name || ''),
    color: getServiceColor(dbService.name || '')
  };
};

/**
 * Group service items into categories
 * @param services Array of service items
 * @returns Array of service categories containing service items
 */
export const groupServicesByCategory = (services: ServiceItem[]): ServiceCategory[] => {
  const categories: Record<string, ServiceCategory> = {};
  
  services.forEach(service => {
    // Determine category from service name - this is just an example logic
    const categoryName = getCategoryFromServiceName(service.title);
    
    if (!categories[categoryName]) {
      categories[categoryName] = {
        name: categoryName,
        id: categoryName.toLowerCase().replace(/\s/g, '-'),
        items: []
      };
    }
    
    categories[categoryName].items.push(service);
  });
  
  return Object.values(categories);
};

/**
 * Generate a random ID for new services
 * @returns Random string ID
 */
export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Map database services to frontend categories
 * @param dbServices Database service records
 * @returns Array of service categories
 */
export const mapDbServices = (dbServices: any[]): ServiceCategory[] => {
  const serviceItems = dbServices.map(mapDbServiceToServiceItem);
  return groupServicesByCategory(serviceItems);
};

// Helper functions

function getCategoryFromServiceName(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('therapy') || nameLower.includes('counseling')) {
    return 'Therapy & Counseling';
  } else if (nameLower.includes('wellness') || nameLower.includes('health')) {
    return 'Wellness Services';
  } else if (nameLower.includes('relationship') || nameLower.includes('couple')) {
    return 'Relationship Services';
  } else {
    return 'Other Services';
  }
}

function getServiceIcon(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('therapy')) {
    return 'Brain';
  } else if (nameLower.includes('wellness') || nameLower.includes('health')) {
    return 'Flower';
  } else if (nameLower.includes('relationship') || nameLower.includes('couple')) {
    return 'Heart';
  } else {
    return 'Star';
  }
}

function getServiceColor(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('therapy')) {
    return 'blue';
  } else if (nameLower.includes('wellness') || nameLower.includes('health')) {
    return 'green';
  } else if (nameLower.includes('relationship') || nameLower.includes('couple')) {
    return 'pink';
  } else {
    return 'purple';
  }
}

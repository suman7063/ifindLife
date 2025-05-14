
import { ServiceCategory, ServiceCategoryUI } from "./types";

// Convert database service to UI-friendly format
export const mapDbServiceToUI = (service: any): ServiceCategoryUI => {
  const DEFAULT_ICON = '🧠';
  const DEFAULT_COLOR = 'bg-ifind-aqua/10';
  
  return {
    icon: service.icon || DEFAULT_ICON,
    title: service.name,
    description: service.description || '',
    href: `/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`,
    color: service.color || DEFAULT_COLOR,
    id: service.id,
    name: service.name
  };
};

// Convert UI format to ServiceCategory for database compatibility
export const mapUIToServiceCategory = (ui: ServiceCategoryUI): ServiceCategory => {
  return {
    id: ui.id || String(Date.now()),
    name: ui.name || ui.title,
    items: [],
    icon: ui.icon,
    title: ui.title,
    description: ui.description,
    href: ui.href,
    color: ui.color
  };
};

// Convert array of UI services to ServiceCategory array
export const mapUIArrayToServiceCategories = (
  uiServices: ServiceCategoryUI[]
): ServiceCategory[] => {
  return uiServices.map(mapUIToServiceCategory);
};

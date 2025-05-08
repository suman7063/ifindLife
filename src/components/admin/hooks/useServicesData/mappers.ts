
import { DbService, ServiceCategory } from './types';
import { DEFAULT_COLOR, DEFAULT_ICON } from './constants';

/**
 * Maps database service objects to the format expected by the UI
 */
export function mapDbServicesToUiFormat(services: DbService[]): ServiceCategory[] {
  return services.map((service: DbService) => ({
    icon: service.icon || DEFAULT_ICON,
    title: service.name,
    description: service.description || '',
    href: `/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`,
    color: service.color || DEFAULT_COLOR
  }));
}

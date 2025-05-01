
import { useState, useEffect } from 'react';
import { getDefaultServices } from './utils/dataLoaders';

export interface ServiceCategory {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
}

export function useServicesData(
  initialServices: ServiceCategory[] = [], 
  updateCallback: (services: ServiceCategory[]) => void = () => {}
) {
  const [services, setServices] = useState<ServiceCategory[]>(initialServices);

  // Initialize services if empty
  useEffect(() => {
    if (initialServices.length === 0) {
      const defaultServices = getDefaultServices();
      setServices(defaultServices);
      updateCallback(defaultServices);
    }
  }, [initialServices, updateCallback]);

  return {
    services,
    setServices
  };
}

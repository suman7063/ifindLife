
import React from 'react';
import ServiceCard from './ServiceCard';
import { ServiceCategory } from '@/components/admin/hooks/useServicesData';

interface ServicesListProps {
  categories: ServiceCategory[];
  onUpdate: (index: number, updatedCategory: Partial<ServiceCategory>) => void;
  onRemove: (index: number) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({ 
  categories, 
  onUpdate,
  onRemove
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category, index) => (
        <ServiceCard 
          key={index} 
          category={category} 
          index={index}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default ServicesList;

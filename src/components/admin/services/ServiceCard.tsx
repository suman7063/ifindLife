
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceCategory } from '@/components/admin/hooks/useServicesData';

interface ServiceCardProps {
  category: ServiceCategory;
  index: number;
  onUpdate: (index: number, updatedCategory: Partial<ServiceCategory>) => void;
  onRemove: (index: number) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  category, 
  index,
  onUpdate,
  onRemove
}) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center`}>
          <span className="text-3xl">{category.icon}</span>
        </div>
        <input
          className="font-semibold flex-1 border-none focus:outline-none focus:ring-1 focus:ring-ifind-aqua rounded-md px-2"
          value={category.title}
          onChange={(e) => onUpdate(index, { title: e.target.value })}
        />
      </div>
      <textarea
        className="w-full text-sm text-muted-foreground border-none focus:outline-none focus:ring-1 focus:ring-ifind-aqua rounded-md px-2 py-1"
        value={category.description}
        onChange={(e) => onUpdate(index, { description: e.target.value })}
      />
      <div className="mt-3 flex justify-between">
        <Input 
          className="text-xs w-36"
          value={category.href} 
          onChange={(e) => onUpdate(index, { href: e.target.value })}
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(index)}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;

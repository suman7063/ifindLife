
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddServiceForm from './AddServiceForm';
import { ServiceCategory } from '@/components/admin/hooks/useServicesData';

interface ServicesHeaderProps {
  serviceCount: number;
  onRefresh: () => void;
  onReset: () => void;
  onAdd: (newService: ServiceCategory) => void;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({ 
  serviceCount,
  onRefresh,
  onReset,
  onAdd 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-xl font-semibold">Edit Services</h2>
        <p className="text-muted-foreground">
          {serviceCount} services available
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
        <Button variant="outline" onClick={onReset}>Reset</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add New Service</Button>
          </DialogTrigger>
          <AddServiceForm onAdd={onAdd} />
        </Dialog>
      </div>
    </div>
  );
};

export default ServicesHeader;

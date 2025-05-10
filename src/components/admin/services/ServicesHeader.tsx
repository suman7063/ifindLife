
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ServiceCategory } from '@/components/admin/hooks/useServicesData';
import AddServiceForm from './AddServiceForm';

interface ServicesHeaderProps {
  serviceCount: number;
  onRefresh: () => void;
  onReset: () => void;
  onAdd: (newCategory: ServiceCategory) => void;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({ 
  serviceCount,
  onRefresh,
  onReset,
  onAdd
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddService = (newService: ServiceCategory) => {
    onAdd(newService);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex justify-between items-center mb-6">
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add New Service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <AddServiceForm onAdd={handleAddService} />
          </DialogContent>
        </Dialog>
        <Button 
          onClick={() => {
            // Save services to localStorage
            const content = JSON.parse(localStorage.getItem('ifindlife-content') || '{}');
            // Make sure the structure/element is kept in sync with the website
            localStorage.setItem('ifindlife-content', JSON.stringify({
              ...content,
              services: content.services || []
            }));
          }}
          className="bg-ifind-aqua hover:bg-ifind-teal"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ServicesHeader;

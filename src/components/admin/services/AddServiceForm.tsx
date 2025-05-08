
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { ServiceCategory } from '@/components/admin/hooks/useServicesData';

interface AddServiceFormProps {
  onAdd: (newCategory: ServiceCategory) => void;
}

const AddServiceForm: React.FC<AddServiceFormProps> = ({ onAdd }) => {
  const [newCategory, setNewCategory] = useState<ServiceCategory>({
    icon: "🧠", // String icon (emoji) instead of JSX element
    title: "",
    description: "",
    href: "/services/new",
    color: "bg-ifind-aqua/10"
  });

  const iconOptions = ["🧠", "💭", "🌱", "✨", "😊", "😴", "🍎", "🏃", "🧘", "🌈", "🔄", "🛌"];
  const colorOptions = [
    { name: "Aqua", value: "bg-ifind-aqua/10" },
    { name: "Purple", value: "bg-ifind-purple/10" },
    { name: "Teal", value: "bg-ifind-teal/10" },
    { name: "Charcoal", value: "bg-ifind-charcoal/10" }
  ];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Service</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Icon</label>
          <div className="grid grid-cols-6 gap-2">
            {iconOptions.map((icon) => (
              <button
                key={icon}
                type="button"
                className={`h-10 w-10 rounded-lg flex items-center justify-center text-xl
                  ${newCategory.icon === icon ? 'bg-ifind-aqua/20 ring-2 ring-ifind-aqua' : 'bg-gray-100'}`}
                onClick={() => setNewCategory({...newCategory, icon})}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input 
            value={newCategory.title} 
            onChange={(e) => setNewCategory({...newCategory, title: e.target.value})}
            placeholder="Service name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            rows={2}
            value={newCategory.description} 
            onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
            placeholder="Short description of the service"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL Path</label>
          <Input 
            value={newCategory.href} 
            onChange={(e) => setNewCategory({...newCategory, href: e.target.value})}
            placeholder="/services/your-service"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                className={`px-3 py-2 rounded-lg text-sm font-medium ${color.value} 
                  ${newCategory.color === color.value ? 'ring-2 ring-ifind-aqua' : ''}`}
                onClick={() => setNewCategory({...newCategory, color: color.value})}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button 
            className="bg-ifind-aqua hover:bg-ifind-teal"
            onClick={() => {
              if (newCategory.title && newCategory.description) {
                onAdd(newCategory);
              } else {
                toast.error("Please fill in all required fields");
              }
            }}
          >
            Add Service
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default AddServiceForm;

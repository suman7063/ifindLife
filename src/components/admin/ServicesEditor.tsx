import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from 'sonner';
import { categoryData as defaultCategoryData } from '@/data/initialAdminData';
import { ServiceCategory } from '@/components/admin/hooks/useServicesData';

type ServicesEditorProps = {
  categories: ServiceCategory[];
  setCategories: React.Dispatch<React.SetStateAction<ServiceCategory[]>>;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
};

const ServicesEditor: React.FC<ServicesEditorProps> = ({ 
  categories, 
  setCategories, 
  loading = false, 
  error = null,
  onRefresh
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Reset to default data function
  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset to default services?')) {
      setCategories(defaultCategoryData);
      toast.success('Reset to default services');
    }
  };
  
  // Force refresh data
  const forceRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      setIsRefreshing(true);
      // Force reload the page to refresh all data
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };
  
  if (loading || isRefreshing) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-24">
          <Loader2 className="h-12 w-12 text-ifind-aqua animate-spin mb-4" />
          <p className="text-gray-500">Loading services data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-24">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-500 font-medium">{error}</p>
          <div className="flex gap-4 mt-6">
            <Button onClick={forceRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh Data
            </Button>
            <Button onClick={resetToDefault}>Reset to Default</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Edit Services</h2>
          <p className="text-muted-foreground">
            {categories.length} services available
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={forceRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline" onClick={resetToDefault}>Reset</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add New Service</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <AddCategoryForm 
                onAdd={(newCategory) => setCategories([...categories, newCategory])} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center`}>
                <span className="text-3xl">{category.icon}</span>
              </div>
              <input
                className="font-semibold flex-1 border-none focus:outline-none focus:ring-1 focus:ring-ifind-aqua rounded-md px-2"
                value={category.title}
                onChange={(e) => {
                  const newCategories = [...categories];
                  newCategories[index].title = e.target.value;
                  setCategories(newCategories);
                }}
              />
            </div>
            <textarea
              className="w-full text-sm text-muted-foreground border-none focus:outline-none focus:ring-1 focus:ring-ifind-aqua rounded-md px-2 py-1"
              value={category.description}
              onChange={(e) => {
                const newCategories = [...categories];
                newCategories[index].description = e.target.value;
                setCategories(newCategories);
              }}
            />
            <div className="mt-3 flex justify-between">
              <Input 
                className="text-xs w-36"
                value={category.href} 
                onChange={(e) => {
                  const newCategories = [...categories];
                  newCategories[index].href = e.target.value;
                  setCategories(newCategories);
                }}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const newCategories = categories.filter((_, i) => i !== index);
                  setCategories(newCategories);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddCategoryForm = ({ onAdd }: { onAdd: (newCategory: ServiceCategory) => void }) => {
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
  );
};

export default ServicesEditor;

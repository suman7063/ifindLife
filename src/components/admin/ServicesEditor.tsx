
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type CategoryType = {
  icon: string; // Changed from React.ReactNode to string
  title: string;
  description: string;
  href: string;
  color: string;
};

type ServicesEditorProps = {
  categories: CategoryType[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>;
};

const ServicesEditor: React.FC<ServicesEditorProps> = ({ categories, setCategories }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Services</h2>
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

const AddCategoryForm = ({ onAdd }) => {
  const [newCategory, setNewCategory] = useState({
    icon: "🧠", // Changed from JSX to string
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
              alert("Please fill in all required fields");
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

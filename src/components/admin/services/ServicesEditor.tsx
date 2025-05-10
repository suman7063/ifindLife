
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { categoryData as defaultCategoryData } from '@/data/initialAdminData';
import { ServiceCategory } from '@/components/admin/hooks/useServicesData';
import ServicesHeader from './ServicesHeader';
import ServicesList from './ServicesList';
import ServicesEmptyState from './ServicesEmptyState';

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
  const [websiteServices, setWebsiteServices] = useState<ServiceCategory[]>([]);
  
  // Load services from website data (in localStorage)
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('ifindlife-content');
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.services && parsedContent.services.length > 0) {
          console.log('Found website services in localStorage:', parsedContent.services.length);
          setWebsiteServices(parsedContent.services);
          // Use website services if they exist
          if (categories.length === 0 || window.confirm('Sync with website services?')) {
            setCategories(parsedContent.services);
          }
        }
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
    }
  }, []);
  
  // Reset to default data function
  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset to default services?')) {
      // First try to use website services
      if (websiteServices.length > 0) {
        setCategories(websiteServices);
        toast.success('Reset to website services');
      } else {
        setCategories(defaultCategoryData);
        toast.success('Reset to default services');
      }
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

  // Handle updating a category
  const handleUpdateCategory = (index: number, updatedFields: Partial<ServiceCategory>) => {
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], ...updatedFields };
    setCategories(newCategories);
    
    // Also update in localStorage
    saveToLocalStorage(newCategories);
  };

  // Handle removing a category
  const handleRemoveCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
    
    // Also update in localStorage
    saveToLocalStorage(newCategories);
  };

  // Handle adding a new category
  const handleAddCategory = (newCategory: ServiceCategory) => {
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    
    // Also update in localStorage
    saveToLocalStorage(updatedCategories);
  };
  
  // Save to localStorage
  const saveToLocalStorage = (updatedCategories: ServiceCategory[]) => {
    try {
      const content = JSON.parse(localStorage.getItem('ifindlife-content') || '{}');
      localStorage.setItem('ifindlife-content', JSON.stringify({
        ...content,
        services: updatedCategories
      }));
      toast.success("Services saved successfully");
    } catch (error) {
      console.error("Error saving services to localStorage:", error);
    }
  };
  
  return (
    <div>
      <ServicesEmptyState 
        loading={loading} 
        error={error} 
        isRefreshing={isRefreshing} 
        onRefresh={forceRefresh} 
        onReset={resetToDefault} 
      />
      
      {!loading && !error && !isRefreshing && (
        <>
          <ServicesHeader 
            serviceCount={categories.length} 
            onRefresh={forceRefresh} 
            onReset={resetToDefault}
            onAdd={handleAddCategory}
          />
          <ServicesList 
            categories={categories} 
            onUpdate={handleUpdateCategory}
            onRemove={handleRemoveCategory}
          />
          
          {/* Save button at the bottom for convenience */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => saveToLocalStorage(categories)}
              className="px-4 py-2 bg-ifind-aqua text-white rounded-md hover:bg-ifind-teal"
            >
              Save All Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ServicesEditor;

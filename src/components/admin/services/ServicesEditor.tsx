
import React, { useState } from 'react';
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

  // Handle updating a category
  const handleUpdateCategory = (index: number, updatedFields: Partial<ServiceCategory>) => {
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], ...updatedFields };
    setCategories(newCategories);
  };

  // Handle removing a category
  const handleRemoveCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  // Handle adding a new category
  const handleAddCategory = (newCategory: ServiceCategory) => {
    setCategories([...categories, newCategory]);
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
        </>
      )}
    </div>
  );
};

export default ServicesEditor;

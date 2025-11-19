import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Save, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ExpertCategory {
  id: string;
  name: string;
  description?: string;
  base_price_30_inr?: number;
  base_price_30_eur?: number;
  base_price_60_inr?: number;
  base_price_60_eur?: number;
  created_at?: string;
}

interface Service {
  id: string; // UUID
  name: string;
  description?: string;
  rate_inr: number;
  rate_eur?: number;
}

// Define the correct category order
const CATEGORY_ORDER = ['listening-volunteer', 'listening-expert', 'mindfulness-coach', 'mindfulness-expert', 'spiritual-mentor'];

const ExpertCategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<ExpertCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categoryServices, setCategoryServices] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpertCategory | null>(null);
  const [selectedCategoryForServices, setSelectedCategoryForServices] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price_30_inr: '' as string | number,
    base_price_30_eur: '' as string | number,
    base_price_60_inr: '' as string | number,
    base_price_60_eur: '' as string | number,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Fetch all categories first
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('expert_categories')
        .select('*');

      if (categoriesError) {
        console.error('Categories fetch error:', categoriesError);
        throw categoriesError;
      }

      console.log('Fetched categories:', categoriesData);

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (servicesError) {
        console.error('Services fetch error:', servicesError);
        throw servicesError;
      }

      console.log('Fetched services:', servicesData);

      // Fetch category service assignments
      const { data: categoryServicesData, error: categoryServicesError } = await supabase
        .from('expert_category_services')
        .select('category_id, service_id');

      if (categoryServicesError) {
        console.error('Category services fetch error:', categoryServicesError);
        // Don't throw here - this table might not exist yet, just log the error
        console.warn('Could not fetch category service assignments:', categoryServicesError.message);
      }

      console.log('Fetched category services:', categoryServicesData);

      // Sort categories in the correct order
      // Categories in CATEGORY_ORDER come first, then others alphabetically
      const sortedCategories = (categoriesData || []).sort((a, b) => {
        const aIndex = CATEGORY_ORDER.indexOf(a.id);
        const bIndex = CATEGORY_ORDER.indexOf(b.id);
        
        // If both are in the order array, sort by their position
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        // If only a is in the order array, it comes first
        if (aIndex !== -1) return -1;
        // If only b is in the order array, it comes first
        if (bIndex !== -1) return 1;
        // If neither is in the order array, sort alphabetically by name
        return a.name.localeCompare(b.name);
      });
      
      console.log('Sorted categories:', sortedCategories);
      setCategories(sortedCategories);
      
      // Convert service ids from number to string (UUID) if needed
      const convertedServices = (servicesData || []).map(service => ({
        ...service,
        id: String(service.id)
      }));
      setServices(convertedServices);
      
      // Group services by category
      const categoryServicesMap: Record<string, string[]> = {};
      categoryServicesData?.forEach(({ category_id, service_id }) => {
        if (!categoryServicesMap[category_id]) {
          categoryServicesMap[category_id] = [];
        }
        categoryServicesMap[category_id].push(String(service_id));
      });
      setCategoryServices(categoryServicesMap);
    } catch (error) {
      console.error('Error fetching categories:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorDetails = error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : { error };
      console.error('Full error details:', errorDetails);
      toast.error(`Failed to load categories: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const categoryData = {
        id: editingCategory?.id || formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        description: formData.description,
        base_price_30_inr: formData.base_price_30_inr === '' ? 0 : Number(formData.base_price_30_inr) || 0,
        base_price_30_eur: formData.base_price_30_eur === '' ? 0 : Number(formData.base_price_30_eur) || 0,
        base_price_60_inr: formData.base_price_60_inr === '' ? 0 : Number(formData.base_price_60_inr) || 0,
        base_price_60_eur: formData.base_price_60_eur === '' ? 0 : Number(formData.base_price_60_eur) || 0,
      };

      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('expert_categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast.success('Category updated successfully');
      } else {
        // Create new category
        const { error } = await supabase
          .from('expert_categories')
          .insert([categoryData]);

        if (error) throw error;
        toast.success('Category created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (category: ExpertCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      base_price_30_inr: category.base_price_30_inr ?? '',
      base_price_30_eur: category.base_price_30_eur ?? '',
      base_price_60_inr: category.base_price_60_inr ?? '',
      base_price_60_eur: category.base_price_60_eur ?? '',
    });
    setIsDialogOpen(true);
  };

  const handleManageServices = async (category: ExpertCategory) => {
    setSelectedCategoryForServices(category.id);
    setSelectedCategoryName(category.name);
    setIsServiceDialogOpen(true);
    
    // Fetch the latest service assignments for this category from expert_category_services table
    try {
      const { data: categoryServicesData, error } = await supabase
        .from('expert_category_services')
        .select('service_id')
        .eq('category_id', category.id);

      if (error) {
        console.error('Error fetching category services:', error);
        // Fallback to cached data
        const categoryServiceList = (categoryServices[category.id] || []).map(id => String(id));
        setSelectedServiceIds(categoryServiceList);
      } else {
        // Extract service IDs from the fetched data
        const serviceIds = categoryServicesData?.map(item => String(item.service_id)) || [];
        setSelectedServiceIds(serviceIds);
        // Also update the cached categoryServices map for consistency
        setCategoryServices(prev => ({
          ...prev,
          [category.id]: serviceIds
        }));
      }
    } catch (error) {
      console.error('Error in handleManageServices:', error);
      // Fallback to cached data
      const categoryServiceList = categoryServices[category.id] || [];
      setSelectedServiceIds(categoryServiceList);
    }
  };

  const handleSaveServices = async () => {
    if (!selectedCategoryForServices) return;

    try {
      // First, delete existing assignments for this category
      const { error: deleteError } = await supabase
        .from('expert_category_services')
        .delete()
        .eq('category_id', selectedCategoryForServices);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      // Then, insert new assignments
      if (selectedServiceIds.length > 0) {
        const assignments = selectedServiceIds.map(serviceId => ({
          category_id: selectedCategoryForServices,
          service_id: serviceId,
        }));

        const { error: insertError } = await supabase
          .from('expert_category_services')
          .insert(assignments);

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
      }

      toast.success('Service assignments updated successfully');
      setIsServiceDialogOpen(false);
      setSelectedCategoryName(null);
      fetchCategories(); // Refresh to show updated assignments
    } catch (error) {
      console.error('Error saving service assignments:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to save service assignments: ${errorMessage}`);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('expert_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      base_price_30_inr: '',
      base_price_30_eur: '',
      base_price_60_inr: '',
      base_price_60_eur: '',
    });
    setEditingCategory(null);
  };

  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServiceIds(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Expert Categories Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage expert categories and assign services to each category
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold mb-2 block">30-Minute Session Pricing</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="base_price_30_inr">30 Min Price INR (₹)</Label>
                          <Input
                            id="base_price_30_inr"
                            type="number"
                            step="0.01"
                            value={formData.base_price_30_inr}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData({ ...formData, base_price_30_inr: value === '' ? '' : (isNaN(parseFloat(value)) ? '' : parseFloat(value)) });
                            }}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="base_price_30_eur">30 Min Price EUR (€)</Label>
                          <Input
                            id="base_price_30_eur"
                            type="number"
                            step="0.01"
                            value={formData.base_price_30_eur}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData({ ...formData, base_price_30_eur: value === '' ? '' : (isNaN(parseFloat(value)) ? '' : parseFloat(value)) });
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold mb-2 block">60-Minute Session Pricing</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="base_price_60_inr">60 Min Price INR (₹)</Label>
                          <Input
                            id="base_price_60_inr"
                            type="number"
                            step="0.01"
                            value={formData.base_price_60_inr}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData({ ...formData, base_price_60_inr: value === '' ? '' : (isNaN(parseFloat(value)) ? '' : parseFloat(value)) });
                            }}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="base_price_60_eur">60 Min Price EUR (€)</Label>
                          <Input
                            id="base_price_60_eur"
                            type="number"
                            step="0.01"
                            value={formData.base_price_60_eur}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData({ ...formData, base_price_60_eur: value === '' ? '' : (isNaN(parseFloat(value)) ? '' : parseFloat(value)) });
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Base Pricing</TableHead>
                <TableHead>Assigned Services</TableHead>
                <TableHead>Services Selection</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const assignedServices = categoryServices[category.id] || [];
                const serviceNames = assignedServices.map(serviceId => 
                  services.find(s => s.id === serviceId)?.name
                ).filter(Boolean);

                return (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>30min: ₹{category.base_price_30_inr || 0} | €{category.base_price_30_eur || 0}</div>
                        <div className="text-muted-foreground">
                          60min: ₹{category.base_price_60_inr || 0} | €{category.base_price_60_eur || 0}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {serviceNames.length > 0 ? (
                          <div>{serviceNames.slice(0, 2).join(', ')}{serviceNames.length > 2 ? `, +${serviceNames.length - 2} more` : ''}</div>
                        ) : (
                          <span className="text-muted-foreground">No services assigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleManageServices(category)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {categories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No categories found. Create your first category to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Assignment Dialog */}
      <Dialog 
        open={isServiceDialogOpen} 
        onOpenChange={(open) => {
          setIsServiceDialogOpen(open);
          if (!open) {
            setSelectedCategoryName(null);
          }
        }}
      >
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
            <DialogTitle>
              Assign Services to Category
              {selectedCategoryName && (
                <span className="block text-sm font-normal text-muted-foreground mt-1">
                  {selectedCategoryName}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Select services that experts in this category can offer:
                </p>
                {selectedServiceIds.length > 0 && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {selectedServiceIds.length} selected
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {services.map((service) => (
                  <div key={service.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={selectedServiceIds.includes(service.id)}
                      onCheckedChange={() => toggleServiceSelection(service.id)}
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`service-${service.id}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {service.name}
                      </Label>
                      {service.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {services.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No services available. Create services first in the Expert Services section.
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2 px-6 py-4 border-t flex-shrink-0">
            <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveServices}>
              <Save className="h-4 w-4 mr-2" />
              Save Assignments
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertCategoriesManager;
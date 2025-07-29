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
  base_price_inr: number;
  base_price_eur: number;
  created_at?: string;
}

interface Service {
  id: number;
  name: string;
  description?: string;
  rate_inr: number;
  rate_eur?: number;
}

const ExpertCategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<ExpertCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categoryServices, setCategoryServices] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpertCategory | null>(null);
  const [selectedCategoryForServices, setSelectedCategoryForServices] = useState<string | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price_inr: 0,
    base_price_eur: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('expert_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (servicesError) throw servicesError;

      // Fetch category service assignments
      const { data: categoryServicesData, error: categoryServicesError } = await supabase
        .from('expert_category_services')
        .select('category_id, service_id');

      if (categoryServicesError) throw categoryServicesError;

      setCategories(categoriesData || []);
      setServices(servicesData || []);
      
      // Group services by category
      const categoryServicesMap: Record<string, number[]> = {};
      categoryServicesData?.forEach(({ category_id, service_id }) => {
        if (!categoryServicesMap[category_id]) {
          categoryServicesMap[category_id] = [];
        }
        categoryServicesMap[category_id].push(service_id);
      });
      setCategoryServices(categoryServicesMap);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
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
        base_price_inr: formData.base_price_inr,
        base_price_eur: formData.base_price_eur,
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
      base_price_inr: category.base_price_inr,
      base_price_eur: category.base_price_eur,
    });
    setIsDialogOpen(true);
  };

  const handleManageServices = (category: ExpertCategory) => {
    setSelectedCategoryForServices(category.id);
    const categoryServiceList = categoryServices[category.id] || [];
    setSelectedServiceIds(categoryServiceList);
    setIsServiceDialogOpen(true);
  };

  const handleSaveServices = async () => {
    if (!selectedCategoryForServices) return;

    try {
      // First, delete existing assignments for this category
      const { error: deleteError } = await supabase
        .from('expert_category_services')
        .delete()
        .eq('category_id', selectedCategoryForServices);

      if (deleteError) throw deleteError;

      // Then, insert new assignments
      if (selectedServiceIds.length > 0) {
        const assignments = selectedServiceIds.map(serviceId => ({
          category_id: selectedCategoryForServices,
          service_id: serviceId,
        }));

        const { error: insertError } = await supabase
          .from('expert_category_services')
          .insert(assignments);

        if (insertError) throw insertError;
      }

      toast.success('Service assignments updated successfully');
      setIsServiceDialogOpen(false);
      fetchCategories(); // Refresh to show updated assignments
    } catch (error) {
      console.error('Error saving service assignments:', error);
      toast.error('Failed to save service assignments');
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
      base_price_inr: 0,
      base_price_eur: 0,
    });
    setEditingCategory(null);
  };

  const toggleServiceSelection = (serviceId: number) => {
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="base_price_inr">Base Price INR (₹)</Label>
                      <Input
                        id="base_price_inr"
                        type="number"
                        step="0.01"
                        value={formData.base_price_inr}
                        onChange={(e) => setFormData({ ...formData, base_price_inr: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="base_price_eur">Base Price EUR (€)</Label>
                      <Input
                        id="base_price_eur"
                        type="number"
                        step="0.01"
                        value={formData.base_price_eur}
                        onChange={(e) => setFormData({ ...formData, base_price_eur: parseFloat(e.target.value) || 0 })}
                        required
                      />
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
                      <div className="text-sm">
                        ₹{category.base_price_inr} | €{category.base_price_eur}
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
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Services to Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select services that experts in this category can offer:
            </p>
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
          <div className="flex justify-end space-x-2 pt-4">
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
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ExpertCategory {
  id: string;
  name: string;
  description?: string;
  base_price_usd: number;
  base_price_inr: number;
  base_price_eur: number;
  created_at?: string;
}

interface CategoryPricing {
  duration_minutes: number;
  price_usd: number;
  price_inr: number;
  price_eur: number;
}

const ExpertCategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<ExpertCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpertCategory | null>(null);
  const [categoryPricing, setCategoryPricing] = useState<Record<string, CategoryPricing[]>>({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price_usd: 0,
    base_price_inr: 0,
    base_price_eur: 0,
    pricing_30_usd: 0,
    pricing_30_inr: 0,
    pricing_30_eur: 0,
    pricing_60_usd: 0,
    pricing_60_inr: 0,
    pricing_60_eur: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('expert_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      const { data: pricingData, error: pricingError } = await supabase
        .from('expert_category_pricing')
        .select('*')
        .eq('active', true);

      if (pricingError) throw pricingError;

      setCategories(categoriesData || []);

      // Group pricing by category
      const pricingByCategory: Record<string, CategoryPricing[]> = {};
      pricingData?.forEach((pricing) => {
        if (!pricingByCategory[pricing.category]) {
          pricingByCategory[pricing.category] = [];
        }
        pricingByCategory[pricing.category].push({
          duration_minutes: pricing.duration_minutes,
          price_usd: pricing.price_usd,
          price_inr: pricing.price_inr,
          price_eur: (pricing as any).price_eur || 0,
        });
      });

      setCategoryPricing(pricingByCategory);
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
        id: formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        description: formData.description,
        base_price_usd: formData.base_price_usd,
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
      } else {
        // Create new category
        const { error } = await supabase
          .from('expert_categories')
          .insert([categoryData]);

        if (error) throw error;
      }

      // Update pricing for 30 and 60 minute sessions
      const categoryId = editingCategory?.id || categoryData.id;
      
      // First, deactivate existing pricing
      await supabase
        .from('expert_category_pricing')
        .update({ active: false })
        .eq('category', categoryId);

      // Insert new pricing
      const pricingInserts = [
        {
          category: categoryId,
          duration_minutes: 30,
          price_usd: formData.pricing_30_usd,
          price_inr: formData.pricing_30_inr,
          price_eur: formData.pricing_30_eur,
          active: true,
        },
        {
          category: categoryId,
          duration_minutes: 60,
          price_usd: formData.pricing_60_usd,
          price_inr: formData.pricing_60_inr,
          price_eur: formData.pricing_60_eur,
          active: true,
        },
      ];

      const { error: pricingError } = await supabase
        .from('expert_category_pricing')
        .insert(pricingInserts);

      if (pricingError) throw pricingError;

      toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully');
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
    const pricing = categoryPricing[category.id] || [];
    const pricing30 = pricing.find(p => p.duration_minutes === 30);
    const pricing60 = pricing.find(p => p.duration_minutes === 60);

    setFormData({
      name: category.name,
      description: category.description || '',
      base_price_usd: category.base_price_usd,
      base_price_inr: category.base_price_inr,
      base_price_eur: category.base_price_eur,
      pricing_30_usd: pricing30?.price_usd || 0,
      pricing_30_inr: pricing30?.price_inr || 0,
      pricing_30_eur: pricing30?.price_eur || 0,
      pricing_60_usd: pricing60?.price_usd || 0,
      pricing_60_inr: pricing60?.price_inr || 0,
      pricing_60_eur: pricing60?.price_eur || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      // First deactivate all pricing for this category
      await supabase
        .from('expert_category_pricing')
        .update({ active: false })
        .eq('category', categoryId);

      // Then delete the category
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
      base_price_usd: 0,
      base_price_inr: 0,
      base_price_eur: 0,
      pricing_30_usd: 0,
      pricing_30_inr: 0,
      pricing_30_eur: 0,
      pricing_60_usd: 0,
      pricing_60_inr: 0,
      pricing_60_eur: 0,
    });
    setEditingCategory(null);
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
                Manage expert categories and set pricing for different consultation durations
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">30-Minute Session Pricing</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="pricing_30_usd">USD ($)</Label>
                        <Input
                          id="pricing_30_usd"
                          type="number"
                          step="0.01"
                          value={formData.pricing_30_usd}
                          onChange={(e) => setFormData({ ...formData, pricing_30_usd: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricing_30_inr">INR (₹)</Label>
                        <Input
                          id="pricing_30_inr"
                          type="number"
                          step="0.01"
                          value={formData.pricing_30_inr}
                          onChange={(e) => setFormData({ ...formData, pricing_30_inr: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricing_30_eur">EUR (€)</Label>
                        <Input
                          id="pricing_30_eur"
                          type="number"
                          step="0.01"
                          value={formData.pricing_30_eur}
                          onChange={(e) => setFormData({ ...formData, pricing_30_eur: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">60-Minute Session Pricing</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="pricing_60_usd">USD ($)</Label>
                        <Input
                          id="pricing_60_usd"
                          type="number"
                          step="0.01"
                          value={formData.pricing_60_usd}
                          onChange={(e) => setFormData({ ...formData, pricing_60_usd: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricing_60_inr">INR (₹)</Label>
                        <Input
                          id="pricing_60_inr"
                          type="number"
                          step="0.01"
                          value={formData.pricing_60_inr}
                          onChange={(e) => setFormData({ ...formData, pricing_60_inr: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricing_60_eur">EUR (€)</Label>
                        <Input
                          id="pricing_60_eur"
                          type="number"
                          step="0.01"
                          value={formData.pricing_60_eur}
                          onChange={(e) => setFormData({ ...formData, pricing_60_eur: parseFloat(e.target.value) || 0 })}
                          required
                        />
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
                <TableHead>30min Pricing</TableHead>
                <TableHead>60min Pricing</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const pricing = categoryPricing[category.id] || [];
                const pricing30 = pricing.find(p => p.duration_minutes === 30);
                const pricing60 = pricing.find(p => p.duration_minutes === 60);

                return (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description || 'N/A'}</TableCell>
                    <TableCell>
                      {pricing30 ? (
                        <div className="text-sm">
                          <div>${pricing30.price_usd} | ₹{pricing30.price_inr} | €{pricing30.price_eur}</div>
                        </div>
                      ) : (
                        'Not set'
                      )}
                    </TableCell>
                    <TableCell>
                      {pricing60 ? (
                        <div className="text-sm">
                          <div>${pricing60.price_usd} | ₹{pricing60.price_inr} | €{pricing60.price_eur}</div>
                        </div>
                      ) : (
                        'Not set'
                      )}
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
    </div>
  );
};

export default ExpertCategoriesManager;
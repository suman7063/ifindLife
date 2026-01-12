import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { 
  Plus, Edit, Trash2, Save, Eye, Brain, HeartHandshake, HeartPulse, Leaf, MessageCircle, Sparkles, 
  Heart, Users, User, Shield, Star, Moon, Sun, Flower, Flower2, Smile, SmilePlus, HandHeart, 
  HandHelping, Handshake, Lightbulb, Target, Award, BookOpen, Book, GraduationCap, School, 
  Home, Building, TreePine, Mountain, Waves, Wind, Flame, Zap, Activity, TrendingUp, LucideIcon,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { ServiceType, requiresAdminAssignment } from '@/constants/serviceTypes';

// Icon options with preview - 20 icons
const iconOptions = [
  { value: 'Brain', label: 'Brain', icon: Brain },
  { value: 'HeartPulse', label: 'Heart Pulse', icon: HeartPulse },
  { value: 'HeartHandshake', label: 'Heart Handshake', icon: HeartHandshake },
  { value: 'MessageCircle', label: 'Message Circle', icon: MessageCircle },
  { value: 'Leaf', label: 'Leaf', icon: Leaf },
  { value: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'Heart', label: 'Heart', icon: Heart },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'User', label: 'User', icon: User },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'Moon', label: 'Moon', icon: Moon },
  { value: 'Sun', label: 'Sun', icon: Sun },
  { value: 'Flower', label: 'Flower', icon: Flower },
  { value: 'Flower2', label: 'Flower 2', icon: Flower2 },
  { value: 'Smile', label: 'Smile', icon: Smile },
  { value: 'SmilePlus', label: 'Smile Plus', icon: SmilePlus },
  { value: 'HandHeart', label: 'Hand Heart', icon: HandHeart },
  { value: 'HandHelping', label: 'Hand Helping', icon: HandHelping },
  { value: 'Handshake', label: 'Handshake', icon: Handshake },
  { value: 'Lightbulb', label: 'Lightbulb', icon: Lightbulb },
  { value: 'Target', label: 'Target', icon: Target },
  { value: 'Award', label: 'Award', icon: Award },
  { value: 'BookOpen', label: 'Book Open', icon: BookOpen },
  { value: 'Book', label: 'Book', icon: Book },
  { value: 'GraduationCap', label: 'Graduation Cap', icon: GraduationCap },
  { value: 'School', label: 'School', icon: School },
  { value: 'Home', label: 'Home', icon: Home },
  { value: 'Building', label: 'Building', icon: Building },
  { value: 'TreePine', label: 'Tree Pine', icon: TreePine },
  { value: 'Mountain', label: 'Mountain', icon: Mountain },
  { value: 'Waves', label: 'Waves', icon: Waves },
  { value: 'Wind', label: 'Wind', icon: Wind },
  { value: 'Flame', label: 'Flame', icon: Flame },
  { value: 'Zap', label: 'Zap', icon: Zap },
  { value: 'Activity', label: 'Activity', icon: Activity },
  { value: 'TrendingUp', label: 'Trending Up', icon: TrendingUp },
];

// Helper function to convert hex to rgba with opacity
const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Helper function to generate darker shade for hover
const darkenColor = (hex: string, percent: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const newR = Math.max(0, Math.floor(r * (1 - percent)));
  const newG = Math.max(0, Math.floor(g * (1 - percent)));
  const newB = Math.max(0, Math.floor(b * (1 - percent)));
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

interface Service {
  id: string; // UUID
  name: string;
  description?: string;
  category?: string;
  duration?: number;
  rate_inr?: number;
  rate_eur?: number;
  location?: string; // Location for Offline Retreats
  // UI fields
  image?: string;
  slug?: string;
  color?: string;
  gradient_color?: string;
  text_color?: string;
  button_color?: string;
  icon_name?: string;
  icon_image?: string; // Uploaded icon image URL
  detailed_description?: string;
  benefits?: string[] | string; // Can be JSONB array or string
  process?: string;
  created_at?: string;
  is_retreat?: boolean;
  assignedExpertsCount?: number; // Number of experts assigned to this retreat
}

interface Expert {
  id: string;
  name: string;
  email: string;
  status: string;
  category?: string;
}

const OfflineRetreatsManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isColorPreviewOpen, setIsColorPreviewOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  
  // Expert assignment state
  const [isExpertDialogOpen, setIsExpertDialogOpen] = useState(false);
  const [selectedRetreat, setSelectedRetreat] = useState<Service | null>(null);
  const [allExperts, setAllExperts] = useState<Expert[]>([]);
  const [assignedExpertIds, setAssignedExpertIds] = useState<string[]>([]);
  const [loadingExperts, setLoadingExperts] = useState(false);
  const [savingExperts, setSavingExperts] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '' as string | number,
    rate_inr: '' as string | number,
    rate_eur: '' as string | number,
    location: '', // Location for Offline Retreats
    // UI fields - storing hex colors directly
    image: '',
    slug: '',
    color: '#5AC8FA', // Default aqua color (hex)
    gradient_color: '', // Will be auto-generated
    text_color: '', // Will be auto-generated (same as color)
    button_color: '', // Will be auto-generated
    icon_name: '',
    icon_image: '',
    detailed_description: '',
    benefits: '' as string,
    process: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch only retreat services (using service_type)
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('service_type', ServiceType.RETREAT)
        .order('name');

      if (servicesError) throw servicesError;

      // Convert id from number to string (UUID) if needed
      const convertedServices = (servicesData || []).map(service => ({
        ...service,
        id: String(service.id)
      }));
      
      // Fetch assigned experts count for each retreat
      const servicesWithCounts = await Promise.all(
        convertedServices.map(async (service) => {
          const { data: expertServices, error } = await supabase
            .from('admin_expert_service_assignments')
            .select('expert_id', { count: 'exact' })
            .eq('service_id', service.id)
            .eq('is_active', true);
          
          return {
            ...service,
            assignedExpertsCount: expertServices?.length || 0
          };
        })
      );
      
      setServices(servicesWithCounts);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchExperts = async (serviceId: string) => {
    setLoadingExperts(true);
    try {
      // Fetch all approved experts with category
      const { data: expertsData, error: expertsError } = await supabase
        .from('expert_accounts')
        .select('auth_id, name, email, status, category')
        .eq('status', 'approved')
        .order('name');

      if (expertsError) throw expertsError;

      const experts = (expertsData || []).map(expert => ({
        id: expert.auth_id,
        name: expert.name,
        email: expert.email,
        status: expert.status,
        category: expert.category || 'N/A'
      }));

      setAllExperts(experts);

      // Fetch currently assigned experts for this retreat
      const { data: assignedData, error: assignedError } = await supabase
        .from('admin_expert_service_assignments')
        .select('expert_id')
        .eq('service_id', serviceId)
        .eq('is_active', true);

      if (assignedError) {
        console.error('Error fetching assigned experts:', assignedError);
        // Don't throw, just log - continue with empty list
      }

      const assignedIds = (assignedData || []).map(item => item.expert_id);
      console.log('🔍 Assigned expert IDs for service:', serviceId, assignedIds);
      setAssignedExpertIds(assignedIds);
    } catch (error) {
      console.error('Error fetching experts:', error);
      toast.error('Failed to load experts');
    } finally {
      setLoadingExperts(false);
    }
  };

  const handleOpenExpertDialog = async (service: Service) => {
    setSelectedRetreat(service);
    setIsExpertDialogOpen(true);
    // Reset assigned IDs first, then fetch
    setAssignedExpertIds([]);
    await fetchExperts(service.id);
  };

  const handleToggleExpert = (expertId: string) => {
    setAssignedExpertIds(prev => 
      prev.includes(expertId)
        ? prev.filter(id => id !== expertId)
        : [...prev, expertId]
    );
  };

  const handleSaveExpertAssignments = async () => {
    if (!selectedRetreat) return;

    setSavingExperts(true);
    try {
      // Get current user/admin info
      const { data: userData } = await supabase.auth.getUser();
      
      // Delete existing assignments for this retreat
      const { error: deleteError } = await supabase
        .from('admin_expert_service_assignments')
        .delete()
        .eq('service_id', selectedRetreat.id);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      // Insert new assignments
      if (assignedExpertIds.length > 0) {
        const assignments = assignedExpertIds.map(expertId => ({
          expert_id: expertId,
          service_id: selectedRetreat.id,
          is_active: true,
          admin_assigned_rate_inr: selectedRetreat.rate_inr || null,
          admin_assigned_rate_usd: 0, // Default value
          assigned_by: userData.user?.email || 'admin', // Use email or 'admin' as fallback
          assigned_at: new Date().toISOString()
        }));

        const { error: insertError } = await supabase
          .from('admin_expert_service_assignments')
          .insert(assignments);

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
      }

      toast.success('Expert assignments updated successfully');
      setIsExpertDialogOpen(false);
      setSelectedRetreat(null);
      setAssignedExpertIds([]);
      fetchData(); // Refresh to update counts
    } catch (error: any) {
      console.error('Error saving expert assignments:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to save expert assignments: ${errorMessage}`);
    } finally {
      setSavingExperts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Parse benefits if it's a string (comma-separated or JSON)
      let benefitsArray: string[] = [];
      if (formData.benefits) {
        try {
          // Try parsing as JSON first
          const parsed = JSON.parse(formData.benefits);
          benefitsArray = Array.isArray(parsed) ? parsed : [formData.benefits];
        } catch {
          // If not JSON, split by comma or newline
          benefitsArray = formData.benefits.split(/[,\n]/).map(b => b.trim()).filter(Boolean);
        }
      }

      // Auto-generate slug if not provided
      const slug = formData.slug || formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const serviceData: {
        name: string;
        description: string | null;
        duration: number;
        rate_inr: number;
        rate_eur: number;
        rate_usd: number;
        location: string | null;
        image: string | null;
        slug: string;
        color: string | null;
        gradient_color: string | null;
        text_color: string | null;
        button_color: string | null;
        icon_name: string | null;
        icon_image: string | null;
        detailed_description: string | null;
        benefits: string[] | null;
        process: string | null;
        is_retreat: boolean;
      } = {
        name: formData.name,
        description: formData.description || null,
        duration: formData.duration === '' ? 60 : Number(formData.duration) || 60,
        rate_inr: formData.rate_inr === '' ? 0 : Number(formData.rate_inr) || 0,
        rate_eur: formData.rate_eur === '' ? 0 : Number(formData.rate_eur) || 0,
        rate_usd: 0, // Default value - removed but still required by types
        location: formData.location || null,
        // UI fields
        image: formData.image || null,
        slug: slug,
        color: formData.color || null,
        gradient_color: formData.gradient_color || null,
        text_color: formData.text_color || null,
        button_color: formData.button_color || null,
        icon_name: formData.icon_name || null,
        icon_image: formData.icon_image || null,
        detailed_description: formData.detailed_description || null,
        benefits: benefitsArray.length > 0 ? benefitsArray : null,
        process: formData.process || null,
        service_type: ServiceType.RETREAT, // Always set to 'retreat' for retreats
      };

      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;
        toast.success('Retreat updated successfully');
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);

        if (error) throw error;
        toast.success('Retreat created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving retreat:', error);
      toast.error('Failed to save retreat');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    
    // Parse benefits if it's an array
    let benefitsString = '';
    if (service.benefits) {
      if (Array.isArray(service.benefits)) {
        benefitsString = service.benefits.join(', ');
      } else if (typeof service.benefits === 'string') {
        try {
          const parsed = JSON.parse(service.benefits);
          benefitsString = Array.isArray(parsed) ? parsed.join(', ') : service.benefits;
        } catch {
          benefitsString = service.benefits;
        }
      }
    }
    
    // Handle color - if it's a class name, convert to hex, otherwise use as is
    let colorValue = service.color || '#5AC8FA';
    if (colorValue && !colorValue.startsWith('#')) {
      // If it's a class name like 'bg-ifind-aqua', try to extract hex
      const colorMap: Record<string, string> = {
        'bg-ifind-aqua': '#5AC8FA',
        'bg-ifind-purple': '#A88BEB',
        'bg-ifind-teal': '#7DD8C9',
        'bg-ifind-charcoal': '#2E2E2E',
      };
      colorValue = colorMap[colorValue] || '#5AC8FA';
    }
    
    // Auto-generate colors if not present
    const gradientColor = service.gradient_color || `${colorValue}20`;
    const textColor = service.text_color || colorValue;
    let buttonColor = service.button_color || '';
    if (!buttonColor || !buttonColor.includes('|')) {
      const buttonHover = darkenColor(colorValue, 0.1);
      buttonColor = `${colorValue}|${buttonHover}`;
    }
    
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration ?? '',
      rate_inr: service.rate_inr ?? '',
      rate_eur: service.rate_eur ?? '',
      location: service.location || '',
      // UI fields - using hex colors
      image: service.image || '',
      slug: service.slug || '',
      color: colorValue,
      gradient_color: gradientColor,
      text_color: textColor,
      button_color: buttonColor,
      icon_name: service.icon_name || '',
      icon_image: service.icon_image || '',
      detailed_description: service.detailed_description || '',
      benefits: benefitsString,
      process: service.process || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this retreat? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      toast.success('Retreat deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting retreat:', error);
      toast.error('Failed to delete retreat');
    }
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `retreat-banner-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image: publicUrl });
      toast.success('Banner image uploaded successfully');
    } catch (error) {
      console.error('Error uploading banner:', error);
      toast.error('Failed to upload banner image');
    } finally {
      setUploadingBanner(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingIcon(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `retreat-icon-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(fileName);

      // Store icon URL in icon_image field
      setFormData({ ...formData, icon_image: publicUrl });
      toast.success('Icon image uploaded successfully');
    } catch (error) {
      console.error('Error uploading icon:', error);
      toast.error('Failed to upload icon image');
    } finally {
      setUploadingIcon(false);
      // Reset input
      event.target.value = '';
    }
  };

  const resetForm = () => {
    const defaultColor = '#5AC8FA';
    const defaultGradient = `${defaultColor}20`;
    const defaultButtonHover = darkenColor(defaultColor, 0.1);
    
    setFormData({
      name: '',
      description: '',
      duration: '',
      rate_inr: '',
      rate_eur: '',
      location: '',
      // UI fields - default hex colors
      image: '',
      slug: '',
      color: defaultColor,
      gradient_color: defaultGradient,
      text_color: defaultColor,
      button_color: `${defaultColor}|${defaultButtonHover}`,
      icon_name: '',
      icon_image: '',
      detailed_description: '',
      benefits: '',
      process: '',
    });
    setEditingService(null);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading retreats...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Offline Retreats Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage offline retreats. Retreats are only assigned to specific experts by admin.
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Retreat
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingService ? 'Edit Retreat' : 'Add New Retreat'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Basic Information */}
                  <div className="space-y-4 border-b pb-4">
                    <h3 className="font-semibold text-lg">Basic Information</h3>
                    
                  <div>
                      <Label htmlFor="name">Retreat Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Offline Retreats"
                      required
                    />
                  </div>

                  <div>
                      <Label htmlFor="slug">Slug (URL-friendly)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="Auto-generated from name if empty"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave empty to auto-generate from retreat name
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="description">Short Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of the retreat..."
                        rows={2}
                    />
                  </div>

                  <div>
                      <Label htmlFor="detailed_description">Detailed Description</Label>
                      <Textarea
                        id="detailed_description"
                        value={formData.detailed_description}
                        onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                        placeholder="Extended description with more details..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Pricing & Duration */}
                  <div className="space-y-4 border-b pb-4">
                    <h3 className="font-semibold text-lg">Pricing & Duration</h3>
                    
                    <div>
                      <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, duration: value === '' ? '' : (isNaN(parseInt(value)) ? '' : parseInt(value)) });
                      }}
                      placeholder="e.g. 1440 (24 hours)"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value });
                      }}
                      placeholder="e.g. Rishikesh, Uttarakhand"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="rate_inr">Rate INR (₹) *</Label>
                      <Input
                        id="rate_inr"
                        type="number"
                        step="0.01"
                        value={formData.rate_inr}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, rate_inr: value === '' ? '' : (isNaN(parseFloat(value)) ? '' : parseFloat(value)) });
                        }}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                        <Label htmlFor="rate_eur">Rate EUR (€) *</Label>
                      <Input
                        id="rate_eur"
                        type="number"
                        step="0.01"
                        value={formData.rate_eur}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, rate_eur: value === '' ? '' : (isNaN(parseFloat(value)) ? '' : parseFloat(value)) });
                        }}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  </div>

                  {/* UI Configuration */}
                  <div className="space-y-4 border-b pb-4">
                    <h3 className="font-semibold text-lg">UI Configuration</h3>
                    
                    <div>
                      <Label htmlFor="image">Banner Image</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Upload banner image to Supabase Storage bucket. Only bucket URLs are allowed.
                      </p>
                      <div className="flex gap-2">
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) => {
                            const url = e.target.value;
                            // Only allow Supabase Storage bucket URLs or empty
                            if (url === '' || url.includes('/storage/v1/object/public/service-images/') || url.includes('service-images')) {
                              setFormData({ ...formData, image: url });
                            } else {
                              toast.error('Only Supabase Storage bucket URLs are allowed. Please use the Upload button.');
                            }
                          }}
                          placeholder="Upload image to get bucket URL"
                          className="flex-1"
                          readOnly={!!formData.image && !formData.image.includes('/storage/v1/object/public/service-images/')}
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploadingBanner}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploadingBanner}
                            className="whitespace-nowrap"
                          >
                            {uploadingBanner ? 'Uploading...' : 'Upload'}
                          </Button>
                        </div>
                        {formData.image && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormData({ ...formData, image: '' })}
                            className="whitespace-nowrap"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      {formData.image && (
                        <div className="mt-2">
                          <img 
                            src={formData.image} 
                            alt="Banner preview" 
                            className="h-20 w-full object-cover rounded border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          {!formData.image.includes('/storage/v1/object/public/service-images/') && (
                            <p className="text-xs text-red-500 mt-1">
                              ⚠️ This is not a bucket URL. Please upload using the Upload button.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Icon Name Selection */}
                    <div>
                      <Label htmlFor="icon_name">Icon Name (Lucide Icon)</Label>
                      <Select
                        value={formData.icon_name || ''}
                        onValueChange={(value) => setFormData({ ...formData, icon_name: value })}
                      >
                        <SelectTrigger id="icon_name" className="w-full">
                          <div className="flex items-center gap-2">
                            {formData.icon_name ? (() => {
                              const selectedIcon = iconOptions.find(opt => opt.value === formData.icon_name);
                              const IconComponent = selectedIcon?.icon || Brain;
                              return <IconComponent className="h-4 w-4 flex-shrink-0" />;
                            })() : (
                              <Brain className="h-4 w-4 flex-shrink-0 opacity-50" />
                            )}
                            <SelectValue placeholder="Select an icon">
                              {formData.icon_name ? (() => {
                                const selectedIcon = iconOptions.find(opt => opt.value === formData.icon_name);
                                return selectedIcon?.label || formData.icon_name;
                              })() : null}
                            </SelectValue>
                          </div>
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                          {iconOptions.map((option) => {
                            const IconComponent = option.icon;
                            return (
                              <SelectItem 
                                key={option.value} 
                                value={option.value}
                              >
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-4 w-4" />
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select a Lucide icon to display for this retreat
                      </p>
                    </div>

                    {/* Color Selection - Actual Color Picker */}
                    <div>
                      <Label htmlFor="color_picker">Retreat Color</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        Pick a color. Gradient, text, and button colors will be auto-generated.
                      </p>
                      
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="color_picker"
                            value={formData.color || '#5AC8FA'}
                            onChange={(e) => {
                              const selectedColor = e.target.value;
                              const gradientColor = `${selectedColor}20`; // 20% opacity for gradient start
                              const textColor = selectedColor; // Same as main color
                              const buttonHoverColor = darkenColor(selectedColor, 0.1); // 10% darker for hover
                              
                              setFormData({
                                ...formData,
                                color: selectedColor,
                                gradient_color: `${selectedColor}20`, // Store as hex with opacity
                                text_color: selectedColor,
                                button_color: `${selectedColor}|${buttonHoverColor}`, // Store both colors separated by |
                              });
                            }}
                            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                          />
                          <div className="flex flex-col">
                            <Input
                              type="text"
                              value={formData.color || '#5AC8FA'}
                              onChange={(e) => {
                                const selectedColor = e.target.value;
                                if (/^#[0-9A-Fa-f]{6}$/.test(selectedColor)) {
                                  const gradientColor = `${selectedColor}20`;
                                  const buttonHoverColor = darkenColor(selectedColor, 0.1);
                                  setFormData({
                                    ...formData,
                                    color: selectedColor,
                                    gradient_color: gradientColor,
                                    text_color: selectedColor,
                                    button_color: `${selectedColor}|${buttonHoverColor}`,
                                  });
                                } else {
                                  setFormData({ ...formData, color: selectedColor });
                                }
                              }}
                              placeholder="#5AC8FA"
                              className="w-32 font-mono text-sm"
                            />
                            <span className="text-xs text-muted-foreground mt-1">Hex color code</span>
                          </div>
                        </div>
                        {/* Color Preview Button */}
                        {formData.color && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsColorPreviewOpen(true)}
                            className="flex items-center gap-2 ml-auto"
                          >
                            <Eye className="h-4 w-4" />
                            Preview Colors
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Color Preview Modal */}
                    <Dialog open={isColorPreviewOpen} onOpenChange={setIsColorPreviewOpen}>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Color Preview</DialogTitle>
                        </DialogHeader>
                        {formData.color && (
                          <div className="space-y-4 mt-4">
                            <div>
                              <span className="text-sm font-medium text-muted-foreground block mb-2">Background Color:</span>
                              <div 
                                className="h-16 rounded-lg border shadow-sm"
                                style={{ backgroundColor: formData.color }}
                              />
                              <code className="text-xs font-mono mt-2 block text-gray-600">{formData.color}</code>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground block mb-2">Gradient:</span>
                              <div 
                                className="h-16 rounded-lg border shadow-sm"
                                style={{ 
                                  background: `linear-gradient(to right, ${formData.gradient_color || formData.color + '33'}, white)` 
                                }}
                              />
                              <code className="text-xs font-mono mt-2 block text-gray-600">{formData.gradient_color || 'Auto-generated'}</code>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground block mb-2">Text Color:</span>
                              <div className="h-16 rounded-lg border shadow-sm flex items-center justify-center bg-white">
                                <span 
                                  className="text-lg font-semibold"
                                  style={{ color: formData.text_color || formData.color }}
                                >
                                  Sample Text
                                </span>
                              </div>
                              <code className="text-xs font-mono mt-2 block text-gray-600">{formData.text_color || formData.color}</code>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground block mb-2">Button Color:</span>
                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  className="px-6 py-3 rounded-lg text-white font-medium shadow-sm transition-colors"
                                  style={{ 
                                    backgroundColor: formData.button_color?.split('|')[0] || formData.color,
                                  }}
                                  onMouseEnter={(e) => {
                                    const hoverColor = formData.button_color?.split('|')[1] || darkenColor(formData.color, 0.1);
                                    e.currentTarget.style.backgroundColor = hoverColor;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = formData.button_color?.split('|')[0] || formData.color;
                                  }}
                                >
                                  Button Preview
                                </button>
                                <div className="flex-1">
                                  <code className="text-xs font-mono block text-gray-600">
                                    Main: {formData.button_color?.split('|')[0] || formData.color}
                                  </code>
                                  <code className="text-xs font-mono block text-gray-600 mt-1">
                                    Hover: {formData.button_color?.split('|')[1] || darkenColor(formData.color, 0.1)}
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Additional Content */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Additional Content</h3>
                    
                    <div>
                      <Label htmlFor="benefits">Benefits (comma-separated or one per line)</Label>
                      <Textarea
                        id="benefits"
                        value={formData.benefits}
                        onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                        placeholder="Benefit 1, Benefit 2, Benefit 3..."
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separate benefits with commas or new lines
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="process">Process Description</Label>
                      <Textarea
                        id="process"
                        value={formData.process}
                        onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                        placeholder="Describe the retreat process..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingService ? 'Update Retreat' : 'Create Retreat'}
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
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Rates</TableHead>
                <TableHead>Assigned Experts</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={service.name}
                        className="h-16 w-24 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-16 w-24 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    <div className="max-w-md" title={service.description}>
                      {service.description || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {service.duration || 60} min
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>₹{service.rate_inr || 0}</div>
                      <div className="text-muted-foreground">€{service.rate_eur || 0}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {service.assignedExpertsCount || 0} expert{service.assignedExpertsCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenExpertDialog(service)}
                        title="Manage Expert Assignments"
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {services.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No retreats found. Create your first retreat to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expert Assignment Dialog */}
      <Dialog open={isExpertDialogOpen} onOpenChange={setIsExpertDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Expert Assignments - {selectedRetreat?.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Select which experts can offer this retreat. Only selected experts will be able to provide this service.
            </p>
          </DialogHeader>
          
          {loadingExperts ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-lg">Loading experts...</div>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
                {allExperts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No approved experts found.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {allExperts.map((expert) => {
                      const isSelected = assignedExpertIds.includes(expert.id);
                      return (
                        <div
                          key={expert.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50 border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleToggleExpert(expert.id)}
                        >
                          <div className="flex items-center gap-3">
                            {isSelected ? (
                              <UserCheck className="h-5 w-5 text-blue-600" />
                            ) : (
                              <User className="h-5 w-5 text-gray-400" />
                            )}
                            <div>
                              <div className="font-medium">{expert.name}</div>
                              <div className="text-sm text-muted-foreground">{expert.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {expert.category && (
                              <Badge variant="outline" className="text-xs">
                                {expert.category.replace(/-/g, ' ')}
                              </Badge>
                            )}
                            {isSelected && (
                              <Badge variant="default" className="bg-blue-600">
                                Assigned
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {assignedExpertIds.length} of {allExperts.length} expert{allExperts.length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsExpertDialogOpen(false);
                      setSelectedRetreat(null);
                      // Don't reset assignedExpertIds here - keep them for next time dialog opens
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveExpertAssignments}
                    disabled={savingExperts}
                  >
                    {savingExperts ? 'Saving...' : 'Save Assignments'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfflineRetreatsManager;


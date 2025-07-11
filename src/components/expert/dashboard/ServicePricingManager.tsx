import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, DollarSign, Clock, Star, TrendingUp, Settings, Plus, Edit2, Trash2 } from 'lucide-react';

// Service pricing schema for dynamic pricing
const servicePricingSchema = z.object({
  serviceId: z.number().min(1, 'Please select a service'),
  basePriceUSD: z.number().min(1, 'Base price must be at least $1'),
  basePriceINR: z.number().min(50, 'Base price must be at least ₹50'),
  peakHourMultiplier: z.number().min(1, 'Peak hour multiplier must be at least 1.0').max(3, 'Peak hour multiplier cannot exceed 3.0'),
  experienceMultiplier: z.number().min(1, 'Experience multiplier must be at least 1.0').max(2, 'Experience multiplier cannot exceed 2.0'),
  discountPercentage: z.number().min(0, 'Discount cannot be negative').max(50, 'Discount cannot exceed 50%'),
  minimumDuration: z.number().min(15, 'Minimum duration must be at least 15 minutes'),
  maximumDuration: z.number().min(30, 'Maximum duration must be at least 30 minutes'),
  proficiencyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  yearsExperience: z.number().min(0, 'Experience cannot be negative'),
  description: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  isPrimaryService: z.boolean().default(false),
});

type ServicePricingFormData = z.infer<typeof servicePricingSchema>;

interface Service {
  id: number;
  name: string;
  description?: string;
  rate_usd: number;
  rate_inr: number;
}

interface ExpertServiceSpecialization {
  id: string;
  service_id: number;
  service_name?: string;
  proficiency_level: string;
  years_experience: number;
  certifications: string[];
  description?: string;
  is_primary_service: boolean;
  hourly_rate_usd?: number;
  hourly_rate_inr?: number;
  is_available: boolean;
}

interface ServicePricingManagerProps {
  expertId: string;
  onUpdate?: () => void;
}

const ServicePricingManager: React.FC<ServicePricingManagerProps> = ({ 
  expertId, 
  onUpdate 
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [expertSpecializations, setExpertSpecializations] = useState<ExpertServiceSpecialization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSpecialization, setEditingSpecialization] = useState<ExpertServiceSpecialization | null>(null);

  const form = useForm<ServicePricingFormData>({
    resolver: zodResolver(servicePricingSchema),
    defaultValues: {
      peakHourMultiplier: 1.2,
      experienceMultiplier: 1.0,
      discountPercentage: 0,
      minimumDuration: 30,
      maximumDuration: 120,
      proficiencyLevel: 'intermediate',
      yearsExperience: 0,
      isPrimaryService: false,
      certifications: [],
    },
  });

  // Load available services and expert's current specializations
  useEffect(() => {
    loadServices();
    loadExpertSpecializations();
  }, [expertId]);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    }
  };

  const loadExpertSpecializations = async () => {
    try {
      const { data, error } = await supabase
        .from('expert_service_specializations')
        .select(`
          *,
          services:service_id (
            name
          )
        `)
        .eq('expert_id', expertId);

      if (error) throw error;

      const formattedData = (data || []).map(item => ({
        ...item,
        service_name: item.services?.name || 'Unknown Service'
      }));

      setExpertSpecializations(formattedData);
    } catch (error) {
      console.error('Error loading expert specializations:', error);
      toast.error('Failed to load current services');
    }
  };

  const handleSubmit = async (data: ServicePricingFormData) => {
    setIsLoading(true);
    
    try {
      const specializationData = {
        expert_id: expertId,
        service_id: data.serviceId,
        proficiency_level: data.proficiencyLevel,
        years_experience: data.yearsExperience,
        certifications: data.certifications || [],
        description: data.description,
        is_primary_service: data.isPrimaryService,
        hourly_rate_usd: data.basePriceUSD,
        hourly_rate_inr: data.basePriceINR,
        is_available: true,
      };

      if (editingSpecialization) {
        // Update existing specialization
        const { error } = await supabase
          .from('expert_service_specializations')
          .update(specializationData)
          .eq('id', editingSpecialization.id);

        if (error) throw error;
        toast.success('Service specialization updated successfully');
      } else {
        // Create new specialization
        const { error } = await supabase
          .from('expert_service_specializations')
          .insert(specializationData);

        if (error) throw error;
        toast.success('Service specialization added successfully');
      }

      // Also create/update service pricing entry
      const pricingData = {
        expert_id: expertId,
        service_id: data.serviceId,
        base_price_usd: data.basePriceUSD,
        base_price_inr: data.basePriceINR,
        peak_hour_multiplier: data.peakHourMultiplier,
        experience_multiplier: data.experienceMultiplier,
        discount_percentage: data.discountPercentage,
        minimum_session_duration: data.minimumDuration,
        maximum_session_duration: data.maximumDuration,
        is_active: true,
      };

      const { error: pricingError } = await supabase
        .from('service_pricing')
        .upsert(pricingData, { onConflict: 'expert_id,service_id' });

      if (pricingError) {
        console.error('Pricing error:', pricingError);
        // Don't throw here as the main data was saved
      }

      // Reset form and reload data
      form.reset();
      setEditingSpecialization(null);
      loadExpertSpecializations();
      onUpdate?.();

    } catch (error: any) {
      console.error('Error saving service specialization:', error);
      toast.error(error.message || 'Failed to save service specialization');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (specialization: ExpertServiceSpecialization) => {
    setEditingSpecialization(specialization);
    form.reset({
      serviceId: specialization.service_id,
      basePriceUSD: specialization.hourly_rate_usd || 50,
      basePriceINR: specialization.hourly_rate_inr || 2000,
      peakHourMultiplier: 1.2,
      experienceMultiplier: 1.0,
      discountPercentage: 0,
      minimumDuration: 30,
      maximumDuration: 120,
      proficiencyLevel: specialization.proficiency_level as any,
      yearsExperience: specialization.years_experience,
      description: specialization.description,
      certifications: specialization.certifications,
      isPrimaryService: specialization.is_primary_service,
    });
  };

  const handleDelete = async (specializationId: string) => {
    if (!confirm('Are you sure you want to remove this service specialization?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('expert_service_specializations')
        .delete()
        .eq('id', specializationId);

      if (error) throw error;

      toast.success('Service specialization removed');
      loadExpertSpecializations();
      onUpdate?.();
    } catch (error: any) {
      console.error('Error deleting specialization:', error);
      toast.error('Failed to remove service specialization');
    }
  };

  const toggleAvailability = async (specializationId: string, currentAvailability: boolean) => {
    try {
      const { error } = await supabase
        .from('expert_service_specializations')
        .update({ is_available: !currentAvailability })
        .eq('id', specializationId);

      if (error) throw error;

      toast.success(`Service ${!currentAvailability ? 'activated' : 'deactivated'}`);
      loadExpertSpecializations();
      onUpdate?.();
    } catch (error: any) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update service availability');
    }
  };

  const getAvailableServices = () => {
    const usedServiceIds = expertSpecializations.map(spec => spec.service_id);
    return services.filter(service => 
      !usedServiceIds.includes(service.id) || 
      (editingSpecialization && editingSpecialization.service_id === service.id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Current Services Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Your Service Specializations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expertSpecializations.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No services configured yet. Add your first service below.
            </p>
          ) : (
            <div className="grid gap-4">
              {expertSpecializations.map((specialization) => (
                <div key={specialization.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{specialization.service_name}</h3>
                        {specialization.is_primary_service && (
                          <Badge variant="default">Primary</Badge>
                        )}
                        <Badge 
                          variant={specialization.is_available ? "outline" : "secondary"}
                          className={specialization.is_available ? "border-green-500 text-green-700" : ""}
                        >
                          {specialization.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Proficiency:</span><br />
                          <span className="capitalize">{specialization.proficiency_level}</span>
                        </div>
                        <div>
                          <span className="font-medium">Experience:</span><br />
                          {specialization.years_experience} years
                        </div>
                        <div>
                          <span className="font-medium">Rate (USD):</span><br />
                          ${specialization.hourly_rate_usd || 'Not set'}/hour
                        </div>
                        <div>
                          <span className="font-medium">Rate (INR):</span><br />
                          ₹{specialization.hourly_rate_inr || 'Not set'}/hour
                        </div>
                      </div>

                      {specialization.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {specialization.description}
                        </p>
                      )}

                      {specialization.certifications.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-medium">Certifications:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {specialization.certifications.map((cert, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAvailability(specialization.id, specialization.is_available)}
                      >
                        {specialization.is_available ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(specialization)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(specialization.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Service Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingSpecialization ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {editingSpecialization ? 'Edit Service Specialization' : 'Add New Service Specialization'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Service Selection */}
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getAvailableServices().map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name}
                            {service.description && (
                              <span className="text-muted-foreground ml-2">
                                - {service.description.substring(0, 50)}...
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Proficiency and Experience */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="proficiencyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proficiency Level *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearsExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPrimaryService"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Primary Service</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Mark as your main expertise
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing */}
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="basePriceUSD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Rate (USD/hour) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="basePriceINR"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Rate (INR/hour) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2000"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="peakHourMultiplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peak Hour Multiplier</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="1.2"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceMultiplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Multiplier</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="1.0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount %</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Session Duration</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="minimumDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="30"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maximumDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="120"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Min - Max minutes</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your expertise in this service..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                {editingSpecialization && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingSpecialization(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingSpecialization ? 'Update Service' : 'Add Service'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicePricingManager;
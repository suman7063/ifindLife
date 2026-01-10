import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Service {
  id: string; // UUID
  name: string;
  description: string;
  category: string;
  rate_usd: number;
  rate_inr: number;
  duration: number;
}

interface ServiceSelectionStepProps {
  expertAccount: any;
  onComplete: () => void;
}

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  expertAccount,
  onComplete
}) => {
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailableServices();
  }, [expertAccount.category]);

  const fetchAvailableServices = async () => {
    try {
      console.log('🔍 Fetching services for expert:', expertAccount);
      
      // Check if services are already assigned by admin (Phase 2)
      const { data: adminAssignedServices, error: adminError } = await supabase
        .from('expert_services')
        .select('*')
        .eq('expert_id', expertAccount.auth_id)
        .eq('is_active', true);

      console.log('🔍 Admin assigned services:', adminAssignedServices, 'Error:', adminError);

      if (adminError) throw adminError;

      if (adminAssignedServices && adminAssignedServices.length > 0) {
        // Fetch the actual service details
        const serviceIds = adminAssignedServices.map(s => s.service_id);
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .in('id', serviceIds);

        if (servicesError) throw servicesError;

        // Admin has already assigned services - combine with rates
        const combinedServices = adminAssignedServices.map(assignedService => {
          const serviceDetails = servicesData?.find(s => String(s.id) === String(assignedService.service_id));
          return {
            id: String(assignedService.service_id),
            name: serviceDetails?.name || 'Unknown Service',
            description: serviceDetails?.description || '',
            category: serviceDetails?.category || '',
            rate_usd: assignedService.admin_assigned_rate_usd,
            rate_inr: assignedService.admin_assigned_rate_inr,
            duration: serviceDetails?.duration || 60
          };
        });
        setAvailableServices(combinedServices);
        setSelectedServices(combinedServices.map(s => String(s.id)));
      } else {
        // Fetch services mapped to this category from expert_category_services table
        console.log('🔍 Fetching services for category from expert_category_services:', expertAccount.category);
        
        const { data: categoryServicesData, error: categoryServicesError } = await supabase
          .from('expert_category_services')
          .select('service_id')
          .eq('category_id', expertAccount.category);

        if (categoryServicesError) {
          console.error('Error fetching category services:', categoryServicesError);
          throw categoryServicesError;
        }

        let serviceIds: string[] = [];
        
        if (categoryServicesData && categoryServicesData.length > 0) {
          // Use services mapped to the category
          serviceIds = categoryServicesData.map(item => String(item.service_id));
          console.log('🔍 Found mapped services for category:', serviceIds);
        } else {
          // Fallback: Fetch all services if no category mappings exist
          console.log('🔍 No category mappings found, fetching all services for category:', expertAccount.category);
          
          // Fetch all services as fallback
          const { data: allServices, error: allServicesError } = await supabase
            .from('services')
            .select('id')
            .order('name');
          
          if (allServicesError) {
            console.error('Error fetching all services:', allServicesError);
            throw allServicesError;
          }
          
          serviceIds = allServices?.map(s => s.id) || [];
          console.log('🔍 Using all available services as fallback:', serviceIds);
        }

        console.log('🔍 Service IDs for category:', serviceIds);

        const { data, error } = await supabase
          .from('services')
          .select('*')
          .in('id', serviceIds)
          .order('id');

        console.log('🔍 Services data:', data, 'Error:', error);

        if (error) throw error;

        // Ensure all service IDs are strings (UUIDs)
        const normalizedServices = (data || []).map(service => ({
          ...service,
          id: String(service.id)
        }));
        setAvailableServices(normalizedServices);

        // Check existing specializations
        console.log('🔍 Checking existing specializations for expert:', expertAccount.auth_id);
        const { data: existingServices, error: existingError } = await supabase
          .from('expert_service_specializations')
          .select('service_id')
          .eq('expert_id', expertAccount.auth_id);

        console.log('🔍 Existing specializations query result:', existingServices, 'Error:', existingError);

        if (existingError) {
          console.error('Error fetching existing specializations:', existingError);
          throw existingError;
        }

        const existing = existingServices?.map(s => String(s.service_id)) || [];
        console.log('🔍 Existing service IDs:', existing);
        setSelectedServices(existing);

        
        // Presence of existing services will be treated by parent for completion UI
      }

    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load available services');
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSaveServices = async () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    setSaving(true);
    try {
      console.log('💾 Saving services for expert:', expertAccount.auth_id, 'Selected services:', selectedServices);
      
      // Delete existing specializations
      console.log('🗑️ Deleting existing specializations...');
      const { error: deleteError } = await supabase
        .from('expert_service_specializations')
        .delete()
        .eq('expert_id', expertAccount.auth_id);

      if (deleteError) {
        console.error('Error deleting existing specializations:', deleteError);
        throw deleteError;
      }

      // Insert new specializations
      const specializations = selectedServices.map((serviceId, index) => ({
        expert_id: expertAccount.auth_id,
        service_id: String(serviceId), // Ensure it's a string UUID
        is_available: true,
        is_primary_service: index === 0, // First service is primary
        proficiency_level: expertAccount.category.includes('expert') ? 'expert' : 
                          expertAccount.category.includes('coach') ? 'advanced' : 'intermediate'
      }));

      console.log('💾 Specializations to insert:', specializations);

      if (specializations.length > 0) {
        const { error: insertError } = await supabase
          .from('expert_service_specializations')
          .insert(specializations);

        if (insertError) {
          console.error('Error inserting specializations:', insertError);
          throw insertError;
        }
      }

      // Services are saved in expert_service_specializations table - no need to update expert_accounts.selected_services
      // Check if all onboarding flags are satisfied
      const { data: specializationsCheck } = await supabase
        .from('expert_service_specializations')
        .select('id')
        .eq('expert_id', expertAccount.auth_id)
        .limit(1);

      const { data: eaFlags } = await supabase
        .from('expert_accounts')
        .select('pricing_set, availability_set, onboarding_completed')
        .eq('auth_id', expertAccount.auth_id)
        .single();

      const hasServices = (specializationsCheck?.length || 0) > 0;
      const hasPricing = !!eaFlags?.pricing_set;
      const hasAvailability = !!eaFlags?.availability_set;

      if (hasServices && hasPricing && hasAvailability && !eaFlags?.onboarding_completed) {
        console.log('🎉 All steps complete, marking expert_accounts.onboarding_completed = true');
        await supabase
          .from('expert_accounts')
          .update({ onboarding_completed: true })
          .eq('auth_id', expertAccount.auth_id);

        // Email notification is now automatically sent via Database Webhook (Supabase native)
        // When expert_accounts.onboarding_completed is set to true, the database trigger automatically calls
        // the send-expert-email-welcome-status Edge Function
        // No manual call needed - handled by Supabase Database Webhook
        
        /* Manual email call removed - now handled automatically by Database Webhook
        try {
          console.log('📧 Sending welcome email to expert:', expertAccount.email);
          const { error: emailError } = await supabase.functions.invoke('send-expert-email-welcome-status', {
            body: {
              expertName: expertAccount.name,
              expertEmail: expertAccount.email,
            },
          });

          if (emailError) {
            console.warn('⚠️ Failed to send welcome email (non-critical):', emailError);
          } else {
            console.log('✅ Welcome email sent successfully');
          }
        } catch (emailErr) {
          console.warn('⚠️ Error sending welcome email (non-critical):', emailErr);
        }
        */
      }

      console.log('✅ Services saved successfully');
      toast.success('Services saved successfully!');
      onComplete();

    } catch (error) {
      console.error('Error saving services:', error);
      toast.error('Failed to save services');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Select Your Services</h3>
        <div className="text-muted-foreground">
          Choose the services you want to offer based on your expert category: 
          <Badge variant="outline" className="ml-2">
            {expertAccount.category?.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {availableServices.map((service) => {
          const serviceId = String(service.id);
          const isSelected = selectedServices.includes(serviceId);
          return (
            <Card 
              key={serviceId}
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-primary bg-blue-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => toggleService(serviceId)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {isSelected ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                      <h4 className="font-semibold">{service.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {service.description}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Duration: {service.duration} minutes</span>
                      <span>Rate: ₹{service.rate_inr} / ${service.rate_usd}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Selected {selectedServices.length} of {availableServices.length} services
        </p>
        <Button 
          onClick={handleSaveServices}
          disabled={selectedServices.length === 0 || saving}
          className="px-8"
        >
          {saving ? 'Saving...' : 'Save Services'}
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;
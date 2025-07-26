import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Service {
  id: number;
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
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailableServices();
  }, [expertAccount.category]);

  const fetchAvailableServices = async () => {
    try {
      // Check if services are already assigned by admin (Phase 2)
      const { data: adminAssignedServices, error: adminError } = await supabase
        .from('expert_services')
        .select('*')
        .eq('expert_id', expertAccount.auth_id)
        .eq('is_active', true);

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
          const serviceDetails = servicesData?.find(s => s.id === assignedService.service_id);
          return {
            id: assignedService.service_id,
            name: serviceDetails?.name || 'Unknown Service',
            description: serviceDetails?.description || '',
            category: serviceDetails?.category || '',
            rate_usd: assignedService.admin_assigned_rate_usd,
            rate_inr: assignedService.admin_assigned_rate_inr,
            duration: serviceDetails?.duration || 60
          };
        });
        setAvailableServices(combinedServices);
        setSelectedServices(combinedServices.map(s => s.id));
      } else {
        // Fallback to old system if no admin assignment
        const categoryServices: Record<string, number[]> = {
          'listening-volunteer': [1, 2],
          'listening-expert': [1, 2, 3, 4],
          'listening-coach': [1, 2, 3, 4, 5],
          'mindfulness-expert': [6, 7, 8]
        };

        const serviceIds = categoryServices[expertAccount.category] || [1, 2, 3];

        const { data, error } = await supabase
          .from('services')
          .select('*')
          .in('id', serviceIds)
          .order('id');

        if (error) throw error;

        setAvailableServices(data || []);

        // Check existing specializations
        const { data: existingServices, error: existingError } = await supabase
          .from('expert_service_specializations')
          .select('service_id')
          .eq('expert_id', expertAccount.id);

        if (existingError) throw existingError;

        const existing = existingServices?.map(s => s.service_id) || [];
        setSelectedServices(existing);
      }

    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load available services');
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId: number) => {
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
      // Delete existing specializations
      await supabase
        .from('expert_service_specializations')
        .delete()
        .eq('expert_id', expertAccount.id);

      // Insert new specializations
      const specializations = selectedServices.map((serviceId, index) => ({
        expert_id: expertAccount.id,
        service_id: serviceId,
        is_available: true,
        is_primary_service: index === 0, // First service is primary
        proficiency_level: expertAccount.category.includes('expert') ? 'expert' : 
                          expertAccount.category.includes('coach') ? 'advanced' : 'intermediate'
      }));

      const { error } = await supabase
        .from('expert_service_specializations')
        .insert(specializations);

      if (error) throw error;

      // Update expert account to reflect service selection completion
      await supabase
        .from('expert_accounts')
        .update({ selected_services: selectedServices })
        .eq('id', expertAccount.id);

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
        <p className="text-muted-foreground">
          Choose the services you want to offer based on your expert category: 
          <Badge variant="outline" className="ml-2">
            {expertAccount.category?.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Badge>
        </p>
      </div>

      <div className="grid gap-4">
        {availableServices.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          return (
            <Card 
              key={service.id}
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-primary bg-blue-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => toggleService(service.id)}
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
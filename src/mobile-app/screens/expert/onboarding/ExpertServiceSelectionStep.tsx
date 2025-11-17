import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface ExpertServiceSelectionStepProps {
  onNext: () => void;
}

export const ExpertServiceSelectionStep: React.FC<ExpertServiceSelectionStepProps> = ({
  onNext
}) => {
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [expertCategory, setExpertCategory] = useState<string>('');
  const [categoryInfo, setCategoryInfo] = useState<{ name: string; description: string | null } | null>(null);
  const [pricing, setPricing] = useState<{ duration_minutes: number; price_inr: number; price_eur: number }[]>([]);

  useEffect(() => {
    fetchExpertDataAndServices();
  }, []);

  const fetchExpertDataAndServices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // If not authenticated, use mock data for preview
      if (!user) {
        setExpertCategory('listening-volunteer');
        setCategoryInfo({
          name: 'Listening Volunteer',
          description: 'Provide compassionate listening and emotional support to those in need'
        });
        setPricing([
          { duration_minutes: 30, price_inr: 0, price_eur: 0 },
          { duration_minutes: 60, price_inr: 0, price_eur: 0 }
        ]);
        setAvailableServices([
          {
            id: 1,
            name: 'Active Listening Support',
            description: 'Provide empathetic listening and emotional support',
            category: 'listening-volunteer'
          },
          {
            id: 2,
            name: 'Peer Support Sessions',
            description: 'One-on-one supportive conversations',
            category: 'listening-volunteer'
          },
          {
            id: 3,
            name: 'Wellness Check-ins',
            description: 'Regular check-ins to support mental wellness',
            category: 'listening-volunteer'
          },
          {
            id: 4,
            name: 'Crisis Support',
            description: 'Support during difficult times',
            category: 'listening-volunteer'
          }
        ]);
        setLoading(false);
        return;
      }

      // Fetch expert account to get category
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('category, id, auth_id')
        .eq('auth_id', user.id)
        .single();

      if (expertError) throw expertError;
      if (!expertData?.category) throw new Error('Expert category not found');

      setExpertCategory(expertData.category);

      // Fetch category information and pricing
      const { data: categoryData, error: categoryInfoError } = await supabase
        .from('expert_categories')
        .select('name, description')
        .eq('id', expertData.category)
        .single();

      if (!categoryInfoError && categoryData) {
        setCategoryInfo(categoryData);
      }

      // Fetch pricing for this category
      const { data: pricingData, error: pricingError } = await supabase
        .from('expert_category_duration_pricing')
        .select('duration_minutes, price_inr, price_eur')
        .eq('category_id', expertData.category)
        .order('duration_minutes');

      if (!pricingError && pricingData) {
        setPricing(pricingData);
      }

      // Check if services are already assigned by admin
      const { data: adminAssignedServices, error: adminError } = await supabase
        .from('expert_services')
        .select('service_id')
        .eq('expert_id', expertData.id)
        .eq('is_active', true);

      if (adminError) throw adminError;

      let serviceIds: number[] = [];

      if (adminAssignedServices && adminAssignedServices.length > 0) {
        // Admin has assigned specific services
        serviceIds = adminAssignedServices.map(s => s.service_id);
      } else {
        // Fetch services based on category from expert_category_services
        const { data: categoryData, error: categoryError } = await supabase
          .from('expert_categories')
          .select('id')
          .eq('id', expertData.category)
          .single();

        if (categoryError) throw categoryError;

        const { data: categoryServices, error: categoryServicesError } = await supabase
          .from('expert_category_services')
          .select('service_id')
          .eq('category_id', categoryData.id);

        if (categoryServicesError) throw categoryServicesError;

        serviceIds = categoryServices?.map(s => s.service_id) || [];
      }

      if (serviceIds.length === 0) {
        toast.error('No services available for your category');
        setLoading(false);
        return;
      }

      // Fetch service details
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, name, description, category')
        .in('id', serviceIds)
        .order('name');

      if (servicesError) throw servicesError;

      setAvailableServices(servicesData || []);

      // Check existing specializations
      const { data: existingServices, error: existingError } = await supabase
        .from('expert_service_specializations')
        .select('service_id')
        .eq('expert_id', expertData.id);

      if (!existingError && existingServices) {
        setSelectedServices(existingServices.map(s => s.service_id));
      }

    } catch (error) {
      console.error('Error fetching services:', error);
      // Use mock data on error for preview
      setExpertCategory('listening-volunteer');
      setAvailableServices([
        {
          id: 1,
          name: 'Active Listening Support',
          description: 'Provide empathetic listening and emotional support',
          category: 'listening-volunteer'
        },
        {
          id: 2,
          name: 'Peer Support Sessions',
          description: 'One-on-one supportive conversations',
          category: 'listening-volunteer'
        },
        {
          id: 3,
          name: 'Wellness Check-ins',
          description: 'Regular check-ins to support mental wellness',
          category: 'listening-volunteer'
        }
      ]);
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

  const handleContinue = () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }
    toast.success(`${selectedServices.length} service(s) selected`);
    onNext();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Select Your Services
        </h1>
        <p className="text-muted-foreground">
          Choose the services you'll offer to clients. You can update these later.
        </p>
      </div>

      {/* Category and Pricing Card */}
      {categoryInfo && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{categoryInfo.name}</h2>
              {categoryInfo.description && (
                <p className="text-sm text-muted-foreground mt-1">{categoryInfo.description}</p>
              )}
            </div>
            
            {pricing.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Session Rates:</p>
                <div className="grid grid-cols-2 gap-3">
                  {pricing.map((rate) => (
                    <div key={rate.duration_minutes} className="bg-background rounded-lg p-3 border">
                      <p className="text-xs text-muted-foreground mb-1">{rate.duration_minutes} min session</p>
                      <p className="font-semibold text-foreground">₹{rate.price_inr}</p>
                      <p className="text-xs text-muted-foreground">€{rate.price_eur}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Services List */}
      <div className="space-y-3">
        {availableServices.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          return (
            <Card
              key={service.id}
              className={`p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => toggleService(service.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground/30'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            {selectedServices.length} service(s) selected
          </span>
        </div>
        <Button
          onClick={handleContinue}
          disabled={selectedServices.length === 0}
          className="w-full"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

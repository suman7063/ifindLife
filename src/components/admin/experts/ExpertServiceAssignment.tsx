import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Save, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Service {
  id: string; // UUID
  name: string;
  description: string;
  category: string;
  rate_usd: number;
  rate_inr: number;
  duration: number;
}

interface ExpertService {
  id: string;
  service_id: string; // UUID
  admin_assigned_rate_usd: number;
  admin_assigned_rate_inr: number;
  is_active: boolean;
  service?: Service | null;
}

interface ExpertServiceAssignmentProps {
  expertId: string;
  expertName: string;
  expertCategory: string;
  onBack: () => void;
}

const ExpertServiceAssignment: React.FC<ExpertServiceAssignmentProps> = ({
  expertId,
  expertName,
  expertCategory,
  onBack
}) => {
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [expertServices, setExpertServices] = useState<ExpertService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [expertId, expertCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch available services for the expert's category
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('category', expertCategory);

      if (servicesError) throw servicesError;

      // Fetch existing expert services (simplified approach)
      const { data: expertServiceData, error: expertError } = await supabase
        .from('admin_expert_service_assignments')
        .select('*')
        .eq('expert_id', expertId);

      if (expertError) throw expertError;

      // Convert service ids from number to string (UUID) if needed
      const convertedServices = (services || []).map(service => ({
        ...service,
        id: String(service.id)
      }));
      setAvailableServices(convertedServices);
      
      // Map existing expert services and populate with service details
      const transformedExpertServices = (expertServiceData || []).map(item => {
        const service = convertedServices?.find(s => s.id === String(item.service_id));
        return {
          id: item.id,
          service_id: String(item.service_id), // Convert to string
          admin_assigned_rate_usd: item.admin_assigned_rate_usd,
          admin_assigned_rate_inr: item.admin_assigned_rate_inr,
          is_active: item.is_active,
          service
        };
      });
      setExpertServices(transformedExpertServices);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load services data');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      // Add service with default rates
      const service = availableServices.find(s => s.id === serviceId);
      if (service) {
        const newExpertService: ExpertService = {
          id: '', // Will be generated on save
          service_id: serviceId,
          admin_assigned_rate_usd: service.rate_usd,
          admin_assigned_rate_inr: service.rate_inr,
          is_active: true,
          service
        };
        setExpertServices(prev => [...prev, newExpertService]);
      }
    } else {
      // Remove service
      setExpertServices(prev => prev.filter(es => es.service_id !== serviceId));
    }
  };

  const handleRateChange = (serviceId: string, currency: 'usd' | 'inr', value: number) => {
    setExpertServices(prev => prev.map(es => {
      if (es.service_id === serviceId) {
        return {
          ...es,
          [`admin_assigned_rate_${currency}`]: value
        };
      }
      return es;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Delete existing assignments
      await supabase
        .from('admin_expert_service_assignments')
        .delete()
        .eq('expert_id', expertId);

      // Insert new assignments
      if (expertServices.length > 0) {
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        
        const servicesToInsert = expertServices.map(es => ({
          expert_id: expertId,
          service_id: es.service_id,
          admin_assigned_rate_usd: es.admin_assigned_rate_usd,
          admin_assigned_rate_inr: es.admin_assigned_rate_inr,
          is_active: es.is_active,
          assigned_by: userData.user?.id
        }));

        const { error } = await supabase
          .from('admin_expert_service_assignments')
          .insert(servicesToInsert);

        if (error) throw error;
      }

      // Update expert_accounts flags
      // Note: selected_services is INTEGER[] but services use UUID, so we don't update it
      // Services are stored in admin_expert_service_assignments table instead
      const { error: eaUpdateError } = await supabase
        .from('expert_accounts')
        .update({ 
          pricing_set: true
        })
        .eq('auth_id', expertId);

      if (eaUpdateError) throw eaUpdateError;

      // If all flags satisfied, mark onboarding_completed on expert_accounts
      // Check services from admin_expert_service_assignments table (admin assigned) or expert_service_specializations
      const { data: servicesCheck } = await supabase
        .from('admin_expert_service_assignments')
        .select('id')
        .eq('expert_id', expertId)
        .limit(1);
      
      // Also check expert_service_specializations as fallback
      const { data: specializationsCheck } = await supabase
        .from('expert_service_specializations')
        .select('id')
        .eq('expert_id', expertId)
        .limit(1);
      
      const hasServices = (servicesCheck?.length || 0) > 0 || (specializationsCheck?.length || 0) > 0;
      
      const { data: eaFlags } = await supabase
        .from('expert_accounts')
        .select('pricing_set, availability_set, onboarding_completed')
        .eq('auth_id', expertId)
        .single();
      
      const hasPricing = !!eaFlags?.pricing_set;
      const hasAvailability = !!eaFlags?.availability_set;

      if (hasServices && hasPricing && hasAvailability && !eaFlags?.onboarding_completed) {
        await supabase
          .from('expert_accounts')
          .update({ onboarding_completed: true })
          .eq('auth_id', expertId);
      }

      toast.success('Services and pricing assigned successfully!');
      onBack();
    } catch (error) {
      console.error('Error saving services:', error);
      toast.error('Failed to save service assignments');
    } finally {
      setSaving(false);
    }
  };

  const isServiceSelected = (serviceId: string) => {
    return expertServices.some(es => es.service_id === serviceId);
  };

  const getServiceRates = (serviceId: string) => {
    const expertService = expertServices.find(es => es.service_id === serviceId);
    return expertService ? {
      usd: expertService.admin_assigned_rate_usd,
      inr: expertService.admin_assigned_rate_inr
    } : { usd: 0, inr: 0 };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        <CardTitle>Assign Services & Set Pricing</CardTitle>
        <CardDescription>
          Assign services to {expertName} and set their consultation rates for {expertCategory} category
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {availableServices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No services available for {expertCategory} category</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {availableServices.map((service) => {
                const isSelected = isServiceSelected(service.id);
                const rates = getServiceRates(service.id);

                return (
                  <Card key={service.id} className={`border ${isSelected ? 'border-primary' : 'border-border'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                        />
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label htmlFor={`service-${service.id}`} className="text-base font-medium cursor-pointer">
                              {service.name}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                            <p className="text-sm text-muted-foreground">Duration: {service.duration} minutes</p>
                          </div>

                          {isSelected && (
                            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                              <div>
                                <Label className="text-sm font-medium">Rate (USD)</Label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={rates.usd}
                                    onChange={(e) => handleRateChange(service.id, 'usd', parseFloat(e.target.value) || 0)}
                                    className="pl-10"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Rate (INR)</Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={rates.inr}
                                    onChange={(e) => handleRateChange(service.id, 'inr', parseFloat(e.target.value) || 0)}
                                    className="pl-10"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSave} 
                disabled={saving || expertServices.length === 0}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Services & Pricing'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpertServiceAssignment;
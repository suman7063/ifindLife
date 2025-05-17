
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AlertCircle, Check, DollarSign } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Service {
  id: number;
  name: string;
  description: string | null;
  rate_usd: number;
  rate_inr: number;
  selected?: boolean;
}

const ServicesPage = () => {
  const { expertProfile, updateExpertProfile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (expertProfile?.selected_services) {
      setSelectedServices(expertProfile.selected_services as number[]);
    }
  }, [expertProfile]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('rate_usd', { ascending: false });
        
      if (error) throw error;
      
      const servicesWithSelection = data.map(service => ({
        ...service,
        selected: expertProfile?.selected_services?.includes(service.id) || false
      }));
      
      setServices(servicesWithSelection);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleSaveServices = async () => {
    if (!expertProfile || !updateExpertProfile) return;
    
    setIsSaving(true);
    try {
      await updateExpertProfile({ selected_services: selectedServices });
      
      // Update local services state
      const updatedServices = services.map(service => ({
        ...service,
        selected: selectedServices.includes(service.id)
      }));
      
      setServices(updatedServices);
      toast.success('Services updated successfully');
    } catch (error) {
      console.error('Error updating services:', error);
      toast.error('Failed to update services');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Service Offerings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Services</CardTitle>
          <CardDescription>
            Select the services you'd like to offer to clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Service rates are set by administrators. If you have questions about rates, please contact support.
            </AlertDescription>
          </Alert>
          
          {isLoading ? (
            <div className="text-center py-8">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card key={service.id} className={`border-2 ${
                  selectedServices.includes(service.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-lg font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>${service.rate_usd.toFixed(2)}</span>
                      <span className="ml-1 text-xs text-muted-foreground">per min</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-1 pb-3">
                    <Label 
                      htmlFor={`service-${service.id}`}
                      className="flex items-center text-sm cursor-pointer"
                    >
                      {selectedServices.includes(service.id) ? (
                        <div className="flex items-center text-primary">
                          <Check className="h-3.5 w-3.5 mr-1" />
                          <span>Selected</span>
                        </div>
                      ) : (
                        <span>Select service</span>
                      )}
                    </Label>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button 
            onClick={handleSaveServices}
            disabled={isSaving || isLoading}
            className="ml-auto"
          >
            {isSaving ? 'Updating...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServicesPage;

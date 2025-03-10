
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ExpertFormData, ServiceType } from './types';

interface ServiceSelectionStepProps {
  formData: ExpertFormData;
  services: ServiceType[];
  handleCheckboxChange: (serviceId: number) => void;
  setFormData: React.Dispatch<React.SetStateAction<ExpertFormData>>;
}

const ServiceSelectionStep = ({ 
  formData, 
  services, 
  handleCheckboxChange, 
  setFormData
}: ServiceSelectionStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Services Offered</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Select the services you would like to offer. Rates are pre-defined by the admin.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card key={service.id} className={`overflow-hidden transition-all border-2 ${
            formData.selectedServices.includes(service.id) ? 'border-astro-purple' : 'border-transparent'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={formData.selectedServices.includes(service.id)}
                      onCheckedChange={() => handleCheckboxChange(service.id)}
                    />
                    <label
                      htmlFor={`service-${service.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {service.name}
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {service.description}
                  </p>
                  <div className="mt-2 flex justify-between text-xs font-medium">
                    <span>${service.rateUSD}/hour</span>
                    <span>₹{service.rateINR}/hour</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex items-start space-x-3 pt-4">
        <Checkbox
          id="terms"
          checked={formData.acceptedTerms}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, acceptedTerms: checked as boolean }))
          }
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
          <p className="text-xs text-muted-foreground">
            By submitting this form, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;

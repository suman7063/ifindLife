
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ServiceType, ExpertFormData } from './types';
import { FormItem, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ServiceSelectionStepProps {
  formData: ExpertFormData;
  services: ServiceType[];
  handleCheckboxChange: (serviceId: number, checked: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<ExpertFormData>>;
  errors: Record<string, string>;
}

const ServiceSelectionStep = ({
  formData,
  services,
  handleCheckboxChange,
  setFormData,
  errors
}: ServiceSelectionStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Service Selection</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Select the services you want to offer to clients <span className="text-destructive">*</span>
      </p>
      
      {errors.selectedServices && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{errors.selectedServices}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-start space-x-3 p-3 rounded-md bg-muted/50 border"
          >
            <Checkbox
              id={`service-${service.id}`}
              checked={formData.selectedServices.includes(service.id)}
              onCheckedChange={(checked) => handleCheckboxChange(service.id, checked as boolean)}
              className={errors.selectedServices ? "border-destructive data-[state=checked]:bg-destructive" : ""}
            />
            <div className="space-y-1">
              <Label htmlFor={`service-${service.id}`} className="font-medium">
                {service.name}
              </Label>
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <div className="flex space-x-4 text-sm">
                <span>USD: ${service.rateUSD}</span>
                <span>INR: ₹{service.rateINR}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelectionStep;

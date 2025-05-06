
import React from 'react';
import { ServiceType, ExpertFormData } from './types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, Info, AlertCircle, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceSelectionStepProps {
  formData: ExpertFormData;
  services: ServiceType[];
  handleCheckboxChange: (serviceId: number, checked: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<ExpertFormData>>;
  errors: Record<string, string>;
  touched?: Record<string, boolean>;
  handleAcceptTerms: (checked: boolean) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  prevStep: () => void;
}

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  formData,
  services,
  handleCheckboxChange,
  setFormData,
  errors,
  touched = {},
  handleAcceptTerms,
  isSubmitting,
  onSubmit,
  prevStep
}) => {
  const isFieldInvalid = (fieldName: string): boolean => {
    return touched[fieldName] === true && !!errors[fieldName];
  };

  if (services.length === 0) {
    return (
      <div className="space-y-4">
        <Alert className="bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 mr-2 text-amber-500" />
          <AlertDescription>
            Loading available services... This might take a few moments.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-between pt-10 pb-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
          >
            Previous
          </Button>
          <Button
            type="submit"
            disabled={true}
          >
            Complete Registration
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-2">Select Your Services</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((service) => (
            <Card key={service.id} className={formData.selectedServices.includes(service.id) 
              ? "border-green-300 bg-green-50" 
              : "border-gray-200 bg-white"
            }>
              <CardContent className="p-4 flex items-start space-x-2">
                <Checkbox 
                  id={`service-${service.id}`}
                  checked={formData.selectedServices.includes(service.id)}
                  onCheckedChange={(checked) => handleCheckboxChange(service.id, Boolean(checked))}
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor={`service-${service.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {service.name}
                  </Label>
                  {service.description && (
                    <p className="text-xs text-gray-500">{service.description}</p>
                  )}
                </div>
                
                {formData.selectedServices.includes(service.id) && (
                  <Check className="h-4 w-4 text-green-500 ml-auto" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {isFieldInvalid('selectedServices') && (
          <FormMessage>{errors.selectedServices}</FormMessage>
        )}
        
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 mr-2 text-blue-500" />
          <AlertDescription>
            Select the services you would like to offer. You can always update these later from your expert dashboard.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="space-y-4 mt-8 pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="acceptedTerms" 
            name="acceptedTerms"
            checked={formData.acceptedTerms}
            onCheckedChange={(checked) => {
              handleAcceptTerms(checked as boolean);
            }}
            className={isFieldInvalid('acceptedTerms') ? "border-destructive data-[state=checked]:bg-destructive" : ""}
          />
          <div>
            <Label 
              htmlFor="acceptedTerms"
              className={isFieldInvalid('acceptedTerms') ? "text-destructive" : ""}
            >
              I accept the terms and conditions <span className="text-destructive">*</span>
            </Label>
            
            <p className="text-xs text-gray-500 mt-1">
              By signing up, you agree to our Terms of Service and Privacy Policy. 
              Your information will be used in accordance with our privacy practices.
            </p>
            
            {isFieldInvalid('acceptedTerms') && (
              <FormMessage>{errors.acceptedTerms}</FormMessage>
            )}
          </div>
        </div>
        
        <Alert className="bg-gray-100 border-gray-200">
          <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
          <AlertDescription>
            By submitting this form, you acknowledge that your application will be reviewed by our administrators.
            You will receive an email notification once your application has been processed.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="flex justify-between mt-6 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={isSubmitting}
        >
          Previous
        </Button>
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-ifind-aqua hover:bg-ifind-teal transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Complete Registration'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;

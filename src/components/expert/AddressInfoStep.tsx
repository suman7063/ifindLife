
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Building, Globe } from 'lucide-react';
import { ExpertFormData } from './types';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface AddressInfoStepProps {
  formData: ExpertFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
  errors: Record<string, string>;
}

const AddressInfoStep = ({ 
  formData, 
  handleChange, 
  nextStep, 
  prevStep,
  errors
}: AddressInfoStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Address Information</h2>
      
      <FormItem className="space-y-2">
        <FormLabel htmlFor="address" className={errors.address ? "text-destructive" : ""}>
          Street Address <span className="text-destructive">*</span>
        </FormLabel>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className={`h-4 w-4 ${errors.address ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St"
            className={`pl-10 ${errors.address ? "border-destructive focus-visible:ring-destructive" : ""}`}
            required
          />
        </div>
        {errors.address && (
          <FormMessage>{errors.address}</FormMessage>
        )}
      </FormItem>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem className="space-y-2">
          <FormLabel htmlFor="city" className={errors.city ? "text-destructive" : ""}>
            City <span className="text-destructive">*</span>
          </FormLabel>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className={`h-4 w-4 ${errors.city ? "text-destructive" : "text-muted-foreground"}`} />
            </div>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Mumbai"
              className={`pl-10 ${errors.city ? "border-destructive focus-visible:ring-destructive" : ""}`}
              required
            />
          </div>
          {errors.city && (
            <FormMessage>{errors.city}</FormMessage>
          )}
        </FormItem>
        
        <FormItem className="space-y-2">
          <FormLabel htmlFor="state" className={errors.state ? "text-destructive" : ""}>
            State/Province <span className="text-destructive">*</span>
          </FormLabel>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Maharashtra"
            className={errors.state ? "border-destructive focus-visible:ring-destructive" : ""}
            required
          />
          {errors.state && (
            <FormMessage>{errors.state}</FormMessage>
          )}
        </FormItem>
      </div>
      
      <FormItem className="space-y-2">
        <FormLabel htmlFor="country" className={errors.country ? "text-destructive" : ""}>
          Country <span className="text-destructive">*</span>
        </FormLabel>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className={`h-4 w-4 ${errors.country ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="India"
            className={`pl-10 ${errors.country ? "border-destructive focus-visible:ring-destructive" : ""}`}
            required
          />
        </div>
        {errors.country && (
          <FormMessage>{errors.country}</FormMessage>
        )}
      </FormItem>
      
      <div className="flex justify-between">
        <Button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          className="bg-ifind-aqua hover:bg-ifind-teal transition-colors"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AddressInfoStep;

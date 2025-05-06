
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormItem, FormMessage } from '@/components/ui/form';
import { ExpertFormData } from './types';

interface AddressInfoStepProps {
  formData: ExpertFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
  errors: Record<string, string>;
  touched?: Record<string, boolean>;
}

const AddressInfoStep = ({
  formData,
  handleChange,
  handleBlur,
  nextStep,
  prevStep,
  errors,
  touched = {}
}: AddressInfoStepProps) => {
  const isFieldInvalid = (fieldName: string): boolean => {
    return touched[fieldName] === true && !!errors[fieldName];
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Address Information</h2>
      
      <FormItem className="space-y-2">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Street Address <span className="text-destructive">*</span>
        </label>
        <Input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          className={isFieldInvalid('address') ? "border-destructive" : ""}
          aria-invalid={isFieldInvalid('address')}
          aria-describedby={isFieldInvalid('address') ? "address-error" : undefined}
        />
        {isFieldInvalid('address') && (
          <FormMessage id="address-error">{errors.address}</FormMessage>
        )}
      </FormItem>
      
      <FormItem className="space-y-2">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City <span className="text-destructive">*</span>
        </label>
        <Input
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          onBlur={handleBlur}
          className={isFieldInvalid('city') ? "border-destructive" : ""}
          aria-invalid={isFieldInvalid('city')}
          aria-describedby={isFieldInvalid('city') ? "city-error" : undefined}
        />
        {isFieldInvalid('city') && (
          <FormMessage id="city-error">{errors.city}</FormMessage>
        )}
      </FormItem>
      
      <FormItem className="space-y-2">
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State/Province <span className="text-destructive">*</span>
        </label>
        <Input
          id="state"
          name="state"
          type="text"
          value={formData.state}
          onChange={handleChange}
          onBlur={handleBlur}
          className={isFieldInvalid('state') ? "border-destructive" : ""}
          aria-invalid={isFieldInvalid('state')}
          aria-describedby={isFieldInvalid('state') ? "state-error" : undefined}
        />
        {isFieldInvalid('state') && (
          <FormMessage id="state-error">{errors.state}</FormMessage>
        )}
      </FormItem>
      
      <FormItem className="space-y-2">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country <span className="text-destructive">*</span>
        </label>
        <Input
          id="country"
          name="country"
          type="text"
          value={formData.country}
          onChange={handleChange}
          onBlur={handleBlur}
          className={isFieldInvalid('country') ? "border-destructive" : ""}
          aria-invalid={isFieldInvalid('country')}
          aria-describedby={isFieldInvalid('country') ? "country-error" : undefined}
        />
        {isFieldInvalid('country') && (
          <FormMessage id="country-error">{errors.country}</FormMessage>
        )}
      </FormItem>
      
      <div className="flex justify-between pt-10 pb-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={nextStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AddressInfoStep;

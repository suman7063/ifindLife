
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { FormItem, FormMessage } from '@/components/ui/form';
import { ExpertFormData } from './types';

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
  const formContext = useFormContext();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Address Information</h2>
      
      <div className="space-y-4">
        <FormItem className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address <span className="text-destructive">*</span>
          </label>
          <Input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? "border-destructive" : ""}
          />
          {errors.address && <FormMessage>{errors.address}</FormMessage>}
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
            className={errors.city ? "border-destructive" : ""}
          />
          {errors.city && <FormMessage>{errors.city}</FormMessage>}
        </FormItem>
        
        <FormItem className="space-y-2">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State <span className="text-destructive">*</span>
          </label>
          <Input
            id="state"
            name="state"
            type="text"
            value={formData.state}
            onChange={handleChange}
            className={errors.state ? "border-destructive" : ""}
          />
          {errors.state && <FormMessage>{errors.state}</FormMessage>}
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
            className={errors.country ? "border-destructive" : ""}
          />
          {errors.country && <FormMessage>{errors.country}</FormMessage>}
        </FormItem>
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ifind-aqua hover:bg-ifind-teal transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AddressInfoStep;

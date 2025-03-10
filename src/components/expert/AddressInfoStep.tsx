
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';
import { ExpertFormData } from './types';

interface AddressInfoStepProps {
  formData: ExpertFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const AddressInfoStep = ({ formData, handleChange, nextStep, prevStep }: AddressInfoStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Address Information</h2>
      
      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">Street Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main Street"
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">City</label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Mumbai"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">State/Province</label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Maharashtra"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="country" className="text-sm font-medium">Country</label>
        <Input
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="India"
          required
        />
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          onClick={prevStep}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          className="bg-astro-purple hover:bg-astro-violet"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AddressInfoStep;

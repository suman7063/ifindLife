
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from 'lucide-react';
import { FormItem, FormMessage } from '@/components/ui/form';
import { ExpertFormData } from './types';

interface PersonalInfoStepProps {
  formData: ExpertFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
  errors: Record<string, string>;
}

const PersonalInfoStep = ({
  formData,
  handleChange,
  nextStep,
  errors
}: PersonalInfoStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const formContext = useFormContext();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
      
      <div className="space-y-4">
        <FormItem className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <FormMessage>{errors.name}</FormMessage>}
        </FormItem>
        
        <FormItem className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address <span className="text-destructive">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <FormMessage>{errors.email}</FormMessage>}
        </FormItem>
        
        <FormItem className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <FormMessage>{errors.phone}</FormMessage>}
        </FormItem>
        
        <FormItem className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "border-destructive" : ""}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.password && <FormMessage>{errors.password}</FormMessage>}
        </FormItem>
        
        <FormItem className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "border-destructive" : ""}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.confirmPassword && <FormMessage>{errors.confirmPassword}</FormMessage>}
        </FormItem>
      </div>
      
      <div className="pt-4">
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

export default PersonalInfoStep;

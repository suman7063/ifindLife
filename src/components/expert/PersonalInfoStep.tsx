
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormItem, FormMessage } from '@/components/ui/form';
import { AlertCircle } from 'lucide-react';
import { ExpertFormData } from './types';

interface PersonalInfoStepProps {
  formData: ExpertFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  errors: Record<string, string>;
  touched?: Record<string, boolean>;
}

const PersonalInfoStep = ({
  formData,
  handleChange,
  handleBlur,
  nextStep,
  errors,
  touched = {}
}: PersonalInfoStepProps) => {
  const isFieldInvalid = (fieldName: string): boolean => {
    return touched[fieldName] === true && !!errors[fieldName];
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
      
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
          onBlur={handleBlur}
          className={isFieldInvalid('name') ? "border-destructive" : ""}
          aria-invalid={isFieldInvalid('name')}
          aria-describedby={isFieldInvalid('name') ? "name-error" : undefined}
        />
        {isFieldInvalid('name') && (
          <FormMessage id="name-error">{errors.name}</FormMessage>
        )}
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
          onBlur={handleBlur}
          className={isFieldInvalid('email') ? "border-destructive" : ""}
          aria-invalid={isFieldInvalid('email')}
          aria-describedby={isFieldInvalid('email') ? "email-error" : undefined}
        />
        {isFieldInvalid('email') && (
          <FormMessage id="email-error">{errors.email}</FormMessage>
        )}
        <p className="text-xs text-gray-500 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          This will be used as your login email
        </p>
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
          onBlur={handleBlur}
          placeholder="+1 (555) 123-4567"
          className={isFieldInvalid('phone') ? "border-destructive" : ""}
          aria-invalid={isFieldInvalid('phone')}
          aria-describedby={isFieldInvalid('phone') ? "phone-error" : undefined}
        />
        {isFieldInvalid('phone') && (
          <FormMessage id="phone-error">{errors.phone}</FormMessage>
        )}
      </FormItem>
      
      <FormItem className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password <span className="text-destructive">*</span>
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={isFieldInvalid('password') ? "border-destructive" : ""}
          aria-invalid={isFieldInvalid('password')}
          aria-describedby={isFieldInvalid('password') ? "password-error" : undefined}
        />
        {isFieldInvalid('password') && (
          <FormMessage id="password-error">{errors.password}</FormMessage>
        )}
      </FormItem>
      
      <FormItem className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password <span className="text-destructive">*</span>
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className={isFieldInvalid('confirmPassword') ? "border-destructive" : ""}
          aria-invalid={isFieldInvalid('confirmPassword')}
          aria-describedby={isFieldInvalid('confirmPassword') ? "confirmPassword-error" : undefined}
        />
        {isFieldInvalid('confirmPassword') && (
          <FormMessage id="confirmPassword-error">{errors.confirmPassword}</FormMessage>
        )}
      </FormItem>
      
      <div className="flex justify-end pt-6">
        <Button
          type="button"
          onClick={nextStep}
          className="px-4 py-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;

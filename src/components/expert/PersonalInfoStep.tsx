
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, AlertCircle } from 'lucide-react';
import { ExpertFormData } from './types';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface PersonalInfoStepProps {
  formData: ExpertFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
  errors: Record<string, string>;
}

const PersonalInfoStep = ({ formData, handleChange, nextStep, errors }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Personal Information</h2>
      
      <FormItem className="space-y-2">
        <FormLabel htmlFor="name" className={errors.name ? "text-destructive" : ""}>
          Full Name <span className="text-destructive">*</span>
        </FormLabel>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className={`h-4 w-4 ${errors.name ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Dr. Jane Smith"
            className={`pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
            required
          />
        </div>
        {errors.name && (
          <FormMessage>{errors.name}</FormMessage>
        )}
      </FormItem>
      
      <FormItem className="space-y-2">
        <FormLabel htmlFor="email" className={errors.email ? "text-destructive" : ""}>
          Email Address <span className="text-destructive">*</span>
        </FormLabel>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className={`h-4 w-4 ${errors.email ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`pl-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
            required
          />
        </div>
        {errors.email && (
          <FormMessage>{errors.email}</FormMessage>
        )}
      </FormItem>
      
      <FormItem className="space-y-2">
        <FormLabel htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
          Phone Number <span className="text-destructive">*</span>
        </FormLabel>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className={`h-4 w-4 ${errors.phone ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className={`pl-10 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
            required
          />
        </div>
        {errors.phone && (
          <FormMessage>{errors.phone}</FormMessage>
        )}
      </FormItem>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem className="space-y-2">
          <FormLabel htmlFor="password" className={errors.password ? "text-destructive" : ""}>
            Password <span className="text-destructive">*</span>
          </FormLabel>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
            required
          />
          {errors.password && (
            <FormMessage>{errors.password}</FormMessage>
          )}
        </FormItem>
        
        <FormItem className="space-y-2">
          <FormLabel htmlFor="confirmPassword" className={errors.confirmPassword ? "text-destructive" : ""}>
            Confirm Password <span className="text-destructive">*</span>
          </FormLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
            required
          />
          {errors.confirmPassword && (
            <FormMessage>{errors.confirmPassword}</FormMessage>
          )}
        </FormItem>
      </div>
      
      <div className="flex justify-end">
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

export default PersonalInfoStep;

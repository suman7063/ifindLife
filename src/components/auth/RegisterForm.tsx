
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ReferralSettings } from '@/types/supabase';
import UserInfoFields from './form/UserInfoFields';
import PasswordFields from './form/PasswordFields';
import ReferralCodeField from './form/ReferralCodeField';
import TermsCheckbox from './form/TermsCheckbox';
import CaptchaField from './form/CaptchaField';
import { validatePasswordStrength } from '@/utils/passwordValidation';

interface RegisterFormProps {
  onRegister: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city: string;
    referralCode?: string;
  }) => Promise<void>;
  loading: boolean;
  initialReferralCode?: string | null;
  referralSettings?: ReferralSettings | null;
  setCaptchaVerified?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  loading,
  initialReferralCode,
  referralSettings,
  setCaptchaVerified
}) => {
  const [showCityField, setShowCityField] = useState(false);

  // Create registration schema with zod
  const registerSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(7, { message: "Please enter a valid phone number" }),
    country: z.string().min(1, { message: "Please select your country" }),
    city: z.string().optional(),
    password: z.string().refine(
      (password) => validatePasswordStrength(password).isValid,
      { message: "Password must be at least 8 characters with a mix of letters, numbers, and symbols" }
    ),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
    terms: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms and conditions",
    }),
    captcha: z.string().min(1, { message: "Please verify that you are not a robot" }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  // Set up form with validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      password: "",
      confirmPassword: "",
      referralCode: initialReferralCode || "",
      terms: false,
      captcha: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    onRegister({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      country: data.country,
      city: data.city || "",
      referralCode: data.referralCode,
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <UserInfoFields 
          showCityField={showCityField} 
          setShowCityField={setShowCityField} 
        />
        
        <PasswordFields />
        
        <ReferralCodeField 
          initialReferralCode={initialReferralCode} 
          referralSettings={referralSettings} 
        />
        
        <TermsCheckbox />
        
        <CaptchaField name="captcha" />
        
        <Button 
          type="submit" 
          className="w-full bg-ifind-aqua hover:bg-ifind-teal transition-colors"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;

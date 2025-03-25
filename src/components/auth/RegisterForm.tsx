
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
import { registerFormSchema, RegisterFormValues } from './form/types';

interface RegisterFormProps {
  onRegister: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
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

  // Set up form with validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      password: "",
      confirmPassword: "",
      referralCode: initialReferralCode || "",
      termsAccepted: false,
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
          form={form}
        />
        
        <PasswordFields form={form} />
        
        <ReferralCodeField 
          initialReferralCode={initialReferralCode} 
          referralSettings={referralSettings}
          form={form}
        />
        
        <TermsCheckbox form={form} />
        
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

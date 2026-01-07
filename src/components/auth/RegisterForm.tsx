
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
import { validatePasswordStrength } from '@/utils/validationSchemas';
import { registerFormSchema, RegisterFormValues } from './form/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

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
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: RegisterFormValues) => {
    if (loading || isSubmitting) return;
    
    setFormError(null);
    setIsSubmitting(true);
    
    try {
      console.log("Attempting user registration with:", data.email);
      await onRegister({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        country: data.country,
        city: data.city || "",
        referralCode: data.referralCode,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formError && (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        
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
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Creating account...
            </>
          ) : 'Create Account'}
        </Button>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;

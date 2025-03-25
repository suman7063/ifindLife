
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ReferralSettings } from '@/types/supabase';

// Import form components
import UserInfoFields from './form/UserInfoFields';
import PasswordFields from './form/PasswordFields';
import ReferralCodeField from './form/ReferralCodeField';
import TermsCheckbox from './form/TermsCheckbox';
import { registerFormSchema, RegisterFormValues } from './form/types';

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
  referralSettings: ReferralSettings | null;
  setCaptchaVerified?: (verified: boolean) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onRegister, 
  loading, 
  initialReferralCode,
  referralSettings,
  setCaptchaVerified
}) => {
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Set up form with validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      referralCode: initialReferralCode || "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  useEffect(() => {
    if (initialReferralCode) {
      form.setValue("referralCode", initialReferralCode);
    }
  }, [initialReferralCode, form]);

  // Update password strength when password changes
  useEffect(() => {
    const password = form.watch("password");
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 1;
    
    // Number check
    if (/[0-9]/.test(password)) strength += 1;
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [form.watch("password")]);

  // Submit handler
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* User information fields */}
        <UserInfoFields form={form} />
        
        {/* Referral code field */}
        <ReferralCodeField form={form} referralSettings={referralSettings} />
        
        {/* Password fields */}
        <PasswordFields form={form} passwordStrength={passwordStrength} />
        
        {/* Terms checkbox */}
        <TermsCheckbox form={form} />
        
        <Alert className="bg-blue-50 text-blue-700 border-blue-200">
          <AlertDescription>
            By clicking "Create Account", you agree to receive a verification email to confirm your email address.
          </AlertDescription>
        </Alert>
        
        <Button 
          type="submit" 
          className="w-full bg-ifind-aqua hover:bg-ifind-teal transition-colors"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;

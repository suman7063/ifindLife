
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import RegisterForm from '@/components/auth/RegisterForm';
import { ReferralSettings } from '@/types/supabase';

interface RegisterTabProps {
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
  isRegistering: boolean;
  registerError: string | null;
  initialReferralCode: string | null;
  referralSettings: ReferralSettings | null;
  setCaptchaVerified: () => void;
}

const RegisterTab: React.FC<RegisterTabProps> = ({
  onRegister,
  loading,
  isRegistering,
  registerError,
  initialReferralCode,
  referralSettings,
  setCaptchaVerified
}) => {
  return (
    <div>
      {registerError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{registerError}</AlertDescription>
        </Alert>
      )}
    
      <RegisterForm 
        onRegister={onRegister} 
        loading={loading || isRegistering}
        initialReferralCode={initialReferralCode}
        referralSettings={referralSettings}
        setCaptchaVerified={setCaptchaVerified}
      />
    </div>
  );
};

export default RegisterTab;

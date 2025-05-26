
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { RegisterTabProps } from './register/types';
import { useRegistrationForm } from './register/useRegistrationForm';
import PersonalInfoFields from './register/PersonalInfoFields';
import PasswordFields from './register/PasswordFields';
import LocationFields from './register/LocationFields';
import ReferralCodeField from './register/ReferralCodeField';

const RegisterTab: React.FC<RegisterTabProps> = ({
  onRegister,
  loading = false,
  isRegistering = false,
  registerError = null,
  initialReferralCode = null,
  referralSettings = null,
  setCaptchaVerified = () => {},
  onSwitchToLogin
}) => {
  const { formData, updateField, handleSubmit } = useRegistrationForm(
    onRegister,
    initialReferralCode
  );
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };
  
  const isDisabled = loading || isRegistering;
  
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <PersonalInfoFields
        name={formData.name}
        email={formData.email}
        phone={formData.phone}
        onNameChange={(value) => updateField('name', value)}
        onEmailChange={(value) => updateField('email', value)}
        onPhoneChange={(value) => updateField('phone', value)}
        disabled={isDisabled}
      />
      
      <PasswordFields
        password={formData.password}
        confirmPassword={formData.confirmPassword}
        onPasswordChange={(value) => updateField('password', value)}
        onConfirmPasswordChange={(value) => updateField('confirmPassword', value)}
        disabled={isDisabled}
      />
      
      <LocationFields
        country={formData.country}
        city={formData.city}
        onCountryChange={(value) => updateField('country', value)}
        onCityChange={(value) => updateField('city', value)}
        disabled={isDisabled}
      />
      
      <ReferralCodeField
        referralCode={formData.referralCode}
        onReferralCodeChange={(value) => updateField('referralCode', value)}
        disabled={isDisabled}
        referralSettings={referralSettings}
      />
      
      {registerError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {registerError}
        </div>
      )}
      
      <Button
        type="submit"
        className="w-full"
        disabled={isDisabled}
      >
        {isRegistering ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : (
          'Register'
        )}
      </Button>
    </form>
  );
};

export default RegisterTab;

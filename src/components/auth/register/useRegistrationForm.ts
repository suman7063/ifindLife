
import { useState } from 'react';
import { toast } from 'sonner';
import { RegisterFormData, RegisterTabProps } from './types';
import { validateRegistrationForm } from './validation';

export const useRegistrationForm = (
  onRegister?: RegisterTabProps['onRegister'],
  initialReferralCode?: string | null
) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    referralCode: initialReferralCode || ''
  });

  const updateField = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      country: '',
      city: '',
      referralCode: ''
    });
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateRegistrationForm(formData)) {
      return;
    }

    if (onRegister) {
      try {
        const success = await onRegister({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          country: formData.country,
          city: formData.city || undefined,
          referralCode: formData.referralCode || undefined
        });
        
        if (success) {
          toast.success('Registration successful! Please log in.');
          resetForm();
        }
      } catch (error) {
        console.error('Registration error:', error);
        toast.error('Failed to register. Please try again.');
      }
    } else {
      console.log('Registration data:', formData);
      toast.info('Registration functionality not implemented yet');
    }
  };

  return {
    formData,
    updateField,
    handleSubmit,
    resetForm
  };
};

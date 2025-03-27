
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ExpertFormData, formDataToRegistrationData } from '../types';
import { useExpertAuth } from '@/hooks/useExpertAuth';
import { useExpertForm } from './useExpertForm';
import { fetchServices } from '../services/expertServicesService';
import { ServiceType } from '../types';

export const useExpertRegistration = () => {
  const navigate = useNavigate();
  const { register } = useExpertAuth();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const initialFormData: ExpertFormData = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    country: '',
    specialization: '',
    experience: '',
    certificates: [],
    certificateUrls: [],
    bio: '',
    selectedServices: [],
    acceptedTerms: false
  };
  
  const {
    formData,
    setFormData,
    handleChange,
    handleCheckboxChange,
    handleFileUpload,
    handleRemoveCertificate
  } = useExpertForm(initialFormData);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (error) {
        console.error('Error loading services:', error);
        toast.error('Failed to load services');
      }
    };
    
    loadServices();
  }, []);

  const validateField = (name: string, value: any): string => {
    switch(name) {
      case 'name':
        return !value ? 'Name is required' : '';
      case 'email':
        return !value ? 'Email is required' : 
               !/\S+@\S+\.\S+/.test(value) ? 'Email is invalid' : '';
      case 'phone':
        return !value ? 'Phone number is required' : '';
      case 'password':
        return !value ? 'Password is required' : 
               value.length < 8 ? 'Password must be at least 8 characters' : '';
      case 'confirmPassword':
        return !value ? 'Please confirm your password' : 
               value !== formData.password ? 'Passwords do not match' : '';
      case 'address':
        return !value && step >= 2 ? 'Address is required' : '';
      case 'city':
        return !value && step >= 2 ? 'City is required' : '';
      case 'state':
        return !value && step >= 2 ? 'State is required' : '';
      case 'country':
        return !value && step >= 2 ? 'Country is required' : '';
      case 'specialization':
        return !value && step >= 3 ? 'Specialization is required' : '';
      case 'experience':
        return !value && step >= 3 ? 'Experience information is required' : '';
      case 'bio':
        return !value && step >= 3 ? 'Bio is required' : '';
      case 'selectedServices':
        return (!value || value.length === 0) && step === 4 ? 'Please select at least one service' : '';
      case 'acceptedTerms':
        return (!value) && step === 4 ? 'You must accept the terms and conditions' : '';
      default:
        return '';
    }
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (step === 1) {
      ['name', 'email', 'phone', 'password', 'confirmPassword'].forEach(field => {
        const error = validateField(field, formData[field as keyof ExpertFormData]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    } else if (step === 2) {
      ['address', 'city', 'state', 'country'].forEach(field => {
        const error = validateField(field, formData[field as keyof ExpertFormData]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    } else if (step === 3) {
      ['specialization', 'experience', 'bio'].forEach(field => {
        const error = validateField(field, formData[field as keyof ExpertFormData]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    } else if (step === 4) {
      // Check for selected services
      const servicesError = validateField('selectedServices', formData.selectedServices);
      if (servicesError) {
        newErrors.selectedServices = servicesError;
        isValid = false;
      }
      
      // Check for terms acceptance
      const termsError = validateField('acceptedTerms', formData.acceptedTerms);
      if (termsError) {
        newErrors.acceptedTerms = termsError;
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate the current step (which is the final step)
    if (!validateCurrentStep()) {
      // Show toast for validation errors
      toast.error('Please correct the errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting form with data:', formData);
      
      // Convert form data to registration data
      const registrationData = formDataToRegistrationData(formData);
      
      // Attempt to register the expert
      console.log('Registering with data:', registrationData);
      const success = await register(registrationData);
      
      if (success) {
        toast.success("Registration successful! Please check your email for verification and then log in.");
        navigate('/expert-login');
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      // Show validation errors
      toast.error('Please correct the errors before proceeding');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return {
    step,
    services,
    formData,
    errors,
    handleChange,
    handleCheckboxChange,
    handleFileUpload,
    handleRemoveCertificate,
    handleSubmit,
    nextStep,
    prevStep,
    setFormData,
    isSubmitting
  };
};

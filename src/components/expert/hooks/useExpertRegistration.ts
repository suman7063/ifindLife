
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ExpertFormData, formDataToRegistrationData } from '../types';
import { useExpertAuth } from '@/hooks/useExpertAuth';
import { useExpertForm } from './useExpertForm';
import { fetchServices } from '../services/expertServicesService';
import { validateStep, validateSubmission } from '../utils/formValidation';
import { ServiceType } from '../types';

export const useExpertRegistration = () => {
  const navigate = useNavigate();
  const { register } = useExpertAuth();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      const servicesData = await fetchServices();
      setServices(servicesData);
    };
    
    loadServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    if (!validateSubmission(formData)) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Convert formData to registration data
      const registrationData = formDataToRegistrationData(formData);
      
      // Attempt to register the expert
      const success = await register(registrationData);
      
      if (success) {
        toast.success("Registration successful! Please check your email for verification and then log in.");
        navigate('/expert-login');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (!validateStep(step, formData)) return;
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return {
    step,
    services,
    formData,
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

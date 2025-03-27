
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ExpertFormData, ServiceType, formDataToRegistrationData } from '../types';
import { useExpertAuth } from '@/hooks/useExpertAuth';
import { supabase } from '@/lib/supabase';

export const useExpertRegistration = () => {
  const navigate = useNavigate();
  const { register } = useExpertAuth();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ExpertFormData>({
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
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*');
        
        if (error) {
          console.error("Error fetching services:", error);
          createSampleServices();
          return;
        }
        
        if (data && data.length > 0) {
          const servicesData = data.map(service => ({
            id: service.id,
            name: service.name,
            description: service.description,
            rateUSD: service.rate_usd,
            rateINR: service.rate_inr,
          }));
          setServices(servicesData);
        } else {
          console.warn("No services found in database");
          createSampleServices();
        }
      } catch (e) {
        console.error("Error fetching services", e);
        createSampleServices();
      }
    };
    
    fetchServices();
  }, []);

  const createSampleServices = () => {
    const sampleServices: ServiceType[] = [
      {
        id: 1,
        name: "Therapy Session",
        description: "One-on-one therapy session to discuss mental health concerns",
        rateUSD: 40,
        rateINR: 3200,
      },
      {
        id: 2,
        name: "Anxiety Management",
        description: "Learn techniques to manage anxiety and stress",
        rateUSD: 35,
        rateINR: 2800,
      },
      {
        id: 3,
        name: "Depression Counseling",
        description: "Support and guidance for managing depression",
        rateUSD: 45,
        rateINR: 3600,
      },
      {
        id: 4,
        name: "Relationship Counseling",
        description: "Guidance for improving personal relationships",
        rateUSD: 50,
        rateINR: 4000,
      }
    ];
    setServices(sampleServices);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (serviceId: number) => {
    setFormData(prev => {
      if (prev.selectedServices.includes(serviceId)) {
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter(id => id !== serviceId)
        };
      } else {
        return {
          ...prev,
          selectedServices: [...prev.selectedServices, serviceId]
        };
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        certificates: [...prev.certificates || [], ...files],
        certificateUrls: [...prev.certificateUrls || [], ...files.map(file => URL.createObjectURL(file))]
      }));
    }
  };

  const handleRemoveCertificate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates ? prev.certificates.filter((_, i) => i !== index) : [],
      certificateUrls: prev.certificateUrls ? prev.certificateUrls.filter((_, i) => i !== index) : []
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        toast.error("Please fill all required fields");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.address || !formData.city || !formData.state || !formData.country) {
        toast.error("Please fill all required fields");
        return false;
      }
    }
    
    if (currentStep === 3) {
      if (!formData.specialization || !formData.experience || !formData.bio) {
        toast.error("Please fill all required fields");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.acceptedTerms) {
      toast.error("Please accept the terms and conditions");
      setIsSubmitting(false);
      return;
    }
    
    if (formData.selectedServices.length === 0) {
      toast.error("Please select at least one service");
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
    if (!validateStep(step)) return;
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

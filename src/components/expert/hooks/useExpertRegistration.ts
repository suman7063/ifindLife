import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ExpertFormData, ServiceType } from '../types';

export const useExpertRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [formData, setFormData] = useState<ExpertFormData>({
    id: Date.now(),
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
    const storedContent = localStorage.getItem('ifindlife-content');
    if (storedContent) {
      try {
        const parsedContent = JSON.parse(storedContent);
        if (parsedContent.categories) {
          const servicesFromCategories = parsedContent.categories.map((category: any, index: number) => ({
            id: index + 1,
            name: category.title,
            description: category.description,
            rateUSD: 30 + (index * 5),
            rateINR: (30 + (index * 5)) * 80,
          }));
          setServices(servicesFromCategories);
        } else {
          console.warn("No categories found in stored content");
          createSampleServices();
        }
      } catch (e) {
        console.error("Error parsing saved content", e);
        createSampleServices();
      }
    } else {
      console.warn("No stored content found");
      createSampleServices();
    }
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
        certificates: [...prev.certificates, ...files],
        certificateUrls: [...prev.certificateUrls, ...files.map(file => URL.createObjectURL(file))]
      }));
    }
  };

  const handleRemoveCertificate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
      certificateUrls: prev.certificateUrls.filter((_, i) => i !== index)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (!formData.acceptedTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    if (formData.selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    
    const experts = localStorage.getItem('ifindlife-experts')
      ? JSON.parse(localStorage.getItem('ifindlife-experts')!)
      : [];
    
    if (experts.some((expert: any) => expert.email === formData.email)) {
      toast.error("Email already registered");
      return;
    }
    
    const newExperts = [...experts, formData];
    localStorage.setItem('ifindlife-experts', JSON.stringify(newExperts));
    
    toast.success("Registration successful! Please login.");
    navigate('/expert-login');
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
    setFormData
  };
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PersonalInfoStep from './PersonalInfoStep';
import AddressInfoStep from './AddressInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import ServiceSelectionStep from './ServiceSelectionStep';
import { ExpertFormData, ServiceType } from './types';
import { Button } from '@/components/ui/button';

const ExpertRegistrationForm = () => {
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
        }
      } catch (e) {
        console.error("Error parsing saved content", e);
      }
    }
  }, []);

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
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        toast.error("Please fill all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.address || !formData.city || !formData.state || !formData.country) {
        toast.error("Please fill all required fields");
        return;
      }
    }
    
    if (step === 3) {
      if (!formData.specialization || !formData.experience || !formData.bio) {
        toast.error("Please fill all required fields");
        return;
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 && (
        <PersonalInfoStep 
          formData={formData} 
          handleChange={handleChange} 
          nextStep={nextStep} 
        />
      )}
      
      {step === 2 && (
        <AddressInfoStep 
          formData={formData} 
          handleChange={handleChange} 
          nextStep={nextStep} 
          prevStep={prevStep} 
        />
      )}
      
      {step === 3 && (
        <ProfessionalInfoStep 
          formData={formData} 
          handleChange={handleChange} 
          handleFileUpload={handleFileUpload}
          handleRemoveCertificate={handleRemoveCertificate}
          nextStep={nextStep} 
          prevStep={prevStep} 
        />
      )}
      
      {step === 4 && (
        <div className="space-y-6">
          <ServiceSelectionStep 
            formData={formData}
            services={services}
            handleCheckboxChange={handleCheckboxChange}
            handleSubmit={handleSubmit}
            prevStep={prevStep}
            setFormData={setFormData}
          />
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
            >
              Previous
            </Button>
            <Button
              type="submit"
              className="bg-astro-purple hover:bg-astro-violet"
            >
              Complete Registration
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default ExpertRegistrationForm;

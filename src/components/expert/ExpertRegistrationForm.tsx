
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import PersonalInfoStep from './PersonalInfoStep';
import AddressInfoStep from './AddressInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import ServiceSelectionStep from './ServiceSelectionStep';
import { useExpertRegistration } from '@/hooks/expert-auth/auth/useExpertRegistration';
import { fetchServices } from './services/expertServicesService';
import { ServiceType } from './types';

const ExpertRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, registrationError } = useExpertRegistration(setLoading);
  
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});
  
  const initialFormData = {
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
  
  const [formData, setFormData] = useState(initialFormData);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Load services on mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        console.log('Fetching expert services...');
        const servicesData = await fetchServices();
        console.log('Services fetched successfully:', servicesData);
        setServices(servicesData);
      } catch (error) {
        console.error('Error loading services:', error);
        toast.error('Failed to load services');
        
        // Fallback to default services if fetch fails
        setServices([
          { id: 1, name: 'Therapy' },
          { id: 2, name: 'Counseling' },
          { id: 3, name: 'Consultation' }
        ]);
      }
    };
    
    loadServices();
  }, []);
  
  // Form handling functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on change if it's been touched
    if (fieldTouched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFieldTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
    setFieldTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field if it's been touched
    if (fieldTouched[name]) {
      const error = validateField(name, checked);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };
  
  const handleServiceSelection = (serviceId: number, checked: boolean) => {
    const selectedServices = checked
      ? [...formData.selectedServices, serviceId]
      : formData.selectedServices.filter(id => id !== serviceId);
    
    setFormData(prev => ({ ...prev, selectedServices }));
    setFieldTouched(prev => ({ ...prev, selectedServices: true }));
    
    // Validate services selection
    if (fieldTouched.selectedServices) {
      const error = validateField('selectedServices', selectedServices);
      setErrors(prev => ({
        ...prev,
        selectedServices: error
      }));
    }
  };
  
  // Updated to match the ProfessionalInfoStep expectation (single file)
  const handleFileUpload = async (file: File): Promise<void> => {
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }
    
    // Check file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'jpg', 'jpeg', 'png'].includes(fileExt || '')) {
      toast.error('Invalid file type. Only PDF, JPG, JPEG, PNG are allowed');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      // In a real implementation, upload the file to storage
      // For now, just add to the certificates array
      const certificates = [...formData.certificates, file];
      const certificateUrls = [...formData.certificateUrls, URL.createObjectURL(file)];
      
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        
        setFormData(prev => ({
          ...prev,
          certificates,
          certificateUrls
        }));
        
        toast.success('Certificate uploaded successfully');
        setIsUploading(false);
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload certificate');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleRemoveCertificate = (index: number) => {
    const certificates = [...formData.certificates];
    const certificateUrls = [...formData.certificateUrls];
    
    certificates.splice(index, 1);
    certificateUrls.splice(index, 1);
    
    setFormData(prev => ({ ...prev, certificates, certificateUrls }));
  };

  const validateField = (name: string, value: any): string => {
    switch(name) {
      case 'name':
        return !value ? 'Name is required' : '';
      case 'email':
        return !value ? 'Email is required' : 
               !/\S+@\S+\.\S+/.test(value) ? 'Email is invalid' : '';
      case 'phone':
        return !value ? 'Phone number is required' : 
               !/^\+?[0-9\s-]{8,}$/.test(value) ? 'Phone number is invalid' : '';
      case 'password':
        return !value ? 'Password is required' : 
               value.length < 6 ? 'Password must be at least 6 characters' : '';
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
        return (!value || (Array.isArray(value) && value.length === 0)) && step === 4 ? 'Please select at least one service' : '';
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
        const fieldValue = formData[field as keyof typeof formData];
        const error = validateField(field, fieldValue);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
        setFieldTouched(prev => ({ ...prev, [field]: true }));
      });
    } else if (step === 2) {
      ['address', 'city', 'state', 'country'].forEach(field => {
        const fieldValue = formData[field as keyof typeof formData];
        const error = validateField(field, fieldValue);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
        setFieldTouched(prev => ({ ...prev, [field]: true }));
      });
    } else if (step === 3) {
      ['specialization', 'experience', 'bio'].forEach(field => {
        const fieldValue = formData[field as keyof typeof formData];
        const error = validateField(field, fieldValue);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
        setFieldTouched(prev => ({ ...prev, [field]: true }));
      });
    } else if (step === 4) {
      const servicesError = validateField('selectedServices', formData.selectedServices);
      if (servicesError) {
        newErrors.selectedServices = servicesError;
        isValid = false;
        setFieldTouched(prev => ({ ...prev, selectedServices: true }));
      }
      
      const termsError = validateField('acceptedTerms', formData.acceptedTerms);
      if (termsError) {
        newErrors.acceptedTerms = termsError;
        isValid = false;
        setFieldTouched(prev => ({ ...prev, acceptedTerms: true }));
      }
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    if (!validateCurrentStep()) {
      toast.error('Please correct the errors before submitting');
      return;
    }
    
    try {
      setFormError(null);
      
      // Transform formData to registration data
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        specialization: formData.specialization,
        experience: formData.experience,
        bio: formData.bio,
        certificate_urls: formData.certificateUrls,
        selected_services: formData.selectedServices
      };
      
      console.log('Submitting expert registration with data:', registrationData);
      const success = await register(registrationData);
      
      if (success) {
        toast.success('Registration successful! Please log in with your credentials.');
        // Navigate to login tab with status=registered in query param
        navigate('/expert-login?status=registered');
      }
    } catch (error: any) {
      setFormError(error.message || 'An unexpected error occurred');
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      toast.error('Please correct the errors before proceeding');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <form onSubmit={onSubmitForm} className="space-y-6">
      {(formError || registrationError) && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{formError || registrationError}</AlertDescription>
        </Alert>
      )}
      
      {step === 1 && (
        <PersonalInfoStep 
          formData={formData} 
          handleChange={handleChange} 
          handleBlur={handleBlur}
          nextStep={nextStep}
          errors={errors}
          touched={fieldTouched}
        />
      )}
      
      {step === 2 && (
        <AddressInfoStep 
          formData={formData} 
          handleChange={handleChange} 
          handleBlur={handleBlur}
          nextStep={nextStep} 
          prevStep={prevStep}
          errors={errors}
          touched={fieldTouched}
        />
      )}
      
      {step === 3 && (
        <ProfessionalInfoStep 
          formData={formData} 
          handleChange={handleChange} 
          handleBlur={handleBlur}
          handleFileUpload={handleFileUpload}
          handleRemoveCertificate={handleRemoveCertificate}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          nextStep={nextStep} 
          prevStep={prevStep}
          errors={errors}
          touched={fieldTouched}
        />
      )}
      
      {step === 4 && (
        <ServiceSelectionStep 
          formData={formData}
          services={services}
          handleCheckboxChange={handleServiceSelection}
          setFormData={setFormData}
          errors={errors}
          touched={fieldTouched}
          handleAcceptTerms={(checked: boolean) => handleCheckboxChange('acceptedTerms', checked)}
          isSubmitting={loading}
          onSubmit={onSubmitForm}
          prevStep={prevStep}
        />
      )}
    </form>
  );
};

export default ExpertRegistrationForm;

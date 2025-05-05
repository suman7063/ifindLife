
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PersonalInfoStep from './PersonalInfoStep';
import AddressInfoStep from './AddressInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import ServiceSelectionStep from './ServiceSelectionStep';
import { useExpertRegistration } from '@/hooks/expert-auth/auth/useExpertRegistration';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';

const ExpertRegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, registrationError } = useExpertRegistration(setLoading);
  
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  
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
  
  // Form handling functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Updated to match the ProfessionalInfoStep expectation (single file)
  const handleFileUpload = async (file: File): Promise<void> => {
    const certificates = [...formData.certificates, file];
    setFormData(prev => ({ ...prev, certificates }));
  };
  
  const handleRemoveCertificate = (index: number) => {
    const certificates = [...formData.certificates];
    certificates.splice(index, 1);
    setFormData(prev => ({ ...prev, certificates }));
  };
  
  // Initialize form with form data
  const methods = useForm({
    defaultValues: formData
  });

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
        const error = validateField(field, formData[field as keyof typeof formData]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    } else if (step === 2) {
      ['address', 'city', 'state', 'country'].forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    } else if (step === 3) {
      ['specialization', 'experience', 'bio'].forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    } else if (step === 4) {
      const servicesError = validateField('selectedServices', formData.selectedServices);
      if (servicesError) {
        newErrors.selectedServices = servicesError;
        isValid = false;
      }
      
      const termsError = validateField('acceptedTerms', formData.acceptedTerms);
      if (termsError) {
        newErrors.acceptedTerms = termsError;
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;
    
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
      
      const success = await register(registrationData);
      
      if (success) {
        // Navigate to login tab with status=registered in query param
        navigate('/expert-login?status=registered');
      }
    } catch (error: any) {
      setFormError(error.message || 'An unexpected error occurred');
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Fetch services on component mount
  React.useEffect(() => {
    // Mock service fetching for now
    setServices([
      { id: 1, name: 'Therapy' },
      { id: 2, name: 'Counseling' },
      { id: 3, name: 'Consultation' }
    ]);
  }, []);

  return (
    <FormProvider {...methods}>
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
            nextStep={nextStep}
            errors={errors}
          />
        )}
        
        {step === 2 && (
          <AddressInfoStep 
            formData={formData} 
            handleChange={handleChange} 
            nextStep={nextStep} 
            prevStep={prevStep}
            errors={errors}
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
            errors={errors}
          />
        )}
        
        {step === 4 && (
          <div className="space-y-6">
            <ServiceSelectionStep 
              formData={formData}
              services={services}
              handleCheckboxChange={(serviceId: number, checked: boolean) => {
                // Modify the selectedServices array based on the checkbox state
                const selectedServices = checked 
                  ? [...formData.selectedServices, serviceId] 
                  : formData.selectedServices.filter(id => id !== serviceId);
                
                setFormData(prev => ({ ...prev, selectedServices }));
                
                // Clear error when field is edited
                if (errors.selectedServices) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.selectedServices;
                    return newErrors;
                  });
                }
              }}
              setFormData={setFormData}
              errors={errors}
            />
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="acceptedTerms" 
                  name="acceptedTerms"
                  checked={formData.acceptedTerms}
                  onCheckedChange={(checked) => {
                    handleCheckboxChange('acceptedTerms', checked as boolean);
                  }}
                  className={errors.acceptedTerms ? "border-destructive data-[state=checked]:bg-destructive" : ""}
                />
                <Label 
                  htmlFor="acceptedTerms"
                  className={errors.acceptedTerms ? "text-destructive" : ""}
                >
                  I accept the terms and conditions <span className="text-destructive">*</span>
                </Label>
              </div>
              
              {errors.acceptedTerms && (
                <FormMessage>{errors.acceptedTerms}</FormMessage>
              )}
              
              <Alert className="bg-gray-100 border-gray-200">
                <AlertDescription>
                  By submitting this form, you acknowledge that your application will be reviewed by our administrators.
                  You will receive an email notification once your application has been processed.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ifind-aqua hover:bg-ifind-teal transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default ExpertRegistrationForm;

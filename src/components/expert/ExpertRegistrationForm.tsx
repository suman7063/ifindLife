
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import PersonalInfoStep from './PersonalInfoStep';
import AddressInfoStep from './AddressInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import ServiceSelectionStep from './ServiceSelectionStep';
import { useExpertRegistration } from './hooks/useExpertRegistration';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';

const ExpertRegistrationForm = () => {
  const {
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
    isSubmitting,
  } = useExpertRegistration();

  // Initialize form with form data
  const methods = useForm({
    defaultValues: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      specialization: formData.specialization,
      experience: formData.experience,
      bio: formData.bio,
      acceptedTerms: formData.acceptedTerms
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-6">
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
              handleCheckboxChange={handleCheckboxChange}
              errors={errors}
            />
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="acceptedTerms" 
                  name="acceptedTerms"
                  checked={formData.acceptedTerms}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      acceptedTerms: checked as boolean
                    });
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
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ifind-aqua hover:bg-ifind-teal transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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

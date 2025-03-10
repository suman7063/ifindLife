
import React from 'react';
import PersonalInfoStep from './PersonalInfoStep';
import AddressInfoStep from './AddressInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import ServiceSelectionStep from './ServiceSelectionStep';
import { useExpertRegistration } from './hooks/useExpertRegistration';
import FormStepContainer from './FormStepContainer';

const ExpertRegistrationForm = () => {
  const {
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
  } = useExpertRegistration();

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
        <FormStepContainer 
          prevStep={prevStep}
          submitLabel="Complete Registration"
        >
          <ServiceSelectionStep 
            formData={formData}
            services={services}
            handleCheckboxChange={handleCheckboxChange}
            prevStep={prevStep}
            setFormData={setFormData}
          />
        </FormStepContainer>
      )}
    </form>
  );
};

export default ExpertRegistrationForm;

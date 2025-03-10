
import React from 'react';
import PersonalInfoStep from './PersonalInfoStep';
import AddressInfoStep from './AddressInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import ServiceSelectionStep from './ServiceSelectionStep';
import { useExpertRegistration } from './hooks/useExpertRegistration';

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
        <div className="space-y-6">
          <ServiceSelectionStep 
            formData={formData}
            services={services}
            handleCheckboxChange={handleCheckboxChange}
            setFormData={setFormData}
          />
          
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ifind-aqua hover:bg-ifind-teal transition-colors"
            >
              Complete Registration
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default ExpertRegistrationForm;

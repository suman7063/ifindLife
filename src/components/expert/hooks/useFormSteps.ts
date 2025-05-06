
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const useFormSteps = (form: UseFormReturn<any>, stepsCount: number) => {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => {
    const fields = [
      // Step 1 fields
      ["name", "email", "phone"],
      // Step 2 fields
      ["address", "city", "state", "country"],
      // Step 3 fields - includes the terms and password since it's the final step
      ["title", "experience", "specialties", "bio", "password", "confirmPassword", "termsAccepted"],
    ];
    
    const currentFields = fields[activeStep];
    const output = form.trigger(currentFields as any);
    
    output.then((valid) => {
      if (valid) {
        setActiveStep(prev => Math.min(prev + 1, stepsCount - 1));
      }
    });
  };
  
  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  return {
    activeStep,
    setActiveStep,
    nextStep,
    prevStep
  };
};

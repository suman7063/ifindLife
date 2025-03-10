
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface FormStepContainerProps {
  children: ReactNode;
  prevStep: () => void;
  submitLabel?: string;
}

const FormStepContainer = ({ 
  children, 
  prevStep, 
  submitLabel = "Submit" 
}: FormStepContainerProps) => {
  return (
    <div className="space-y-6">
      {children}
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
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};

export default FormStepContainer;

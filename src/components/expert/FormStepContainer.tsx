
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

interface FormStepContainerProps {
  title: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: boolean;
  isSubmitting?: boolean;
}

const FormStepContainer: React.FC<FormStepContainerProps> = ({
  title,
  children,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit = false,
  isSubmitting = false
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
      
      <div className="border-b pb-6 mb-6">
        {children}
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={!onPrevious || isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {onNext ? (
          <Button 
            type="button" 
            onClick={onNext}
            disabled={isSubmitting}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : onSubmit ? (
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-ifind-aqua hover:bg-ifind-teal"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default FormStepContainer;

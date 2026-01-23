import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpertServiceSelectionStep } from './ExpertServiceSelectionStep';
import { ExpertProfileSetupStep } from './ExpertProfileSetupStep';
import { ExpertAvailabilitySetupStep } from './ExpertAvailabilitySetupStep';
import { Progress } from '@/components/ui/progress';

export const ExpertOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and navigate to dashboard
      navigate('/mobile-app/expert-app');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border px-4 py-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1">
        {currentStep === 1 && (
          <ExpertServiceSelectionStep onNext={handleNext} />
        )}
        {currentStep === 2 && (
          <ExpertProfileSetupStep onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 3 && (
          <ExpertAvailabilitySetupStep onNext={handleNext} onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

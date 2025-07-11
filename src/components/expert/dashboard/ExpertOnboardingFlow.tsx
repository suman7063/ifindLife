import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { PricingSetupStep } from './onboarding/PricingSetupStep';
import { AvailabilitySetupStep } from './onboarding/AvailabilitySetupStep';
import { ProfileCompletionStep } from './onboarding/ProfileCompletionStep';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  optional?: boolean;
}

export const ExpertOnboardingFlow: React.FC = () => {
  const { user } = useAuth();
  const [expertAccount, setExpertAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState<string>('pricing');

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'pricing',
      title: 'Set Your Pricing',
      description: 'Configure your consultation rates based on your expert category',
      completed: false
    },
    {
      id: 'availability',
      title: 'Configure Availability',
      description: 'Set your working hours and available time slots',
      completed: false
    },
    {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Add additional information to enhance your profile',
      completed: false,
      optional: true
    }
  ]);

  useEffect(() => {
    fetchExpertAccount();
  }, [user]);

  const fetchExpertAccount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', user.id)
        .single();

      if (error) throw error;

      setExpertAccount(data);
      
      // Update step completion status
      setSteps(prev => prev.map(step => ({
        ...step,
        completed: getStepCompletion(step.id, data)
      })));

    } catch (error) {
      console.error('Error fetching expert account:', error);
      toast.error('Failed to load expert account');
    } finally {
      setLoading(false);
    }
  };

  const getStepCompletion = (stepId: string, account: any): boolean => {
    switch (stepId) {
      case 'pricing':
        return account?.pricing_set || false;
      case 'availability':
        return account?.availability_set || false;
      case 'profile':
        return account?.profile_completed || false;
      default:
        return false;
    }
  };

  const handleStepComplete = async (stepId: string) => {
    try {
      let updateField = `${stepId}_set`;
      if (stepId === 'profile') {
        updateField = 'profile_completed';
      }

      const { error } = await supabase
        .from('expert_accounts')
        .update({ 
          [updateField]: true,
          onboarding_completed: steps.every(s => s.completed || s.optional)
        })
        .eq('auth_id', user?.id);

      if (error) throw error;

      // Update local state
      setSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, completed: true }
          : step
      ));

      toast.success(`${steps.find(s => s.id === stepId)?.title} completed!`);
      
      // Move to next incomplete step
      const nextStep = steps.find(s => !s.completed && s.id !== stepId);
      if (nextStep) {
        setActiveStep(nextStep.id);
      }

    } catch (error) {
      console.error('Error updating step completion:', error);
      toast.error('Failed to update progress');
    }
  };

  const getStepIcon = (step: OnboardingStep) => {
    if (step.completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (step.id === activeStep) {
      return <Clock className="h-5 w-5 text-blue-600" />;
    }
    return <Circle className="h-5 w-5 text-gray-400" />;
  };

  const renderStepContent = () => {
    if (!expertAccount) return null;

    switch (activeStep) {
      case 'pricing':
        return (
          <PricingSetupStep
            expertAccount={expertAccount}
            onComplete={() => handleStepComplete('pricing')}
          />
        );
      case 'availability':
        return (
          <AvailabilitySetupStep
            expertAccount={expertAccount}
            onComplete={() => handleStepComplete('availability')}
          />
        );
      case 'profile':
        return (
          <ProfileCompletionStep
            expertAccount={expertAccount}
            onComplete={() => handleStepComplete('profile')}
          />
        );
      default:
        return <div>Step not found</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const allRequiredStepsCompleted = steps.filter(s => !s.optional).every(s => s.completed);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {allRequiredStepsCompleted ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-blue-600" />
            )}
            Expert Dashboard Setup
          </CardTitle>
          <p className="text-muted-foreground">
            {allRequiredStepsCompleted 
              ? "Congratulations! Your expert profile is ready. You can now receive bookings."
              : "Complete the following steps to activate your expert profile and start receiving bookings."
            }
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Steps */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Setup Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  step.id === activeStep 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                {getStepIcon(step)}
                <div className="flex-1">
                  <h4 className="font-medium flex items-center gap-2">
                    {step.title}
                    {step.optional && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Optional</span>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Step Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {steps.find(s => s.id === activeStep)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>

      {allRequiredStepsCompleted && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Setup Complete! 🎉
              </h3>
              <p className="text-green-700 mb-4">
                Your expert profile is now active and ready to receive bookings from users.
              </p>
              <Button>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExpertOnboardingFlow;
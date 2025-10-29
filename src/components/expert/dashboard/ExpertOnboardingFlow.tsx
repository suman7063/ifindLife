import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { PricingSetupStep } from './onboarding/PricingSetupStep';
import { AvailabilitySetupStep } from './onboarding/AvailabilitySetupStep';
import { ProfileCompletionStep } from './onboarding/ProfileCompletionStep';
import ServiceSelectionStep from './onboarding/ServiceSelectionStep';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  optional?: boolean;
}

export const ExpertOnboardingFlow: React.FC = () => {
  const { expert } = useSimpleAuth();
  const [expertAccount, setExpertAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<string>('services');

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'services',
      title: 'Select Services',
      description: 'Choose the services you want to offer to clients',
      completed: false
    },
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
      description: 'Add profile picture and additional information',
      completed: false,
      optional: true
    }
  ]);

  useEffect(() => {
    fetchExpertAccount();
  }, [expert]);

  // Calculate all required steps completed
  const allRequiredStepsCompleted = steps && steps.length > 0 ? steps.filter(s => !s.optional).every(s => s.completed) : false;

  // Debug effect to monitor steps completion
  useEffect(() => {
    if (steps && steps.length > 0) {
      console.log('🔍 Steps completion status:', steps.map(s => ({ id: s.id, completed: s.completed })));
      console.log('🔍 All required steps completed:', allRequiredStepsCompleted);
    }
  }, [steps, allRequiredStepsCompleted]);

  const fetchExpertAccount = async () => {
    if (!expert) {
      setError('No expert found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', expert.auth_id)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Expert account not found');
      }

      setExpertAccount(data);
      
      // Update step completion status
      const updatedSteps = await Promise.all(
        steps.map(async (step) => ({
          ...step,
          completed: await getStepCompletion(step.id, data)
        }))
      );
      setSteps(updatedSteps);

    } catch (error) {
      console.error('Error fetching expert account:', error);
      setError(error instanceof Error ? error.message : 'Failed to load expert account');
      toast.error('Failed to load expert account');
    } finally {
      setLoading(false);
    }
  };

  const getStepCompletion = async (stepId: string, account: any): Promise<boolean> => {
    try {
      // Check the expert_onboarding_status table for completion status
      const { data: onboardingStatus, error } = await supabase
        .from('expert_onboarding_status')
        .select('*')
        .eq('expert_id', account.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching onboarding status:', error);
        return false;
      }

      if (!onboardingStatus) {
        return false;
      }

      switch (stepId) {
        case 'services':
          return onboardingStatus.services_assigned || false;
        case 'pricing':
          return onboardingStatus.pricing_setup || false;
        case 'availability':
          return onboardingStatus.availability_setup || false;
        case 'profile':
          return onboardingStatus.profile_completed || false;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking step completion:', error);
      return false;
    }
  };

  const handleStepComplete = async (stepId: string) => {
    try {
      console.log('🎯 Step completed:', stepId);
      
      // Update local state immediately for better UX
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

      // The actual database updates are handled within each step component
      // This function just handles the UI flow

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
      case 'services':
        return (
          <ServiceSelectionStep
            expertAccount={expertAccount}
            onComplete={() => handleStepComplete('services')}
          />
        );
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

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Onboarding</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!expertAccount) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Expert Account Not Found</h3>
          <p className="text-yellow-600 mb-4">Please complete your expert registration first.</p>
          <Button onClick={() => window.location.href = '/expert-registration'}>
            Go to Registration
          </Button>
        </div>
      </div>
    );
  }

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
              <Button 
                onClick={async () => {
                  // Force mark onboarding as complete
                  try {
                    console.log('🎉 Completing onboarding for expert:', expertAccount?.id);
                    
                    // Update expert_onboarding_status
                    const { error: statusError } = await supabase
                      .from('expert_onboarding_status')
                      .upsert({
                        expert_id: expertAccount?.id,
                        onboarding_completed: true
                      }, {
                        onConflict: 'expert_id'
                      });

                    if (statusError) {
                      console.error('Error updating onboarding status:', statusError);
                    }

                    // Update expert_accounts
                    const { error: accountError } = await supabase
                      .from('expert_accounts')
                      .update({ onboarding_completed: true })
                      .eq('id', expertAccount?.id);

                    if (accountError) {
                      console.error('Error updating expert account:', accountError);
                    }
                    
                    console.log('✅ Onboarding completed, redirecting to dashboard');
                    toast.success('Onboarding completed! Redirecting to dashboard...');
                    
                    // Redirect to dashboard
                    setTimeout(() => {
                      window.location.href = '/expert-dashboard';
                    }, 1000);
                  } catch (error) {
                    console.error('Error finalizing onboarding:', error);
                    toast.error('Failed to complete onboarding');
                  }
                }}
              >
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
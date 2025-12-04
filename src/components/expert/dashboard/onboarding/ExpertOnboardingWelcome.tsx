import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Settings, User, DollarSign, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  required: boolean;
}

interface ExpertOnboardingWelcomeProps {
  expertId: string;
  onStepComplete: (stepId: string) => void;
  onComplete: () => void;
}

const ExpertOnboardingWelcome: React.FC<ExpertOnboardingWelcomeProps> = ({
  expertId,
  onStepComplete,
  onComplete
}) => {
  const [accountFlags, setAccountFlags] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<string>('services');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountFlags();
  }, [expertId]);

  const fetchAccountFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('pricing_set, availability_set, profile_completed, onboarding_completed')
        .eq('auth_id', expertId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Check services from expert_service_specializations table
      const { data: specializations } = await supabase
        .from('expert_service_specializations')
        .select('id')
        .eq('expert_id', expertId)
        .limit(1);

      const hasServices = (specializations?.length || 0) > 0;

      setAccountFlags({
        ...(data || {
          pricing_set: false,
          availability_set: false,
          profile_completed: false,
          onboarding_completed: false,
        }),
        hasServices,
      });
    } catch (error) {
      console.error('Error fetching expert account flags:', error);
      toast.error('Failed to load onboarding');
    } finally {
      setLoading(false);
    }
  };

  // Deprecated updater removed; flags are updated within each step component

  const completeOnboarding = async () => {
    try {
      // Update expert account
      const { error } = await supabase
        .from('expert_accounts')
        .update({ onboarding_completed: true })
        .eq('auth_id', expertId);

      if (error) throw error;
      
      toast.success('Onboarding completed! Welcome to the platform!');
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading onboarding...</div>
      </div>
    );
  }

  const steps: OnboardingStep[] = [
    {
      id: 'services',
      title: 'Select Your Services',
      description: 'Choose the services you want to offer from your category',
      icon: <Settings className="h-5 w-5" />,
      completed: accountFlags?.hasServices || false,
      required: true,
    },
    {
      id: 'pricing',
      title: 'Set Your Pricing',
      description: 'Configure your pricing for different session durations',
      icon: <DollarSign className="h-5 w-5" />,
      completed: accountFlags?.pricing_set || false,
      required: true,
    },
    {
      id: 'availability',
      title: 'Setup Availability',
      description: 'Set your available time slots for bookings',
      icon: <Calendar className="h-5 w-5" />,
      completed: accountFlags?.availability_set || false,
      required: true,
    },
    {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Add additional information to your profile',
      icon: <User className="h-5 w-5" />,
      completed: accountFlags?.profile_completed || false,
      required: false,
    },
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const requiredSteps = steps.filter(step => step.required);
  const completedRequiredSteps = requiredSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;
  const canComplete = completedRequiredSteps === requiredSteps.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Your Expert Dashboard! 🎉</CardTitle>
          <p className="text-primary-foreground/90">
            Congratulations on being approved as an expert! Let's get you set up to start helping clients.
          </p>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Setup Progress</CardTitle>
            <Badge variant={canComplete ? 'default' : 'secondary'}>
              {completedSteps}/{steps.length} Complete
            </Badge>
          </div>
          <Progress value={progressPercentage} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {canComplete 
              ? 'All required steps completed! You can now start accepting clients.'
              : `${requiredSteps.length - completedRequiredSteps} required steps remaining`
            }
          </p>
        </CardHeader>
      </Card>

      {/* Onboarding Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, index) => (
          <Card 
            key={step.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              step.completed 
                ? 'border-green-200 bg-green-50' 
                : currentStep === step.id 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200'
            }`}
            onClick={() => setCurrentStep(step.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    step.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {step.completed ? <CheckCircle className="h-5 w-5" /> : step.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    {step.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                </div>
                {step.completed && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {!step.completed && (
                <Button 
                  className="mt-3 w-full" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStepComplete(step.id);
                  }}
                >
                  {currentStep === step.id ? 'Continue Setup' : 'Start Step'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Complete Onboarding */}
      {canComplete && !accountFlags?.onboarding_completed && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-green-800">Ready to Go!</h3>
                <p className="text-green-700">
                  You've completed all required setup steps. Complete your onboarding to start accepting clients.
                </p>
              </div>
              <Button 
                onClick={completeOnboarding}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Onboarding & Start Helping Clients
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Complete your setup</p>
              <p className="text-sm text-muted-foreground">
                Finish all required steps to activate your expert profile
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Start accepting clients</p>
              <p className="text-sm text-muted-foreground">
                Once setup is complete, clients will be able to book sessions with you
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Earn from your expertise</p>
              <p className="text-sm text-muted-foreground">
                Get paid for helping clients through one-on-one sessions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertOnboardingWelcome;
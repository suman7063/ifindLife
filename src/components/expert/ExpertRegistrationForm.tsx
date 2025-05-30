
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useFormSteps } from './hooks/useFormSteps';
import { useExpertRegistrationSubmit } from './hooks/useExpertRegistrationSubmit';
import { expertFormSchema, type ExpertFormValues } from './schemas/expertFormSchema';
import FormStepContainer from './FormStepContainer';
import PersonalInfoStep from './PersonalInfoStep';
import AddressInfoStep from './AddressInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ExpertRegistrationForm: React.FC = () => {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  const form = useForm<ExpertFormValues>({
    resolver: zodResolver(expertFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      title: '',
      experience: 0,
      specialties: [],
      bio: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
    mode: 'onChange'
  });

  const { activeStep, nextStep, prevStep } = useFormSteps(form, 3);
  const { handleSubmit, isSubmitting, registrationError, setRegistrationError } = useExpertRegistrationSubmit();

  // Load available services
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error loading services:', error);
        } else {
          setServices(data || []);
        }
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  const onSubmit = async (data: ExpertFormValues) => {
    const success = await handleSubmit(data);
    if (success) {
      form.reset();
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <FormStepContainer
            title="Personal Information"
            currentStep={1}
            totalSteps={3}
            onNext={nextStep}
          >
            <PersonalInfoStep />
          </FormStepContainer>
        );
      case 1:
        return (
          <FormStepContainer
            title="Address Information"
            currentStep={2}
            totalSteps={3}
            onPrevious={prevStep}
            onNext={nextStep}
          >
            <AddressInfoStep />
          </FormStepContainer>
        );
      case 2:
        return (
          <FormStepContainer
            title="Professional Information"
            currentStep={3}
            totalSteps={3}
            onPrevious={prevStep}
            onSubmit={true}
            isSubmitting={isSubmitting}
          >
            <ProfessionalInfoStep />
          </FormStepContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {registrationError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{registrationError}</AlertDescription>
        </Alert>
      )}
      
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

export default ExpertRegistrationForm;

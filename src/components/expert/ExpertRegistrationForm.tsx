
import React from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

import { expertFormSchema, ExpertFormValues } from './schemas/expertFormSchema';
import FormStepContainer from './FormStepContainer';
import PersonalInfoStep from './PersonalInfoStep';
import AddressInfoStep from './AddressInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import { useExpertRegistrationSubmit } from './hooks/useExpertRegistrationSubmit';
import { useFormSteps } from './hooks/useFormSteps';

const ExpertRegistrationForm = () => {
  const form = useForm<ExpertFormValues>({
    resolver: zodResolver(expertFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      title: "",
      experience: 0,
      specialties: [],
      bio: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });
  
  // Steps setup
  const steps = [
    { title: "Personal Info", component: <PersonalInfoStep /> },
    { title: "Address", component: <AddressInfoStep /> },
    { title: "Professional Info", component: <ProfessionalInfoStep /> },
  ];
  
  const { activeStep, nextStep, prevStep } = useFormSteps(form, steps.length);
  const { handleSubmit, isSubmitting, registrationError } = useExpertRegistrationSubmit();
  
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {registrationError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>{registrationError}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={String(activeStep)} className="w-full">
          {steps.map((step, index) => (
            <TabsContent key={index} value={String(index)}>
              <FormStepContainer 
                title={step.title} 
                currentStep={index + 1} 
                totalSteps={steps.length} 
                onNext={index < steps.length - 1 ? nextStep : undefined}
                onPrevious={index > 0 ? prevStep : undefined}
                onSubmit={index === steps.length - 1}
                isSubmitting={isSubmitting}
              >
                {step.component}
              </FormStepContainer>
            </TabsContent>
          ))}
        </Tabs>
      </form>
    </FormProvider>
  );
};

export default ExpertRegistrationForm;

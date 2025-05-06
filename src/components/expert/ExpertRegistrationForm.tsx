
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from 'sonner';
import FormStepContainer from './FormStepContainer';
import PersonalInfoStep from './PersonalInfoStep';
import AddressInfoStep from './AddressInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// Define form schema with validation but without selectedServices field
const expertFormSchema = z.object({
  // Personal Info
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Phone number is required"),
  
  // Address Info
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  country: z.string().min(1, "Country is required"),
  
  // Professional Info
  title: z.string().min(1, "Professional title is required"),
  experience: z.number().min(0, "Please specify years of experience"),
  specialties: z.array(z.string()).min(1, "Select at least one specialty"),
  bio: z.string().min(50, "Bio should be at least 50 characters"),
  
  // Account
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(value => value === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ExpertFormValues = z.infer<typeof expertFormSchema>;

const ExpertRegistrationForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  
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
  
  const handleSubmit = async (values: ExpertFormValues) => {
    try {
      setIsSubmitting(true);
      setRegistrationError(null);
      
      console.log('Form submitted with values:', values);
      
      // Register the expert
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            user_type: 'expert',
          },
        },
      });
      
      if (error) {
        // Show the specific error message
        if (error.message.includes('User already registered')) {
          setRegistrationError('This email address is already registered. Please use the login tab instead.');
        } else {
          setRegistrationError(error.message || 'Registration failed');
        }
        return;
      }
      
      if (!data.user?.id) {
        setRegistrationError('Registration failed. No user ID created.');
        return;
      }
      
      // Convert experience to string since the database expects a string
      const expertExperience = String(values.experience);
      
      // Create expert profile with empty services array
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert({
          auth_id: data.user.id,
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          title: values.title,
          experience: expertExperience,
          specialties: values.specialties,
          bio: values.bio,
          selected_services: [], // Empty array for services
          status: 'pending',
        });
        
      if (profileError) {
        console.error('Profile creation error:', profileError);
        setRegistrationError(profileError.message || 'Failed to create expert profile.');
        return;
      }
      
      toast.success('Registration successful! Your account is pending approval.');
      
      // Sign out after registration
      await supabase.auth.signOut();
      window.location.href = '/expert-login?status=registered';
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegistrationError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Using only 3 steps now
  const steps = [
    { title: "Personal Info", component: <PersonalInfoStep /> },
    { title: "Address", component: <AddressInfoStep /> },
    { title: "Professional Info", component: <ProfessionalInfoStep /> },
  ];
  
  const nextStep = () => {
    const fields = [
      // Step 1 fields
      ["name", "email", "phone"],
      // Step 2 fields
      ["address", "city", "state", "country"],
      // Step 3 fields - now includes the terms and password since it's the final step
      ["title", "experience", "specialties", "bio", "password", "confirmPassword", "termsAccepted"],
    ];
    
    const currentFields = fields[activeStep];
    const output = form.trigger(currentFields as any);
    
    output.then((valid) => {
      if (valid) {
        setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
      }
    });
  };
  
  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };
  
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

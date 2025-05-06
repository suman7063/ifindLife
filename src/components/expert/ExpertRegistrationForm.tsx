
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Define form schema with validation
const expertFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  country: z.string().min(1, "Country is required"),
  specialization: z.string().min(1, "Specialization is required"),
  experience: z.string().min(1, "Experience is required"),
  bio: z.string().min(50, "Bio should be at least 50 characters"),
  selectedServices: z.array(z.number()).min(1, "Select at least one service"),
  termsAccepted: z.boolean().refine(value => value === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ExpertFormValues = z.infer<typeof expertFormSchema>;

interface ExpertRegistrationFormProps {
  onSubmit: (data: ExpertFormValues) => Promise<boolean>;
  isSubmitting: boolean;
}

const ExpertRegistrationForm: React.FC<ExpertRegistrationFormProps> = ({ onSubmit, isSubmitting }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);
  
  const form = useForm<ExpertFormValues>({
    resolver: zodResolver(expertFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
      city: "",
      state: "",
      country: "",
      specialization: "",
      experience: "",
      bio: "",
      selectedServices: [],
      termsAccepted: false,
    },
  });
  
  // Load services for selection
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('id', { ascending: true });
          
        if (error) throw error;
        
        setServices(data || []);
      } catch (error) {
        console.error('Error loading services:', error);
        toast.error('Could not load services. Please try again later.');
      }
    };
    
    loadServices();
  }, []);
  
  const handleFormSubmit = async (values: ExpertFormValues) => {
    const success = await onSubmit(values);
    if (success) {
      form.reset();
    }
  };
  
  const validateCurrentStep = async () => {
    if (currentStep === 1) {
      const result = await form.trigger(['name', 'email', 'phone', 'password', 'confirmPassword']);
      return result;
    } else if (currentStep === 2) {
      const result = await form.trigger(['address', 'city', 'state', 'country']);
      return result;
    } else if (currentStep === 3) {
      const result = await form.trigger(['specialization', 'experience', 'bio']);
      return result;
    }
    return true;
  };
  
  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Step 1: Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" {...form.register("email")} />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" type="password" {...form.register("password")} />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 2: Address Information */}
      {currentStep === 2 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Address Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" {...form.register("address")} />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" {...form.register("city")} />
                  {form.formState.errors.city && (
                    <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province *</Label>
                  <Input id="state" {...form.register("state")} />
                  {form.formState.errors.state && (
                    <p className="text-sm text-red-500">{form.formState.errors.state.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" {...form.register("country")} />
                {form.formState.errors.country && (
                  <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 3: Professional Information */}
      {currentStep === 3 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Step 3: Professional Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input id="specialization" {...form.register("specialization")} placeholder="e.g., Anxiety, Depression" />
                  {form.formState.errors.specialization && (
                    <p className="text-sm text-red-500">{form.formState.errors.specialization.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input id="experience" {...form.register("experience")} placeholder="e.g., 5 years" />
                  {form.formState.errors.experience && (
                    <p className="text-sm text-red-500">{form.formState.errors.experience.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea 
                  id="bio" 
                  {...form.register("bio")} 
                  placeholder="Describe your professional background, education, and expertise..." 
                  className="min-h-[150px]" 
                />
                {form.formState.errors.bio && (
                  <p className="text-sm text-red-500">{form.formState.errors.bio.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 4: Services & Final Details */}
      {currentStep === 4 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Step 4: Services & Agreement</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="block mb-2">Select Services You Offer *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`service-${service.id}`}
                        onCheckedChange={(checked) => {
                          const currentServices = form.getValues("selectedServices");
                          const updatedServices = checked 
                            ? [...currentServices, service.id]
                            : currentServices.filter(id => id !== service.id);
                          form.setValue("selectedServices", updatedServices);
                        }}
                      />
                      <div>
                        <Label 
                          htmlFor={`service-${service.id}`} 
                          className="cursor-pointer font-medium"
                        >
                          {service.name}
                        </Label>
                        {service.description && (
                          <p className="text-sm text-gray-500">{service.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {form.formState.errors.selectedServices && (
                  <p className="text-sm text-red-500">{form.formState.errors.selectedServices.message}</p>
                )}
              </div>
              
              <div className="flex items-start space-x-2 pt-4">
                <Checkbox
                  id="terms"
                  checked={form.watch("termsAccepted")}
                  onCheckedChange={(checked) => form.setValue("termsAccepted", !!checked)}
                />
                <div>
                  <Label 
                    htmlFor="terms" 
                    className="cursor-pointer font-medium"
                  >
                    I agree to the Terms and Conditions *
                  </Label>
                  <p className="text-sm text-gray-500">
                    By checking this box, I confirm that I have read and agree to the platform's terms and conditions.
                  </p>
                  {form.formState.errors.termsAccepted && (
                    <p className="text-sm text-red-500">{form.formState.errors.termsAccepted.message}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between">
        {currentStep > 1 && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep}
            disabled={isSubmitting}
          >
            Previous
          </Button>
        )}
        
        {currentStep < 4 ? (
          <Button 
            type="button" 
            onClick={nextStep}
            className="ml-auto"
          >
            Next
          </Button>
        ) : (
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="ml-auto bg-ifind-aqua hover:bg-ifind-teal"
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
        )}
      </div>
      
      <div className="text-center text-sm text-gray-500">
        Step {currentStep} of 4
      </div>
    </form>
  );
};

export default ExpertRegistrationForm;

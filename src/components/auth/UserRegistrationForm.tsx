import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, User, Mail, Phone, Calendar, MapPin, Users, Shield } from 'lucide-react';

// Comprehensive registration schema
const registrationSchema = z.object({
  // Basic Information
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  
  // Personal Details
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().optional(),
  occupation: z.string().optional(),
  
  // Location
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  
  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  
  // Preferences
  currency: z.string().default('USD'),
  
  // Legal Agreements
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
  privacyAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the privacy policy'
  }),
  marketingConsent: z.boolean().default(false),
  
  // Notifications
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface UserRegistrationFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      currency: 'USD',
      termsAccepted: false,
      privacyAccepted: false,
      marketingConsent: false,
      emailNotifications: true,
      smsNotifications: false,
    },
  });

  const handleSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      // Create user account
      const { error: authError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: data.name,
            phone: data.phone,
            country: data.country,
            city: data.city,
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Create user record with extended profile data
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            country: data.country,
            city: data.city,
            currency: data.currency,
            date_of_birth: data.dateOfBirth,
            gender: data.gender,
            occupation: data.occupation,
            terms_accepted: data.termsAccepted,
            privacy_accepted: data.privacyAccepted,
            marketing_consent: data.marketingConsent,
            preferences: {
              notifications: {
                email: data.emailNotifications,
                sms: data.smsNotifications,
              }
            }
          });

        if (userError) {
          console.error('User profile creation error:', userError);
          // Don't throw here as auth account was created successfully
        }

        // Create notification preferences
        try {
          await supabase
            .from('user_notification_preferences')
            .insert({
              user_id: authData.user.id,
              email_notifications: data.emailNotifications,
              sms_notifications: data.smsNotifications,
              booking_confirmations: true,
              appointment_reminders: true,
              expert_messages: true,
              promotional_emails: data.marketingConsent,
            });
        } catch (notifError) {
          console.error('Notification preferences error:', notifError);
        }
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      onSuccess?.();
      
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof RegistrationFormData)[] => {
    switch (step) {
      case 1:
        return ['name', 'email', 'phone', 'password', 'confirmPassword'];
      case 2:
        return ['dateOfBirth', 'gender', 'occupation', 'country', 'city'];
      case 3:
        return ['emergencyContactName', 'emergencyContactPhone', 'currency'];
      case 4:
        return ['termsAccepted', 'privacyAccepted'];
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Personal Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your occupation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Emergency Contact & Preferences</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact person name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact person phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Currency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <h4 className="font-medium">Notification Preferences</h4>
              
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Email Notifications</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smsNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>SMS Notifications</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Terms & Conditions</h3>
            </div>

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the <a href="/terms" className="text-primary underline">Terms and Conditions</a> *
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="privacyAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the <a href="/privacy" className="text-primary underline">Privacy Policy</a> *
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I consent to receive marketing communications and promotional offers
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Create Your Account</CardTitle>
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-2 rounded-full ${
                  i + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-center text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {renderStepContent()}
            
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserRegistrationForm;
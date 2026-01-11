import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, User, Mail, Phone, Calendar, MapPin, Shield, Globe, Gift, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { processReferralCode } from '@/utils/referralUtils';
import { ReferralSettings } from '@/types/supabase';
import { passwordSchema, emailSchema } from '@/utils/validationSchemas';
// TODO: Re-implement pricing hooks
// import { useIPBasedPricing } from '@/hooks/call/useIPBasedPricing';
// import { useUserCurrency } from '@/hooks/call/useUserCurrency';

// Comprehensive registration schema
const registrationSchema = z.object({
  // Basic Information
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: passwordSchema,
  confirmPassword: z.string(),
  
  // Personal Details
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().optional(),
  occupation: z.string().optional(),
  
  // Location
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  
  // Preferences (currency removed)
  
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
  
  // Referral
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface SinglePageUserRegistrationFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  initialReferralCode?: string | null;
  referralSettings?: ReferralSettings | null;
}

const SinglePageUserRegistrationForm: React.FC<SinglePageUserRegistrationFormProps> = ({ 
  onSuccess, 
  onError,
  initialReferralCode,
  referralSettings
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [resendingEmail, setResendingEmail] = useState(false);
  // TODO: Re-implement pricing logic
  // const pricing = useIPBasedPricing();
  const pricing = { currency: 'INR', pricePerMinute: 30 }; // Default pricing

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      // strings
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      gender: '',
      occupation: '',
      country: '',
      city: '',
      // booleans
      termsAccepted: false,
      privacyAccepted: false,
      marketingConsent: false,
      emailNotifications: true,
      smsNotifications: false,
      // referral
      referralCode: initialReferralCode || '',
    },
  });

  const handleSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    
    try {
      // Use auth-callback route for proper email verification handling
      const redirectUrl = `${window.location.origin}/auth-callback?type=user`;
      
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

      console.log('authData', authData);
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
            currency: data.country && (data.country.toLowerCase() === 'india' || data.country.toLowerCase() === 'in') ? 'INR' : 'EUR', // INR for India, EUR for rest
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

        // Process referral code if provided and referral program is active
        if (data.referralCode && data.referralCode.trim()) {
          try {
            // Check if referral program is active before processing
            if (!referralSettings?.active) {
              console.log('Referral program is disabled, skipping referral processing');
            } else {
              console.log('Processing referral code:', data.referralCode);
              const referralSuccess = await processReferralCode(data.referralCode.trim(), authData.user.id);
              if (referralSuccess) {
                console.log('Referral processed successfully');
                toast.success('Referral code applied successfully!');
              } else {
                console.warn('Referral processing failed, but registration continues');
                toast.warning('Invalid referral code, but registration was successful');
              }
            }
          } catch (referralError) {
            console.error('Referral processing error:', referralError);
            // Don't fail registration if referral processing fails
            toast.warning('Could not process referral code, but registration was successful');
          }
        }
      }

      // Check if email was actually sent (user created but email might not be sent)
      // If email confirmation is required, user.email_confirmed_at will be null
      // If email send failed, we should still show dialog but with a warning
      const emailSent = authData.user && !authError;
      
      // Show verification dialog only if user was created
      if (authData.user) {
        setUserEmail(data.email);
        setShowVerificationDialog(true);
        onSuccess?.();
      } else {
        // This shouldn't happen, but handle it gracefully
        toast.error('Registration failed. Please try again.');
        onError?.('Registration failed');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
        <p className="text-muted-foreground">Join iFindLife and connect with expert therapists</p>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8" autoComplete="off">
            
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} value={field.value ?? ''} />
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
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          autoComplete="off"
                          {...field} 
                          value={field.value ?? ''} 
                        />
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
                        <Input placeholder="Enter your phone number" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Create password" 
                          autoComplete="new-password"
                          {...field} 
                          value={field.value ?? ''} 
                        />
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
                        <Input 
                          type="password" 
                          placeholder="Confirm password" 
                          autoComplete="new-password"
                          {...field} 
                          value={field.value ?? ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Personal Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
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

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your occupation" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Location</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your country" {...field} value={field.value ?? ''} />
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
                        <Input placeholder="Enter your city" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Preferences Section - Hidden */}
            {/* <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Preferences</h3>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Notification Preferences</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
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
                          <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>SMS Notifications</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div> */}

            {/* Referral Section - Only show if referral program is active */}
            {(initialReferralCode || (referralSettings && referralSettings.active)) && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Referral Code</h3>
                </div>

                <FormField
                  control={form.control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Referral Code (Optional)</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Gift className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <FormControl>
                          <Input placeholder="Enter referral code" className="pl-10" {...field} value={field.value ?? ''} />
                        </FormControl>
                      </div>
                      
                      {referralSettings && referralSettings.active && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center p-2 bg-primary/5 rounded-md">
                          <Gift className="h-3 w-3 mr-1 text-primary" />
                          {referralSettings.description || `Get $${referralSettings.referred_reward} credit when you sign up with a referral code!`}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Terms & Conditions Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Terms & Conditions</h3>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I accept the <a href="/terms" className="text-primary underline" target="_blank">Terms and Conditions</a> *
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privacyAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I accept the <a href="/privacy" className="text-primary underline" target="_blank">Privacy Policy</a> *
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketingConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
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
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-12 text-lg font-semibold"
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Create My Account
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
    <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Registration Successful!</DialogTitle>
          <DialogDescription className="text-center pt-2">
            We've sent a verification email to <strong>{userEmail}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Please verify your email to activate your account:</strong>
            </p>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Check your email inbox</li>
              <li>Look in spam/junk folder if not found</li>
              <li>Click the verification link in the email</li>
              <li>You'll be redirected automatically after verification</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> You won't be able to access your account until you verify your email address.
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button 
            variant="outline"
            onClick={async () => {
              if (!userEmail) return;
              setResendingEmail(true);
              try {
                const { error } = await supabase.auth.resend({
                  type: 'signup',
                  email: userEmail,
                  options: {
                    emailRedirectTo: `${window.location.origin}/auth-callback?type=user`
                  }
                });
                if (error) {
                  toast.error('Failed to resend verification email: ' + error.message);
                } else {
                  toast.success('Verification email sent! Please check your inbox.');
                }
              } catch (error) {
                toast.error('An unexpected error occurred. Please try again.');
              } finally {
                setResendingEmail(false);
              }
            }}
            disabled={resendingEmail}
            className="w-full sm:w-auto"
          >
            {resendingEmail ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend Email
              </>
            )}
          </Button>
          <Button 
            onClick={async () => {
              setShowVerificationDialog(false);
              // Sign out user since email is not verified yet
              await supabase.auth.signOut();
              navigate('/user-login');
            }} 
            className="w-full sm:w-auto"
          >
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default SinglePageUserRegistrationForm;
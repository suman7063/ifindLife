import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, MapPin, Briefcase, Shield } from 'lucide-react';
import { expertFormSchema, ExpertFormValues } from '@/components/expert/schemas/expertFormSchema';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ExpertRegister: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      expertCategory: 'listening-volunteer',
      captchaAnswer: 0,
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: ExpertFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/expert-login?status=pending`,
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create expert account
      const { error: expertError } = await supabase
        .from('expert_accounts')
        .insert({
          auth_id: authData.user.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          specialization: data.title,
          experience: data.experience.toString(),
          bio: data.bio,
          status: 'pending',
        });

      if (expertError) {
        throw new Error(expertError.message);
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/expert-login?status=pending');
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const specialtyOptions = [
    'Mindful Listening',
    'Anxiety & Stress',
    'Depression',
    'Relationships',
    'Career Guidance',
    'Life Coaching',
    'Trauma Recovery',
    'Addiction Recovery',
    'Family Therapy',
    'Mindfulness & Meditation',
    'Spiritual Counseling',
  ];

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    const current = form.getValues('specialties');
    if (checked) {
      form.setValue('specialties', [...current, specialty]);
    } else {
      form.setValue('specialties', current.filter(s => s !== specialty));
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <Container className="max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Join as an Expert</CardTitle>
              <p className="text-gray-600">Create your expert profile to start helping others</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {submitError && (
                  <Alert variant="destructive">
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <User className="h-5 w-5" />
                    Personal Information
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        {...form.register('name')}
                        className={form.formState.errors.name ? 'border-red-500' : ''}
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register('email')}
                        className={form.formState.errors.email ? 'border-red-500' : ''}
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...form.register('phone')}
                      className={form.formState.errors.phone ? 'border-red-500' : ''}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Address Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      {...form.register('address')}
                      className={form.formState.errors.address ? 'border-red-500' : ''}
                    />
                    {form.formState.errors.address && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        {...form.register('city')}
                        className={form.formState.errors.city ? 'border-red-500' : ''}
                      />
                      {form.formState.errors.city && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        {...form.register('state')}
                        className={form.formState.errors.state ? 'border-red-500' : ''}
                      />
                      {form.formState.errors.state && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.state.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        {...form.register('country')}
                        className={form.formState.errors.country ? 'border-red-500' : ''}
                      />
                      {form.formState.errors.country && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.country.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Professional Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Briefcase className="h-5 w-5" />
                    Professional Information
                  </div>

                  {/* Expert Category */}
                  <div>
                    <Label className="text-base font-medium">Expert Category *</Label>
                    <RadioGroup
                      value={form.watch('expertCategory')}
                      onValueChange={(value) => form.setValue('expertCategory', value as any)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="listening-volunteer" id="listening-volunteer" />
                        <Label htmlFor="listening-volunteer">Listening Volunteer (Entry level)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="listening-expert" id="listening-expert" />
                        <Label htmlFor="listening-expert">Listening Expert (Intermediate)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="listening-coach" id="listening-coach" />
                        <Label htmlFor="listening-coach">Listening Coach (Advanced)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mindfulness-expert" id="mindfulness-expert" />
                        <Label htmlFor="mindfulness-expert">Mindfulness Expert (Specialized)</Label>
                      </div>
                    </RadioGroup>
                    {form.formState.errors.expertCategory && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.expertCategory.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Professional Title *</Label>
                      <Input
                        id="title"
                        {...form.register('title')}
                        placeholder="e.g., Licensed Clinical Social Worker"
                        className={form.formState.errors.title ? 'border-red-500' : ''}
                      />
                      {form.formState.errors.title && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="experience">Years of Experience *</Label>
                      <Input
                        id="experience"
                        type="number"
                        {...form.register('experience', { valueAsNumber: true })}
                        className={form.formState.errors.experience ? 'border-red-500' : ''}
                      />
                      {form.formState.errors.experience && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.experience.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Specialties * (Select at least one)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {specialtyOptions.map((specialty) => (
                        <div key={specialty} className="flex items-center space-x-2">
                          <Checkbox
                            id={specialty}
                            checked={form.watch('specialties').includes(specialty)}
                            onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                          />
                          <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.specialties && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.specialties.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea
                      id="bio"
                      {...form.register('bio')}
                      placeholder="Tell us about your background, approach, and experience..."
                      rows={4}
                      className={form.formState.errors.bio ? 'border-red-500' : ''}
                    />
                    <p className="text-sm text-gray-500 mt-1">Minimum 50 characters</p>
                    {form.formState.errors.bio && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.bio.message}</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Account Security */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Shield className="h-5 w-5" />
                    Account Security
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        {...form.register('password')}
                        className={form.formState.errors.password ? 'border-red-500' : ''}
                      />
                      {form.formState.errors.password && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.password.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...form.register('confirmPassword')}
                        className={form.formState.errors.confirmPassword ? 'border-red-500' : ''}
                      />
                      {form.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="termsAccepted"
                      checked={form.watch('termsAccepted')}
                      onCheckedChange={(checked) => form.setValue('termsAccepted', checked as boolean)}
                    />
                    <Label htmlFor="termsAccepted" className="text-sm">
                      I accept the Terms and Conditions and Privacy Policy *
                    </Label>
                  </div>
                  {form.formState.errors.termsAccepted && (
                    <p className="text-sm text-red-500">{form.formState.errors.termsAccepted.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Expert Account'
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/expert-login')}
                    className="text-primary hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ExpertRegister;
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, MapPin, Briefcase, Shield, Upload, CheckCircle } from 'lucide-react';
import { expertFormSchema, ExpertFormValues } from '@/components/expert/schemas/expertFormSchema';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const ExpertRegistrationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // Generate CAPTCHA and fetch categories on component mount
  useEffect(() => {
    generateCaptcha();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('expert_categories')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to updated categories if fetch fails
      setCategories([
        { id: 'listening-volunteer', name: 'Listening Volunteer' },
        { id: 'listening-expert', name: 'Listening Expert' },
        { id: 'mindfulness-coach', name: 'Mindfulness Coach' },
        { id: 'mindfulness-expert', name: 'Mindfulness Expert' },
        { id: 'spiritual-mentor', name: 'Spiritual Mentor' },
      ]);
    }
  };

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
  };

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
      
      bio: '',
      expertCategory: 'listening-volunteer',
      captchaAnswer: 0,
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: ExpertFormValues) => {
    // Validate CAPTCHA
    if (data.captchaAnswer !== captchaQuestion.answer) {
      setSubmitError('CAPTCHA answer is incorrect. Please try again.');
      generateCaptcha();
      return;
    }

    if (!selectedFile) {
      setSubmitError('Please upload your Soulversity certificate.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback?type=expert`,
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Important: Sign out immediately after registration since experts need approval
      await supabase.auth.signOut();

      // Upload certificate to storage
      let certificateUrl = '';
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${authData.user.id}-certificate.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('expert-certificates')
          .upload(fileName, selectedFile);

        if (uploadError) {
          throw new Error('Failed to upload certificate: ' + uploadError.message);
        }

        certificateUrl = uploadData.path;
      }

      // Upload profile picture to storage if provided
      let profilePictureUrl = '';
      if (selectedProfilePicture) {
        const fileExt = selectedProfilePicture.name.split('.').pop();
        const fileName = `${authData.user.id}-profile.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, selectedProfilePicture);

        if (uploadError) {
          throw new Error('Failed to upload profile picture: ' + uploadError.message);
        }

        profilePictureUrl = uploadData.path;
      }

      // Create expert account with category and profile picture
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
          certificate_urls: certificateUrl ? [certificateUrl] : [],
          profile_picture: profilePictureUrl || null,
          category: data.expertCategory,
          status: 'pending',
          onboarding_completed: false,
          pricing_set: false,
          availability_set: false,
          profile_completed: false,
        });

      if (expertError) {
        throw new Error(expertError.message);
      }

      // Show success message and prevent auto-login
      toast.success('Expert account created successfully! Please verify your email, then wait for admin approval before logging in.');
      setIsSuccess(true);
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (accept PDF, JPG, PNG)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, JPG, or PNG file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB.');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (only images)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a JPG or PNG image file.');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB.');
        return;
      }
      
      setSelectedProfilePicture(file);
    }
  };

  // Show success message if registration completed
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Registration Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Thank you for registering as an expert with us. Your application has been submitted successfully.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">What happens next?</p>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• We will review your application and certificate</li>
                <li>• You will receive an email notification about your approval status</li>
                <li>• Please wait for admin approval before attempting to log in</li>
                <li>• This process typically takes 1-3 business days</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">
              You can close this window now. We'll contact you via email once your account is approved.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.id} id={category.id} />
                  <Label htmlFor={category.id}>{category.name}</Label>
                </div>
              ))}
            </RadioGroup>
            {form.formState.errors.expertCategory && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.expertCategory.message}</p>
            )}
          </div>

          {/* Certificate Upload */}
          <div>
            <Label className="text-base font-medium">Upload Proof (Soulversity Certificate) *</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <Label htmlFor="certificate" className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80">
                  Choose file to upload
                </Label>
                <Input
                  id="certificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500">PDF, JPG, or PNG files up to 5MB</p>
                {selectedFile && (
                  <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                    ✓ {selectedFile.name} selected
                  </div>
                )}
              </div>
            </div>
            {form.formState.errors.certificate && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.certificate.message}</p>
            )}
          </div>

          {/* Profile Picture Upload */}
          <div>
            <Label className="text-base font-medium">Profile Picture (Optional)</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <div className="space-y-2">
                <Label htmlFor="profilePicture" className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80">
                  Choose profile picture
                </Label>
                <Input
                  id="profilePicture"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500">JPG or PNG files up to 2MB</p>
                {selectedProfilePicture && (
                  <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                    ✓ {selectedProfilePicture.name} selected
                  </div>
                )}
              </div>
            </div>
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

        {/* CAPTCHA Verification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Shield className="h-5 w-5" />
            Security Verification
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-base font-medium">CAPTCHA Verification *</Label>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-lg font-mono bg-white p-3 rounded border-2 border-gray-200">
                {captchaQuestion.num1} + {captchaQuestion.num2} = ?
              </div>
              <Input
                type="number"
                placeholder="Answer"
                {...form.register('captchaAnswer', { valueAsNumber: true })}
                className="w-24"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={generateCaptcha}
              >
                Refresh
              </Button>
            </div>
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
      </form>
    </div>
  );
};

export default ExpertRegistrationForm;
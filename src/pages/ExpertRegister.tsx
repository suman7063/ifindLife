import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { Loader2, User, MapPin, Briefcase, Shield, Upload, Image as ImageIcon, FileText, Eye, ExternalLink } from 'lucide-react';
import { expertFormSchema, ExpertFormValues } from '@/components/expert/schemas/expertFormSchema';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ExpertRegister: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<File | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [existingProfilePicture, setExistingProfilePicture] = useState<string | null>(null);
  const [existingCertificates, setExistingCertificates] = useState<string[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isUpdateMode = searchParams.get('update') === 'true';
  const authId = searchParams.get('auth_id');

  // Get pre-filled values - fetch from database if update mode
  const getDefaultValues = (): ExpertFormValues => {
    return {
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
      languages: 'English',
      captchaAnswer: 0,
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    };
  };

  // Create a conditional schema that makes password optional in update mode
  const getFormSchema = () => {
    if (isUpdateMode) {
      // Create a new schema with optional passwords for update mode
      return z.object({
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
        languages: z.string().min(1, "Please specify languages you speak"),
        
        bio: z.string().min(50, "Bio should be at least 50 characters"),
        expertCategory: z.enum(["listening-volunteer", "listening-expert", "listening-coach", "mindfulness-expert"], {
          required_error: "Please select an expert category",
        }),
        
        // CAPTCHA
        captchaAnswer: z.number(),
        
        // Account - passwords are optional in update mode
        password: z.string().optional(),
        confirmPassword: z.string().optional(),
        termsAccepted: z.boolean().refine(value => value === true, {
          message: "You must accept the terms and conditions",
        }),
      }).refine((data) => {
        // In update mode, passwords are optional, but if provided, they must match
        if (data.password || data.confirmPassword) {
          return data.password === data.confirmPassword;
        }
        return true;
      }, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
    return expertFormSchema;
  };

  const form = useForm<ExpertFormValues>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: getDefaultValues(),
  });

  // Fetch existing expert data for update mode using auth_id
  useEffect(() => {
    const fetchExistingData = async () => {
      if (isUpdateMode && authId) {
        setIsLoadingData(true);
        try {
          const { data: expertData, error } = await supabase
            .from('expert_accounts')
            .select('*')
            .eq('auth_id', authId)
            .eq('status', 'rejected')
            .maybeSingle();

          if (error) {
            console.error('Error fetching expert data:', error);
            toast.error('Failed to load expert data. Please contact support.');
            setIsLoadingData(false);
            return;
          }

          if (!expertData) {
            toast.error('Expert account not found or not rejected.');
            navigate('/expert-login');
            return;
          }

          // Pre-fill form with expert data
          form.setValue('name', expertData.name || '');
          form.setValue('email', expertData.email || '');
          form.setValue('phone', expertData.phone || '');
          form.setValue('address', expertData.address || '');
          form.setValue('city', expertData.city || '');
          form.setValue('state', expertData.state || '');
          form.setValue('country', expertData.country || '');
          form.setValue('title', expertData.specialization || '');
          form.setValue('experience', parseInt(expertData.experience || '0', 10));
          form.setValue('bio', expertData.bio || '');
          form.setValue('expertCategory', (expertData.category as 'listening-volunteer' | 'listening-expert' | 'listening-coach' | 'mindfulness-expert') || 'listening-volunteer');
          form.setValue('languages', Array.isArray(expertData.languages) ? expertData.languages.join(', ') : (expertData.languages || 'English'));

          // Set profile picture and certificates
          if (expertData.profile_picture) {
            setExistingProfilePicture(expertData.profile_picture);
          }
          if (expertData.certificate_urls && Array.isArray(expertData.certificate_urls)) {
            setExistingCertificates(expertData.certificate_urls);
          }

          setIsLoadingData(false);
        } catch (error) {
          console.error('Error fetching existing data:', error);
          toast.error('Failed to load expert data.');
          setIsLoadingData(false);
        }
      }
    };

    fetchExistingData();
  }, [isUpdateMode, authId, form, navigate]);


  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a JPG, PNG, or WEBP image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB.');
        return;
      }
      setSelectedProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, JPG, or PNG file.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB.');
        return;
      }
      setSelectedCertificate(file);
    }
  };

  const onSubmit = async (data: ExpertFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (isUpdateMode) {
        // Update existing expert account using auth_id
        if (!authId) {
          throw new Error('Expert ID not found. Please contact support.');
        }

        // Verify the expert account exists and is rejected
        const { data: existingExpert, error: findError } = await supabase
          .from('expert_accounts')
          .select('auth_id, email, status')
          .eq('auth_id', authId)
          .maybeSingle();

        if (findError) {
          throw new Error(`Failed to find expert account: ${findError.message}`);
        }

        if (!existingExpert) {
          throw new Error('Expert account not found. Please contact support.');
        }

        if (existingExpert.status !== 'rejected') {
          throw new Error('This account is not in rejected status. Please contact support.');
        }

        // Upload profile picture if new one is selected
        let profilePictureUrl = existingProfilePicture;
        if (selectedProfilePicture) {
          const fileExt = selectedProfilePicture.name.split('.').pop() || 'jpg';
          const fileName = `${authId}-profile-${Date.now()}.${fileExt}`;
          
          console.log('Uploading profile picture:', { fileName, authId, fileSize: selectedProfilePicture.size });
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, selectedProfilePicture, { 
              upsert: true,
              cacheControl: '3600'
            });

          if (uploadError) {
            console.error('Profile picture upload error:', uploadError);
            throw new Error(`Failed to upload profile picture: ${uploadError.message}`);
          }

          console.log('Profile picture uploaded successfully:', uploadData.path);
          profilePictureUrl = uploadData.path;
        }

        // Upload certificate if new one is selected
        let certificateUrls = existingCertificates;
        if (selectedCertificate) {
          const fileExt = selectedCertificate.name.split('.').pop() || 'pdf';
          const fileName = `${authId}-certificate-${Date.now()}.${fileExt}`;
          
          console.log('Uploading certificate:', { fileName, authId, fileSize: selectedCertificate.size });
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('expert-certificates')
            .upload(fileName, selectedCertificate, {
              cacheControl: '3600'
            });

          if (uploadError) {
            console.error('Certificate upload error:', uploadError);
            throw new Error(`Failed to upload certificate: ${uploadError.message}`);
          }

          console.log('Certificate uploaded successfully:', uploadData.path);
          // Add new certificate to existing ones
          certificateUrls = [...existingCertificates, uploadData.path];
        }

        // Update the expert account
        const updateData: {
          name: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          country: string;
          specialization: string;
          experience: string;
          bio: string;
          category: string;
          status: string;
          feedback_message: null;
          profile_picture?: string;
          certificate_urls?: string[];
        } = {
          name: data.name,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          specialization: data.title,
          experience: data.experience.toString(),
          bio: data.bio,
          category: data.expertCategory,
          status: 'pending', // Reset to pending for re-review
          feedback_message: null, // Clear feedback message
        };

        // Update profile picture if changed
        if (profilePictureUrl && profilePictureUrl !== existingProfilePicture) {
          updateData.profile_picture = profilePictureUrl;
        }

        // Update certificates if changed
        if (selectedCertificate) {
          updateData.certificate_urls = certificateUrls;
        }

        // Note: Email is disabled in update mode, so we don't update it
        // If email needs to be changed, expert should contact support

        console.log('Updating expert account:', { authId, updateData });
        
        // Verify the account is still rejected before updating
        const { data: verifyData, error: verifyError } = await supabase
          .from('expert_accounts')
          .select('auth_id, status')
          .eq('auth_id', authId)
          .eq('status', 'rejected')
          .maybeSingle();

        if (verifyError) {
          console.error('Verification error:', verifyError);
          throw new Error(`Failed to verify expert account: ${verifyError.message}`);
        }

        if (!verifyData) {
          throw new Error('Expert account not found or not in rejected status. Please contact support.');
        }

        // Now perform the update
        const { data: updatedData, error: updateError } = await supabase
          .from('expert_accounts')
          .update(updateData)
          .eq('auth_id', authId)
          .eq('status', 'rejected') // Only update if still rejected
          .select();

        if (updateError) {
          console.error('Update error details:', updateError);
          throw new Error(`Failed to update profile: ${updateError.message}`);
        }

        if (!updatedData || updatedData.length === 0) {
          console.error('No rows updated - RLS policy may be blocking');
          throw new Error('Failed to update profile: Update was blocked. Please contact support.');
        }

        console.log('Expert account updated successfully:', updatedData);
        toast.success('Profile updated successfully! Your application has been resubmitted for review.');
        navigate('/expert-login?status=pending');
        return;
      }

      // Create new auth user (original registration flow) with email verification enabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback?type=expert`,
          data: {
            user_type: 'expert',
            name: data.name,
          },
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
          category: data.expertCategory,
          status: 'pending',
        });

      if (expertError) {
        throw new Error(expertError.message);
      }

      // Note: Welcome email will be sent when onboarding is completed, not during registration
      // Sign out after registration since experts need approval
      await supabase.auth.signOut();

      toast.success('Registration successful! Please verify your email, then wait for admin approval before logging in.');
      navigate('/expert-login?status=pending');
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <Container className="max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isUpdateMode ? 'Update Your Expert Profile' : 'Join as an Expert'}
              </CardTitle>
              <p className="text-gray-600">
                {isUpdateMode 
                  ? 'Update your profile information and resubmit for approval'
                  : 'Create your expert profile to start helping others'}
              </p>
            </CardHeader>
            <CardContent>
              {isLoadingData && isUpdateMode ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-gray-600">Loading your profile data...</span>
                </div>
              ) : (
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
                        disabled={isUpdateMode}
                        title={isUpdateMode ? 'Email cannot be changed. Contact support if you need to change your email.' : ''}
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
                      )}
                      {isUpdateMode && (
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed. Contact support if needed.</p>
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

                  {/* Profile Picture Upload */}
                  <div>
                    <Label htmlFor="profilePicture">Profile Picture {!isUpdateMode && '*'}</Label>
                    <div className="mt-2 flex items-center gap-4">
                      {(profilePicturePreview || existingProfilePicture) && (
                        <div className="relative">
                          <img
                            src={profilePicturePreview || (existingProfilePicture?.startsWith('http') 
                              ? existingProfilePicture 
                              : supabase.storage.from('avatars').getPublicUrl(existingProfilePicture || '').data.publicUrl)}
                            alt="Profile preview"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <label
                          htmlFor="profilePicture"
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <ImageIcon className="h-4 w-4" />
                          <span className="text-sm">
                            {selectedProfilePicture ? selectedProfilePicture.name : existingProfilePicture ? 'Change Picture' : 'Upload Picture'}
                          </span>
                          <Upload className="h-4 w-4" />
                        </label>
                        <input
                          id="profilePicture"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WEBP (max 5MB)</p>
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
                      onValueChange={(value) => form.setValue('expertCategory', value as 'listening-volunteer' | 'listening-expert' | 'listening-coach' | 'mindfulness-expert')}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="listening-volunteer" id="listening-volunteer" />
                        <Label htmlFor="listening-volunteer">Listening Volunteer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="listening-expert" id="listening-expert" />
                        <Label htmlFor="listening-expert">Listening Expert</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="listening-coach" id="listening-coach" />
                        <Label htmlFor="listening-coach">Listening Coach</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mindfulness-expert" id="mindfulness-expert" />
                        <Label htmlFor="mindfulness-expert">Mindfulness Expert</Label>
                      </div>
                      {/* Removed unsupported category 'spiritual-mentor' to match DB constraint */}
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

                  {/* Certificate Upload */}
                  <div>
                    <Label htmlFor="certificate">Upload Proof/Certificate {!isUpdateMode && '*'}</Label>
                    <div className="mt-2">
                      {existingCertificates.length > 0 && !selectedCertificate && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-3">Existing certificates:</p>
                          <div className="space-y-2">
                            {existingCertificates.map((cert, index) => {
                              // Get public URL for certificate
                              const certUrl = cert.startsWith('http') 
                                ? cert 
                                : supabase.storage.from('expert-certificates').getPublicUrl(cert).data.publicUrl;
                              
                              const isImage = cert.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i);
                              const isPdf = cert.toLowerCase().includes('.pdf');
                              
                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-gray-600" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Certificate {index + 1}</p>
                                      <p className="text-xs text-gray-500">
                                        {isPdf ? 'PDF Document' : isImage ? 'Image File' : 'Document'}
                                      </p>
                                    </div>
                                  </div>
                                  <a
                                    href={certUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:text-primary/80 hover:bg-primary/10 rounded-md transition-colors"
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span>View</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <label
                        htmlFor="certificate"
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">
                          {selectedCertificate ? selectedCertificate.name : existingCertificates.length > 0 ? 'Upload New Certificate' : 'Upload Certificate'}
                        </span>
                        <Upload className="h-4 w-4" />
                      </label>
                      <input
                        id="certificate"
                        type="file"
                        accept="application/pdf,image/jpeg,image/png,image/jpg"
                        onChange={handleCertificateChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (max 10MB)</p>
                    {isUpdateMode && (
                      <p className="text-xs text-blue-600 mt-1">Upload a new certificate to replace existing ones</p>
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
                  
                  {!isUpdateMode && (
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
                  )}
                  {isUpdateMode && (
                    <Alert>
                      <AlertDescription>
                        Note: To change your password, please use the "Forgot Password" link on the login page.
                      </AlertDescription>
                    </Alert>
                  )}

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
                      {isUpdateMode ? 'Updating Profile...' : 'Creating Account...'}
                    </>
                  ) : (
                    isUpdateMode ? 'Update and Resubmit Profile' : 'Create Expert Account'
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
              )}
            </CardContent>
          </Card>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ExpertRegister;
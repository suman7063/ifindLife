
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ProfilePage: React.FC = () => {
  const { expertProfile, updateExpertProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    specialization: '',
    experience: '',
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [newCertificate, setNewCertificate] = useState<File | null>(null);
  
  // Initialize form data from profile
  useEffect(() => {
    if (expertProfile) {
      setFormData({
        name: expertProfile.name || '',
        email: expertProfile.email || '',
        phone: expertProfile.phone || '',
        address: expertProfile.address || '',
        city: expertProfile.city || '',
        state: expertProfile.state || '',
        country: expertProfile.country || '',
        specialization: expertProfile.specialization || '',
        experience: expertProfile.experience?.toString() || '',
        bio: expertProfile.bio || ''
      });
      
      // Set certificates if any
      if (expertProfile.certificate_urls && Array.isArray(expertProfile.certificate_urls)) {
        setCertificates(expertProfile.certificate_urls);
      }
    }
  }, [expertProfile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };
  
  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCertificate(e.target.files[0]);
    }
  };
  
  const uploadProfileImage = async (): Promise<string | null> => {
    if (!profileImage || !expertProfile?.id) return null;
    
    try {
      const fileExt = profileImage.name.split('.').pop();
      const filePath = `experts/${expertProfile.id}/profile-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('expert-profiles')
        .upload(filePath, profileImage);
        
      if (uploadError) {
        console.error('Error uploading profile image:', uploadError);
        return null;
      }
      
      const { data } = supabase.storage.from('expert-profiles').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return null;
    }
  };
  
  const uploadCertificate = async (): Promise<string | null> => {
    if (!newCertificate || !expertProfile?.id) return null;
    
    try {
      const fileExt = newCertificate.name.split('.').pop();
      const filePath = `experts/${expertProfile.id}/certificate-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('expert-certificates')
        .upload(filePath, newCertificate);
        
      if (uploadError) {
        console.error('Error uploading certificate:', uploadError);
        return null;
      }
      
      const { data } = supabase.storage.from('expert-certificates').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading certificate:', error);
      return null;
    }
  };
  
  const handleAddCertificate = async () => {
    if (!newCertificate) return;
    
    setIsLoading(true);
    try {
      const certificateUrl = await uploadCertificate();
      if (certificateUrl) {
        const newCertificates = [...certificates, certificateUrl];
        setCertificates(newCertificates);
        
        // Update in database
        if (updateExpertProfile && expertProfile) {
          await updateExpertProfile({
            certificate_urls: newCertificates
          });
        }
        
        toast.success('Certificate added successfully');
        setNewCertificate(null);
      }
    } catch (error) {
      console.error('Error adding certificate:', error);
      toast.error('Failed to add certificate');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveCertificate = async (url: string) => {
    try {
      const newCertificates = certificates.filter(cert => cert !== url);
      setCertificates(newCertificates);
      
      // Update in database
      if (updateExpertProfile && expertProfile) {
        await updateExpertProfile({
          certificate_urls: newCertificates
        });
      }
      
      toast.success('Certificate removed successfully');
    } catch (error) {
      console.error('Error removing certificate:', error);
      toast.error('Failed to remove certificate');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateExpertProfile || !expertProfile) return;
    
    setIsLoading(true);
    try {
      // Upload profile image if changed
      let profilePictureUrl = expertProfile.profile_picture;
      if (profileImage) {
        const uploadedUrl = await uploadProfileImage();
        if (uploadedUrl) {
          profilePictureUrl = uploadedUrl;
        }
      }
      
      // Prepare update data
      const updateData = {
        ...formData,
        profile_picture: profilePictureUrl
      };
      
      await updateExpertProfile(updateData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Professional Profile</h1>
      
      <Tabs defaultValue="basic-info">
        <TabsList className="mb-4">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="professional">Professional Details</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="basic-info">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      {profileImage ? (
                        <AvatarImage src={URL.createObjectURL(profileImage)} />
                      ) : (
                        <AvatarImage src={expertProfile?.profile_picture || ''} />
                      )}
                      <AvatarFallback>{formData.name.charAt(0) || 'E'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="profile-image" className="cursor-pointer">
                        <div className="flex items-center space-x-2 text-sm text-primary">
                          <Upload className="h-4 w-4" />
                          <span>Upload new image</span>
                        </div>
                      </Label>
                      <Input 
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF, max 4MB
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>
                  Update your professional details and expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input 
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input 
                        id="experience"
                        name="experience"
                        type="number"
                        value={formData.experience}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea 
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell clients about your professional background, approach, and expertise..."
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Certificates & Credentials</CardTitle>
                <CardDescription>
                  Upload and manage your professional certificates and credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label>Add New Certificate</Label>
                    <div className="flex gap-2 mt-2">
                      <Input 
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={handleCertificateChange}
                      />
                      <Button 
                        type="button"
                        onClick={handleAddCertificate}
                        disabled={!newCertificate || isLoading}
                      >
                        Upload
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF or image files, max 4MB
                    </p>
                  </div>
                  
                  <div>
                    <Label>Uploaded Certificates</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {certificates.length > 0 ? certificates.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                          <a 
                            href={cert}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline truncate max-w-[80%]"
                          >
                            Certificate {index + 1}
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCertificate(cert)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )) : (
                        <p className="text-sm text-muted-foreground">
                          No certificates uploaded yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};

export default ProfilePage;

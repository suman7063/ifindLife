
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Edit, Save, X } from 'lucide-react';
import { ExpertRepository } from '@/repositories/expertRepository';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { expert: expertProfile } = useSimpleAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: expertProfile?.name || '',
    specialization: expertProfile?.specialization || '',
    bio: expertProfile?.bio || '',
    experience: expertProfile?.experience || '',
    phone: expertProfile?.phone || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !expertProfile?.id) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${expertProfile.auth_id}-profile.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path);
      
      const profilePictureUrl = urlData.publicUrl;

      // Update expert profile
      const result = await ExpertRepository.update(expertProfile.id, {
        profile_picture: profilePictureUrl
      });

      if (result) {
        toast.success('Profile picture updated successfully');
        // Refresh the page to show updated image
        window.location.reload();
      } else {
        toast.error('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!expertProfile?.id) return;

    setLoading(true);
    try {
      const result = await ExpertRepository.update(expertProfile.id, formData);
      if (result) {
        toast.success('Profile updated successfully');
        setEditMode(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!expertProfile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p>No expert profile found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expert Profile</h1>
        <p className="text-gray-600 mt-1">Manage your professional profile</p>
      </div>

      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Upload a professional headshot</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage 
                src={expertProfile.profile_picture || ''} 
                alt={expertProfile.name || 'Expert'} 
              />
              <AvatarFallback className="text-lg">
                {getInitials(expertProfile.name || 'E')}
              </AvatarFallback>
            </Avatar>
            <label htmlFor="profile-image" className="absolute bottom-0 right-0 cursor-pointer">
              <div className="bg-primary text-white p-1 rounded-full">
                <Camera className="w-4 h-4" />
              </div>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureUpload}
                disabled={uploadingImage}
              />
            </label>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full max-w-xs"
            onClick={() => document.getElementById('profile-image')?.click()}
            disabled={uploadingImage}
          >
            {uploadingImage ? 'Uploading...' : 'Change Photo'}
          </Button>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your professional details and qualifications
              </CardDescription>
            </div>
            {!editMode && (
              <Button variant="outline" onClick={() => setEditMode(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editMode ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="e.g., Licensed Clinical Psychologist"
                />
              </div>
              
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 years"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Describe your background and approach..."
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-lg">{expertProfile.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p>{expertProfile.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Specialization</label>
                <p>{expertProfile.specialization || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Experience</label>
                <p>{expertProfile.experience || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <p>{expertProfile.phone || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <p>{expertProfile.bio || 'No bio provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <p className="capitalize">{expertProfile.status}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

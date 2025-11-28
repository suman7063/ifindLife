
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
import { clearExpertDataCache } from '@/hooks/useOptimizedExpertData';

const ProfilePage: React.FC = () => {
  const { expert: expertProfile, refreshProfiles, user } = useSimpleAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const hasManuallySetImage = React.useRef(false);
  const [formData, setFormData] = useState({
    name: expertProfile?.name || '',
    specialization: expertProfile?.specialization || '',
    bio: expertProfile?.bio || '',
    experience: expertProfile?.experience || '',
    phone: expertProfile?.phone || ''
  });

  // Initialize profileImageUrl from expertProfile only on mount or when expertProfile changes significantly
  React.useEffect(() => {
    // Don't override manually set image URL
    if (hasManuallySetImage.current) {
      return;
    }
    
    const imageUrl = expertProfile?.profile_picture || expertProfile?.profilePicture || null;
    if (imageUrl) {
      setProfileImageUrl(prev => {
        // If we don't have a local state yet, initialize it
        if (!prev) {
          return imageUrl;
        }
        // Remove cache busting parameter for comparison
        const prevClean = prev.split('?')[0];
        const newClean = imageUrl.split('?')[0];
        // Only update if the base URL actually changed (not just cache busting)
        if (prevClean !== newClean && newClean) {
          return imageUrl;
        }
        // Keep the current value (which might have cache busting)
        return prev;
      });
    } else {
      // Only set to null if we don't have a local state yet
      setProfileImageUrl(prev => prev || null);
    }
  }, [expertProfile?.profile_picture, expertProfile?.profilePicture]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !expertProfile?.auth_id) {
      // Clear input if no file selected
      event.target.value = '';
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      // Add timestamp to filename to avoid caching issues and ensure unique file
      const timestamp = Date.now();
      const fileName = `${expertProfile.auth_id}-profile-${timestamp}.${fileExt}`;
      
      console.log('Uploading file:', { fileName, fileSize: file.size, fileType: file.type });
      
      // Optionally delete old profile pictures (files matching pattern)
      try {
        const { data: oldFiles } = await supabase.storage
          .from('avatars')
          .list('', {
            search: `${expertProfile.auth_id}-profile`,
          });
        
        if (oldFiles && oldFiles.length > 0) {
          const filesToDelete = oldFiles
            .filter(f => f.name.startsWith(`${expertProfile.auth_id}-profile`) && f.name !== fileName)
            .map(f => f.name);
          
          if (filesToDelete.length > 0) {
            console.log('Deleting old profile pictures:', filesToDelete);
            await supabase.storage
              .from('avatars')
              .remove(filesToDelete);
          }
        }
      } catch (deleteError) {
        // Non-critical - continue even if deletion fails
        console.warn('Could not delete old profile pictures:', deleteError);
      }
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, uploadData:', uploadData);
      console.log('Upload path:', uploadData.path);
      console.log('Original fileName:', fileName);

      // Save only the path to database (consistent pattern)
      // Display will automatically convert path to URL using getProfilePictureUrl utility
      const profilePicturePath = uploadData.path;
      console.log('✅ Saving profile picture PATH to database:', profilePicturePath);
      
      // Get URL for display purposes (but save path to DB)
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(profilePicturePath);
      const profilePictureUrl = urlData.publicUrl;
      console.log('Generated URL for display:', profilePictureUrl);

      // Check current user auth
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      console.log('Current auth user ID:', currentUser?.id);
      console.log('Expert auth_id:', expertProfile.auth_id);
      console.log('Match check:', currentUser?.id === expertProfile.auth_id);

      // First, verify we can read the record (RLS check)
      const { data: existingRecord, error: readError } = await supabase
        .from('expert_accounts')
        .select('auth_id, profile_picture')
        .eq('auth_id', expertProfile.auth_id)
        .single();

      console.log('Existing record check:', { data: existingRecord, error: readError });

      if (readError) {
        console.error('Cannot read expert record - RLS issue:', readError);
        toast.error(`Cannot access record: ${readError.message}`);
        throw readError;
      }

      if (!existingRecord) {
        console.error('Expert record not found');
        toast.error('Expert record not found');
        throw new Error('Expert record not found');
      }

      // Update expert profile directly in database
      console.log('Updating expert profile with URL:', profilePictureUrl);
      console.log('Current profile_picture in DB:', existingRecord.profile_picture);
      console.log('Update query:', {
        table: 'expert_accounts',
        update: { profile_picture: profilePictureUrl },
        where: { auth_id: expertProfile.auth_id }
      });

      // Try update with expertProfile.auth_id first
      // Save PATH to database (consistent pattern)
      let updateError: { message: string; code?: string; details?: string; hint?: string } | null = null;
      let updatedData: { profile_picture?: string; [key: string]: unknown } | null = null;
      
      const updateResult = await supabase
        .from('expert_accounts')
        .update({ profile_picture: profilePicturePath })
        .eq('auth_id', expertProfile.auth_id)
        .select()
        .single();

      updateError = updateResult.error;
      updatedData = updateResult.data;

      console.log('Update result:', { error: updateError, data: updatedData });

      // If update failed and we have user.id, try with user.id as fallback
      if (updateError && user?.id && user.id !== expertProfile.auth_id) {
        console.log('Trying update with user.id as fallback:', user.id);
        const fallbackResult = await supabase
          .from('expert_accounts')
          .update({ profile_picture: profilePicturePath })
          .eq('auth_id', user.id)
          .select()
          .single();
        
        if (!fallbackResult.error && fallbackResult.data) {
          updateError = null;
          updatedData = fallbackResult.data;
          console.log('Fallback update successful:', updatedData);
        } else {
          console.error('Fallback update also failed:', fallbackResult.error);
        }
      }

      if (updateError) {
        console.error('Database update error details:', {
          message: updateError.message,
          code: updateError.code,
          details: updateError.details,
          hint: updateError.hint
        });
        toast.error(`Database update failed: ${updateError.message}`);
        throw updateError;
      }

      if (!updatedData) {
        console.error('No data returned from update - possible RLS policy issue');
        toast.error('Update completed but no data returned. Please check RLS policies.');
        throw new Error('No data returned from update');
      }

      if (updatedData) {
        console.log('Database updated successfully:', updatedData.profile_picture);
        
        // Verify the update by fetching the record again
        const { data: verifyData, error: verifyError } = await supabase
          .from('expert_accounts')
          .select('profile_picture, auth_id, name')
          .eq('auth_id', expertProfile.auth_id)
          .single();
        
        if (verifyError) {
          console.error('Verification error:', verifyError);
        } else {
          console.log('=== PATH VERIFICATION ===');
          console.log('Path we tried to save:', profilePicturePath);
          console.log('Path actually in database:', verifyData.profile_picture);
          console.log('Paths match:', profilePicturePath === verifyData.profile_picture);
          console.log('Expert:', verifyData.name, verifyData.auth_id);
          
          if (profilePicturePath !== verifyData.profile_picture) {
            console.error('❌ PATH MISMATCH!');
            console.error('Expected:', profilePicturePath);
            console.error('Got:', verifyData.profile_picture);
            toast.error('Path mismatch detected. Please check console for details.');
          } else {
            console.log('✅ Path matches correctly');
          }
        }
        
        // Update local state immediately for instant UI update with cache busting
        const cacheBustedUrl = `${profilePictureUrl}?t=${Date.now()}`;
        hasManuallySetImage.current = true;
        setProfileImageUrl(cacheBustedUrl);
        console.log('Updated profile image URL:', cacheBustedUrl);
        
        // Clear expert data cache so experts list shows updated image
        clearExpertDataCache();
        console.log('Expert data cache cleared');
        
        toast.success('Profile picture updated successfully');
        
        // Dispatch custom event to notify all components of profile image update
        // Send URL for display (components will handle path conversion automatically)
        window.dispatchEvent(new CustomEvent('expertProfileImageUpdated', {
          detail: { 
            profilePictureUrl: profilePictureUrl, // Send URL for immediate display
            profilePicturePath: profilePicturePath, // Also send path for reference
            authId: expertProfile.auth_id,
            timestamp: Date.now()
          }
        }));
        console.log('Dispatched profile image update event:', {
          profilePictureUrl,
          profilePicturePath,
          authId: expertProfile.auth_id
        });
        
        // Refresh the expert profile from context immediately
        if (user?.id) {
          // Refresh immediately for real-time update
          console.log('Refreshing profiles immediately...');
          try {
            await refreshProfiles(user.id);
            console.log('Profiles refreshed');
            
            // Dispatch another event after context refresh with a delay to ensure database is ready
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('expertProfileRefreshed', {
                detail: { 
                  authId: expertProfile.auth_id,
                  profilePictureUrl: profilePictureUrl,
                  timestamp: Date.now()
                }
              }));
              console.log('Dispatched profile refreshed event');
              hasManuallySetImage.current = false;
            }, 1000);
          } catch (refreshError) {
            console.error('Error refreshing profiles:', refreshError);
          }
        }
        
        // Clear the input so same file can be uploaded again
        event.target.value = '';
      } else {
        console.error('No data returned from update');
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
    if (!expertProfile?.auth_id) return;

    setLoading(true);
    try {
      const result = await ExpertRepository.update(expertProfile.auth_id, formData);
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
                src={profileImageUrl || expertProfile.profile_picture || expertProfile.profilePicture || ''} 
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

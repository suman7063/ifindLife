import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ProfileCompletionStepProps {
  expertAccount: any;
  onComplete: () => void;
}

export const ProfileCompletionStep: React.FC<ProfileCompletionStepProps> = ({
  expertAccount,
  onComplete
}) => {
  const [profile, setProfile] = useState({
    bio: expertAccount.bio || '',
    specialization: expertAccount.specialization || '',
    profilePicture: null as File | null
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a JPG or PNG image.');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB.');
        return;
      }
      
      setProfile(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    
    try {
      let profilePictureUrl = expertAccount.profile_picture;

      // Upload profile picture if provided
      if (profile.profilePicture) {
        const fileExt = profile.profilePicture.name.split('.').pop();
        // Add timestamp to filename to avoid caching issues
        const timestamp = Date.now();
        const fileName = `${expertAccount.auth_id}-profile-${timestamp}.${fileExt}`;
        
        // Optionally delete old profile pictures
        try {
          const { data: oldFiles } = await supabase.storage
            .from('avatars')
            .list('', {
              search: `${expertAccount.auth_id}-profile`,
            });
          
          if (oldFiles && oldFiles.length > 0) {
            const filesToDelete = oldFiles
              .filter(f => f.name.startsWith(`${expertAccount.auth_id}-profile`) && f.name !== fileName)
              .map(f => f.name);
            
            if (filesToDelete.length > 0) {
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
          .upload(fileName, profile.profilePicture, { upsert: true });

        if (uploadError) {
          console.error('Profile picture upload failed:', uploadError);
          toast.error('Failed to upload profile picture, but profile will be saved without it');
          // Continue without profile picture rather than failing the entire save
        } else {
          toast.success('Profile picture uploaded successfully');
          
          // Save only the path to database (consistent pattern)
          // Display will automatically convert path to URL using getProfilePictureUrl utility
          profilePictureUrl = uploadData.path;
          console.log('✅ Saving profile picture PATH to database:', profilePictureUrl);
        }
      }

      // Update expert account
      // Use auth_id for the update to ensure RLS policy works correctly
      const updateData = {
        bio: profile.bio,
        specialization: profile.specialization,
        profile_picture: profilePictureUrl,
        profile_completed: true
      };

      console.log('Updating expert account:', {
        expertAccountId: expertAccount.auth_id,
        authId: expertAccount.auth_id,
        updateData
      });

      const { error, data } = await supabase
        .from('expert_accounts')
        .update(updateData)
        .eq('auth_id', expertAccount.auth_id)
        .select();

      if (error) {
        console.error('Error updating expert account:', error);
        console.error('Trying with id instead...');
        
        // Fallback: try with id if auth_id doesn't work
        const { error: error2, data: data2 } = await supabase
          .from('expert_accounts')
          .update(updateData)
          .eq('auth_id', expertAccount.auth_id)
          .select();
        
        if (error2) {
          console.error('Error updating with id:', error2);
          throw error2;
        }
        
        console.log('Profile updated successfully with id:', data2);
      } else {
        console.log('Profile updated successfully with auth_id:', data);
      }

      toast.success('Profile updated successfully!');
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
        <p className="text-muted-foreground mb-4">
          Add additional information to make your profile more appealing to potential clients.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="profilePicture">Profile Picture</Label>
          <div className="mt-2">
            <Input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload a professional headshot (JPG/PNG, max 2MB)
            </p>
            {profile.profilePicture && (
              <p className="text-sm text-green-600 mt-1">
                ✓ {profile.profilePicture.name} selected
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="specialization">Professional Title/Specialization</Label>
          <Input
            id="specialization"
            value={profile.specialization}
            onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
            placeholder="e.g., Licensed Clinical Psychologist, Certified Life Coach"
          />
        </div>

        <div>
          <Label htmlFor="bio">Professional Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Describe your background, approach, and what makes you unique as an expert..."
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            A compelling bio helps clients understand your expertise and approach.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSaveProfile}
          disabled={loading}
          className="px-8"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
};
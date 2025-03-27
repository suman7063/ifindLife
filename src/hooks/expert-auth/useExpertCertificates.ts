
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ExpertProfile } from './types';

export const useExpertCertificates = (
  expert: ExpertProfile | null,
  setExpert: React.Dispatch<React.SetStateAction<ExpertProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Function to upload certificate
  const uploadCertificate = async (file: File): Promise<string | null> => {
    if (!expert) {
      toast.error('You must be logged in to upload certificates');
      return null;
    }

    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error('No active session found');
        return null;
      }

      const userId = session.session.user.id;
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error, data } = await supabase.storage
        .from('expert-certificates')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        toast.error('Failed to upload certificate: ' + error.message);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('expert-certificates')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Update expert profile with new certificate URL
      const currentUrls = expert.certificate_urls || [];
      const { error: updateError } = await supabase
        .from('expert_accounts')
        .update({
          certificate_urls: [...currentUrls, publicUrl]
        })
        .eq('id', expert.id);

      if (updateError) {
        toast.error('Failed to update profile with certificate: ' + updateError.message);
        return null;
      }

      // Refresh the expert data
      const { data: expertData } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('id', expert.id)
        .single();

      if (expertData) {
        setExpert(expertData as ExpertProfile);
      }

      toast.success('Certificate uploaded successfully');
      return publicUrl;
    } catch (error) {
      console.error('Error uploading certificate:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to remove certificate
  const removeCertificate = async (certificateUrl: string): Promise<boolean> => {
    if (!expert) {
      toast.error('You must be logged in to remove certificates');
      return false;
    }

    setLoading(true);
    try {
      // Get the file path from the URL
      const fullUrl = new URL(certificateUrl);
      const path = fullUrl.pathname.split('/').slice(2).join('/');

      // Remove from storage
      const { error: storageError } = await supabase.storage
        .from('expert-certificates')
        .remove([path]);

      // Even if there's an error removing from storage (file might not exist),
      // we should still update the profile
      if (storageError) {
        console.warn('Warning: Failed to remove file from storage:', storageError);
      }

      // Update expert profile to remove the certificate URL
      const currentUrls = expert.certificate_urls || [];
      const updatedUrls = currentUrls.filter(url => url !== certificateUrl);

      const { error: updateError } = await supabase
        .from('expert_accounts')
        .update({
          certificate_urls: updatedUrls
        })
        .eq('id', expert.id);

      if (updateError) {
        toast.error('Failed to update profile: ' + updateError.message);
        return false;
      }

      // Refresh the expert data
      const { data } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('id', expert.id)
        .single();

      if (data) {
        setExpert(data as ExpertProfile);
      }

      toast.success('Certificate removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing certificate:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { uploadCertificate, removeCertificate };
};


import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ExpertProfile } from './types';

export const useExpertCertificates = (
  currentExpert: ExpertProfile | null,
  setExpert: (expert: ExpertProfile | null) => void
) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Upload certificate
  const uploadCertificate = async (file: File): Promise<string | null> => {
    if (!currentExpert) {
      toast.error('Not logged in as an expert');
      return null;
    }

    if (!file) {
      toast.error('No file selected');
      return null;
    }

    setIsUploading(true);
    setProgress(0);
    
    try {
      // Check file type
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'jpg', 'jpeg', 'png'].includes(fileExt || '')) {
        toast.error('Invalid file type. Only PDF, JPG, JPEG, PNG are allowed');
        return null;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return null;
      }

      // Generate unique file name
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `expert_certificates/${currentExpert.id}/${fileName}`;
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          return newProgress <= 90 ? newProgress : prev;
        });
      }, 500);

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(filePath, file);
        
      clearInterval(progressInterval);
      
      if (uploadError) {
        console.error('Certificate upload error:', uploadError);
        toast.error(uploadError.message || 'Failed to upload certificate');
        return null;
      }
      
      setProgress(100);
      
      // Get the file URL
      const { data } = supabase.storage
        .from('certificates')
        .getPublicUrl(filePath);
        
      const fileUrl = data.publicUrl;
      
      // Update the expert's certificate URLs
      const certificateUrls = currentExpert.certificate_urls || [];
      const updatedUrls = [...certificateUrls, fileUrl];
      
      // Update certificate URLs in database
      const { error: updateError } = await supabase
        .from('expert_accounts')
        .update({ certificate_urls: updatedUrls })
        .eq('id', String(currentExpert.id));
        
      if (updateError) {
        console.error('Error updating certificate URLs:', updateError);
        toast.error(updateError.message || 'Failed to update certificate URLs');
        return null;
      }
      
      // Update local state
      setExpert({
        ...currentExpert,
        certificate_urls: updatedUrls
      });
      
      toast.success('Certificate uploaded successfully');
      return fileUrl;
    } catch (error: any) {
      console.error('Error uploading certificate:', error);
      toast.error(error.message || 'Failed to upload certificate');
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Remove certificate
  const removeCertificate = async (url: string): Promise<boolean> => {
    if (!currentExpert) {
      toast.error('Not logged in as an expert');
      return false;
    }

    try {
      // Get the file path from the URL
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filePath = pathname.split('/').slice(2).join('/'); // Remove /storage/v1/object
      
      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from('certificates')
        .remove([filePath]);
        
      if (deleteError) {
        console.error('Error deleting certificate:', deleteError);
        toast.error(deleteError.message || 'Failed to delete certificate');
        return false;
      }
      
      // Update certificate URLs in database
      const certificateUrls = currentExpert.certificate_urls || [];
      const updatedUrls = certificateUrls.filter(cert => cert !== url);
      
      const { error: updateError } = await supabase
        .from('expert_accounts')
        .update({ certificate_urls: updatedUrls })
        .eq('id', String(currentExpert.id));
        
      if (updateError) {
        console.error('Error updating certificate URLs:', updateError);
        toast.error(updateError.message || 'Failed to update certificate URLs');
        return false;
      }
      
      // Update local state
      setExpert({
        ...currentExpert,
        certificate_urls: updatedUrls
      });
      
      toast.success('Certificate removed successfully');
      return true;
    } catch (error: any) {
      console.error('Error removing certificate:', error);
      toast.error(error.message || 'Failed to remove certificate');
      return false;
    }
  };

  return {
    isUploading,
    progress,
    uploadCertificate,
    removeCertificate
  };
};

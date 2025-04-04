
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ExpertProfile } from './types';

/**
 * Custom hook for managing expert certificates
 */
export const useExpertCertificates = (
  expert: ExpertProfile | null,
  setExpert: React.Dispatch<React.SetStateAction<ExpertProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [uploading, setUploading] = useState<boolean>(false);
  
  /**
   * Upload certificate files to storage
   */
  const uploadCertificates = async (files: File[]): Promise<string[]> => {
    if (!expert?.id) {
      toast.error('Expert profile not found');
      return [];
    }

    setUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      // Process each file
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${expert.id}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `certificates/${fileName}`;
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('expert-certificates')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          toast.error(`Error uploading certificate: ${uploadError.message}`);
          continue;
        }
        
        // Get public URL
        const { data } = supabase.storage
          .from('expert-certificates')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(data.publicUrl);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading certificates:', error);
      toast.error('Failed to upload certificates');
      return [];
    } finally {
      setUploading(false);
    }
  };
  
  /**
   * Update expert profile with new certificates
   */
  const updateCertificates = async (files: File[]): Promise<boolean> => {
    if (!expert) {
      toast.error('Expert profile not found');
      return false;
    }
    
    setLoading(true);
    
    try {
      // Upload the files
      const newCertificateUrls = await uploadCertificates(files);
      
      if (newCertificateUrls.length === 0) {
        toast.error('No certificates were uploaded');
        return false;
      }
      
      // Combine existing and new certificates
      const existingUrls = expert.certificate_urls || [];
      const updatedUrls = [...existingUrls, ...newCertificateUrls];
      
      // Update expert profile
      const { error } = await supabase
        .from('expert_accounts')
        .update({ certificate_urls: updatedUrls })
        .eq('id', expert.id);
        
      if (error) {
        toast.error('Failed to update certificates in profile');
        return false;
      }
      
      // Update local state
      setExpert({
        ...expert,
        certificate_urls: updatedUrls
      });
      
      toast.success('Certificates uploaded successfully');
      return true;
    } catch (error) {
      console.error('Error updating certificates:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Delete certificate from storage and profile
   */
  const deleteCertificate = async (certificateUrl: string): Promise<boolean> => {
    if (!expert) {
      toast.error('Expert profile not found');
      return false;
    }
    
    setLoading(true);
    
    try {
      // Extract file path from URL
      const urlParts = certificateUrl.split('/');
      const filePath = `certificates/${urlParts[urlParts.length - 1]}`;
      
      // Remove from storage
      const { error: deleteError } = await supabase.storage
        .from('expert-certificates')
        .remove([filePath]);
        
      if (deleteError) {
        console.warn('Error removing file from storage:', deleteError);
        // Continue anyway, as we still want to remove it from the profile
      }
      
      // Get current certificate URLs and filter out the deleted one
      const currentUrls = expert.certificate_urls || [];
      const updatedUrls = currentUrls.filter(url => url !== certificateUrl);
      
      // Update expert profile
      const { error } = await supabase
        .from('expert_accounts')
        .update({ certificate_urls: updatedUrls })
        .eq('id', expert.id);
        
      if (error) {
        toast.error('Failed to update certificates in profile');
        return false;
      }
      
      // Update local state
      setExpert({
        ...expert,
        certificate_urls: updatedUrls
      });
      
      toast.success('Certificate deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { 
    uploadCertificates,
    updateCertificates,
    deleteCertificate,
    uploading 
  };
};

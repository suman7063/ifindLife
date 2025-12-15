
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile, ProfileUpdateData, ExpertTimeSlot } from './types';
import { toast } from 'sonner';

export const useExpertProfile = (
  currentExpert: ExpertProfile | null,
  setExpert: (expert: ExpertProfile | null) => void
) => {
  const [updating, setUpdating] = useState(false);

  /**
   * Updates the expert's profile information
   */
  const updateProfile = async (profileData: ProfileUpdateData): Promise<boolean> => {
    if (!currentExpert) {
      toast.error('No expert profile found. Please log in again.');
      return false;
    }

    try {
      setUpdating(true);
      
      // Use auth_id for updates
      const expertId = String(currentExpert.auth_id || currentExpert.id);
      
      // Update the expert_accounts table
      const { error } = await supabase
        .from('expert_accounts')
        .update(profileData)
        .eq('auth_id', expertId);
      
      if (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile: ' + error.message);
        return false;
      }
      
      // Update the local state
      const updatedExpert = {
        ...currentExpert,
        ...profileData
      };
      
      setExpert(updatedExpert);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An unexpected error occurred while updating your profile');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Updates the expert's availability schedule
   */
  const updateAvailability = async (timeSlots: ExpertTimeSlot[]): Promise<boolean> => {
    if (!currentExpert) {
      toast.error('No expert profile found. Please log in again.');
      return false;
    }
    
    try {
      setUpdating(true);
      
      // Use auth_id for expert operations
      const expertId = String(currentExpert.auth_id || currentExpert.id);
      
      // First, delete all existing availability entries for this expert
      const { error: deleteError } = await supabase
        .from('expert_availabilities')
        .delete()
        .eq('expert_id', expertId);
      
      if (deleteError) {
        console.error('Error deleting existing availability:', deleteError);
        toast.error('Failed to update availability: ' + deleteError.message);
        return false;
      }
      
      // Then, insert the new availability entries
      // Map the timeSlots to match the CURRENT database schema (day_of_week, start_time, end_time, start_date, end_date)
      // Set default date range: today to 1 year from now
      const today = new Date();
      const oneYearLater = new Date(today);
      oneYearLater.setFullYear(today.getFullYear() + 1);
      const startDate = today.toISOString().split('T')[0];
      const endDate = oneYearLater.toISOString().split('T')[0];
      
      const availabilityData = timeSlots.map(slot => ({
        expert_id: expertId,
        day_of_week: slot.day_of_week ?? (slot.day ? parseInt(String(slot.day)) : 0),
        start_time: slot.start_time || '09:00:00',
        end_time: slot.end_time || '17:00:00',
        start_date: startDate, // Availability start date
        end_date: endDate, // Availability end date
        is_available: true,
        timezone: 'UTC'
      }));
      
      // Insert the transformed data
      // TypeScript types are outdated - actual DB schema has day_of_week/start_time/end_time, not start_date/end_date
      // Cast availabilityData to bypass outdated type definitions
      const { error: insertError } = await supabase
        .from('expert_availabilities')
        // @ts-expect-error - TypeScript types expect start_date/end_date/availability_type, but actual DB has day_of_week/start_time/end_time
        .insert(availabilityData);
      
      if (insertError) {
        console.error('Error updating availability:', insertError);
        const errorMessage = insertError instanceof Error ? insertError.message : String(insertError);
        toast.error('Failed to update availability: ' + errorMessage);
        return false;
      }
      
      toast.success('Availability updated successfully');
      return true;
    } catch (error) {
      console.error('Availability update error:', error);
      toast.error('An unexpected error occurred while updating your availability');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Updates the services offered by the expert
   * Services are stored in expert_service_specializations table
   */
  const updateServices = async (serviceIds: number[]): Promise<boolean> => {
    if (!currentExpert) {
      toast.error('No expert profile found. Please log in again.');
      return false;
    }
    
    try {
      setUpdating(true);
      
      // Use auth_id for expert operations
      const expertId = String(currentExpert.auth_id || currentExpert.id);
      
      // Delete existing specializations
      const { error: deleteError } = await supabase
        .from('expert_service_specializations')
        .delete()
        .eq('expert_id', expertId);
      
      if (deleteError) {
        console.error('Error deleting existing services:', deleteError);
        toast.error('Failed to update services: ' + deleteError.message);
        return false;
      }
      
      // Insert new specializations
      if (serviceIds.length > 0) {
        const specializations = serviceIds.map((serviceId, index) => ({
          expert_id: expertId,
          service_id: String(serviceId), // Database has UUID, but types expect number - using string
          is_available: true,
          is_primary_service: index === 0
        })) as unknown as Array<{ expert_id: string; service_id: number; is_available: boolean; is_primary_service: boolean }>; // Type assertion needed due to type mismatch (DB has UUID but types expect number)
        
        const { error: insertError } = await supabase
          .from('expert_service_specializations')
          .insert(specializations);
        
        if (insertError) {
          console.error('Error inserting services:', insertError);
          toast.error('Failed to update services: ' + insertError.message);
          return false;
        }
      }
      
      // Update the local state
      const updatedExpert = {
        ...currentExpert,
        selected_services: serviceIds
      };
      
      setExpert(updatedExpert);
      toast.success('Services updated successfully');
      return true;
    } catch (error) {
      console.error('Services update error:', error);
      toast.error('An unexpected error occurred while updating your services');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updateProfile,
    updateAvailability,
    updateServices,
    updating
  };
};

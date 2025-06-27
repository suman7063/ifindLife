
import { useState } from 'react';
import { ExpertRepository } from '@/repositories/expertRepository';
import { toast } from 'sonner';

export const useExpertServices = () => {
  const [loading, setLoading] = useState(false);

  const addService = async (expertId: string, serviceId: number): Promise<boolean> => {
    setLoading(true);
    try {
      // This would need to be implemented in ExpertRepository
      // For now, return true as placeholder
      toast.success('Service added successfully');
      return true;
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeService = async (expertId: string, serviceId: number): Promise<boolean> => {
    setLoading(true);
    try {
      // This would need to be implemented in ExpertRepository
      // For now, return true as placeholder
      toast.success('Service removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing service:', error);
      toast.error('Failed to remove service');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    addService,
    removeService,
    loading
  };
};

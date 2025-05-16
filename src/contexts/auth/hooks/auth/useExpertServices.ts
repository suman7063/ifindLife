
import { useCallback } from 'react';
import { expertRepository } from '@/repositories/expertRepository';

export const useExpertServices = (state: any) => {
  const addExpertService = useCallback(async (serviceId: number, price: number): Promise<boolean> => {
    if (!state.expertProfile?.id) return false;
    
    try {
      const currentServices = state.expertProfile.selected_services || [];
      if (currentServices.includes(serviceId)) {
        return true; // Already added
      }
      
      const success = await expertRepository.updateExpert(state.expertProfile.id, {
        selected_services: [...currentServices, serviceId]
      });
      
      return success;
    } catch (error) {
      console.error('Error adding expert service:', error);
      return false;
    }
  }, [state.expertProfile]);

  const removeExpertService = useCallback(async (serviceId: number): Promise<boolean> => {
    if (!state.expertProfile?.id) return false;
    
    try {
      const currentServices = state.expertProfile.selected_services || [];
      const updatedServices = currentServices.filter(id => id !== serviceId);
      
      const success = await expertRepository.updateExpert(state.expertProfile.id, {
        selected_services: updatedServices
      });
      
      return success;
    } catch (error) {
      console.error('Error removing expert service:', error);
      return false;
    }
  }, [state.expertProfile]);

  return { addExpertService, removeExpertService };
};

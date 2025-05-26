
import { useState, useCallback } from 'react';
import { ProgramDetail } from '@/types/programDetail';
import { getProgramDetail } from '@/data/programDetailsData';

interface ModalState {
  isOpen: boolean;
  programData: ProgramDetail | null;
  activeTab: 'structure' | 'coverage' | 'outcomes' | 'pricing' | 'reviews';
  loading: boolean;
  error: string | null;
}

export const useProgramDetailModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    programData: null,
    activeTab: 'structure',
    loading: false,
    error: null
  });

  const openModal = useCallback((programId: string) => {
    setModalState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const programData = getProgramDetail(programId);
      if (!programData) {
        throw new Error('Program not found');
      }
      
      setModalState({
        isOpen: true,
        programData,
        activeTab: 'structure',
        loading: false,
        error: null
      });
    } catch (error) {
      setModalState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load program details'
      }));
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      programData: null,
      activeTab: 'structure',
      loading: false,
      error: null
    });
  }, []);

  const switchTab = useCallback((tab: ModalState['activeTab']) => {
    setModalState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  return {
    modalState,
    openModal,
    closeModal,
    switchTab
  };
};

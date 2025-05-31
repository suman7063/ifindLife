
import { useState } from 'react';
import { ProgramDetail } from '@/types/programDetail';

interface ModalState {
  isOpen: boolean;
  programData: ProgramDetail | null;
  activeTab: string;
  loading: boolean;
  error: string | null;
}

export const useProgramDetailModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    programData: null,
    activeTab: 'course-structure',
    loading: false,
    error: null
  });

  const openModal = (programId: string, programData?: ProgramDetail) => {
    setModalState({
      isOpen: true,
      programData: programData || null,
      activeTab: 'course-structure',
      loading: !programData,
      error: null
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      programData: null,
      activeTab: 'course-structure',
      loading: false,
      error: null
    });
  };

  const switchTab = (tab: string) => {
    setModalState(prev => ({
      ...prev,
      activeTab: tab
    }));
  };

  return {
    modalState,
    openModal,
    closeModal,
    switchTab
  };
};

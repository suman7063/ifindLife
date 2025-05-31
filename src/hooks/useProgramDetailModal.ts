
import { useState } from 'react';

interface ProgramData {
  title: string;
  description: string;
  overview: string;
  benefits: string[];
  features: string[];
  duration: string;
  format: string;
  price: string;
}

interface ModalState {
  isOpen: boolean;
  programData: ProgramData | null;
  activeTab: string;
  loading: boolean;
  error: string | null;
}

export const useProgramDetailModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    programData: null,
    activeTab: 'overview',
    loading: false,
    error: null
  });

  const openModal = (programId: string, programData?: ProgramData) => {
    setModalState({
      isOpen: true,
      programData: programData || null,
      activeTab: 'overview',
      loading: !programData,
      error: null
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      programData: null,
      activeTab: 'overview',
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

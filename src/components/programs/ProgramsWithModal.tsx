
import React from 'react';
import ProgramModalTrigger from './ProgramModalTrigger';
import ProgramDetailModal from './detail/ProgramDetailModal';
import { useProgramDetailModal } from '@/hooks/useProgramDetailModal';

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  sessions: number;
  enrollments: number;
  image: string;
  category: string;
}

interface ProgramsWithModalProps {
  programs: Program[];
  className?: string;
}

const ProgramsWithModal: React.FC<ProgramsWithModalProps> = ({ 
  programs, 
  className = '' 
}) => {
  const { modalState, openModal, closeModal, switchTab } = useProgramDetailModal();

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {programs.map((program) => (
          <ProgramModalTrigger
            key={program.id}
            program={program}
            onOpenModal={openModal}
          />
        ))}
      </div>

      <ProgramDetailModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        programData={modalState.programData}
        activeTab={modalState.activeTab}
        onTabChange={switchTab}
        loading={modalState.loading}
        error={modalState.error}
      />
    </>
  );
};

export default ProgramsWithModal;

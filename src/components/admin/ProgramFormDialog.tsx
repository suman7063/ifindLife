
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Program } from '@/types/programs';
import ProgramForm from './programs/form/ProgramForm';

export interface ProgramFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (programData: Program) => Promise<void>;
  program: Program | null;
}

const ProgramFormDialog: React.FC<ProgramFormDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  program 
}) => {
  const handleSave = async (programData: Program) => {
    await onSave(programData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <ProgramForm program={program} onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
};

export default ProgramFormDialog;

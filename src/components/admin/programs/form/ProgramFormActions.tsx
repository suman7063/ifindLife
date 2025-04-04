
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface ProgramFormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
}

const ProgramFormActions: React.FC<ProgramFormActionsProps> = ({ isSubmitting, isEditMode }) => {
  return (
    <DialogFooter>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditMode ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          isEditMode ? 'Update Program' : 'Create Program'
        )}
      </Button>
    </DialogFooter>
  );
};

export default ProgramFormActions;

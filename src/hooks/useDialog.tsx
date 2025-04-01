
import React, { useState, ReactNode } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);

  const showDialog = (dialogContent: ReactNode) => {
    setContent(dialogContent);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 300); // Clear content after animation
  };

  const DialogComponent = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {content}
      </DialogContent>
    </Dialog>
  );

  return {
    showDialog,
    closeDialog,
    DialogComponent,
    isOpen
  };
}

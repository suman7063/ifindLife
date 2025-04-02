
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import InquiryForm from '../InquiryForm';
import { UserProfile } from '@/types/supabase';

interface InquiryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  serviceName: string;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  onSuccess: () => void;
}

const InquiryDialog: React.FC<InquiryDialogProps> = ({
  isOpen,
  onOpenChange,
  serviceName,
  currentUser,
  isAuthenticated,
  onSuccess
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Inquire about {serviceName}</DialogTitle>
          <DialogDescription>
            Please provide your information and we'll get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <InquiryForm 
          serviceName={serviceName} 
          currentUser={currentUser} 
          isAuthenticated={isAuthenticated} 
          onSuccess={onSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default InquiryDialog;

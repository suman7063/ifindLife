
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BookingTab from '@/components/booking/BookingTab';
import { User } from '@supabase/supabase-js';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expert: {
    id: string;
    name: string;
  };
  user: User | null;
  isUserLoading: boolean;
}

const BookingDialog: React.FC<BookingDialogProps> = ({ 
  open, 
  onOpenChange, 
  expert,
  user,
  isUserLoading
}) => {
  const handleBookingComplete = () => {
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Book a Session with {expert.name}</DialogTitle>
        </DialogHeader>
        
        {isUserLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : !user ? (
          <div className="p-6 text-center">
            <p className="mb-4">Please sign in to book a session with this expert.</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                // Save the current state so we can return to it after login
                sessionStorage.setItem('returnPath', window.location.pathname);
                sessionStorage.setItem('pendingAction', 'booking');
                sessionStorage.setItem('pendingExpertId', expert.id);
                window.location.href = '/user-login';
              }}
            >
              Sign In to Book
            </button>
          </div>
        ) : (
          <BookingTab 
            expertId={expert.id} 
            expertName={expert.name}
            onBookingComplete={handleBookingComplete} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;

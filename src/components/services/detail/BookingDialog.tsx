
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BookingTab from '@/components/booking/BookingTab';
import { User } from '@supabase/supabase-js';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceTitle: string;
  serviceType: string;
}

const BookingDialog: React.FC<BookingDialogProps> = ({ 
  open, 
  onOpenChange, 
  serviceTitle,
  serviceType
}) => {
  // We'll need to fetch expert data and user state here in a real implementation
  // For now, we'll use mock data
  const mockExpert = {
    id: "expert-1",
    name: "Dr. Example"
  };
  const mockUser = null;
  const isUserLoading = false;
  
  const handleBookingComplete = () => {
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Book a {serviceType}: {serviceTitle}</DialogTitle>
        </DialogHeader>
        
        {isUserLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : !mockUser ? (
          <div className="p-6 text-center">
            <p className="mb-4">Please sign in to book this service.</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                // Save the current state so we can return to it after login
                sessionStorage.setItem('returnPath', window.location.pathname);
                sessionStorage.setItem('pendingAction', 'booking');
                window.location.href = '/user-login';
              }}
            >
              Sign In to Book
            </button>
          </div>
        ) : (
          <BookingTab 
            expertId={mockExpert.id} 
            expertName={mockExpert.name}
            onBookingComplete={handleBookingComplete} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;

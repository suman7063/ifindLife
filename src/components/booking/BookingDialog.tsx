
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { Service } from '@/types/service';
import { Expert } from '@/types/service';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  expert?: Expert;
}

export function BookingDialog({ isOpen, onClose, service, expert }: BookingDialogProps) {
  const { isAuthenticated, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  const handleBookService = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book a service');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Call booking API (to be implemented)
      
      toast.success('Service booked successfully!');
      onClose();
    } catch (error) {
      console.error('Error booking service:', error);
      toast.error('Failed to book service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book {service.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-lg">{service.name}</h3>
              <p className="text-sm text-gray-500">{service.description}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">${service.rate_usd}</p>
              <p className="text-sm text-gray-500">₹{service.rate_inr}</p>
            </div>
          </div>

          {expert && (
            <div className="flex items-center space-x-3 p-3 border rounded-md">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {expert.profile_picture ? (
                  <img 
                    src={expert.profile_picture} 
                    alt={expert.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-gray-500">{expert.name.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <h4 className="font-medium">{expert.name}</h4>
                <p className="text-sm text-gray-500">{expert.specialization || "Expert"}</p>
              </div>
            </div>
          )}

          {/* Date and time selection will be implemented later */}
          <div className="p-3 border rounded-md bg-gray-50">
            <p className="text-sm text-gray-500 mb-1">Available time slots</p>
            <p className="text-sm">Please select a date and time to continue.</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleBookService} 
            disabled={isSubmitting || !isAuthenticated}
          >
            Book Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BookingDialog;

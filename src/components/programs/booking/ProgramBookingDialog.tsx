
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
import { ProgramDetail } from '@/types/programDetail';
import BookingCalendar from './BookingCalendar';
import TimeSlotSelector from './TimeSlotSelector';
import BookingNotes from './BookingNotes';
import { BookingFormData } from './useProgramBooking';

interface ProgramBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  programData: ProgramDetail;
  bookingData: BookingFormData;
  onBookingDataUpdate: (updates: Partial<BookingFormData>) => void;
  onSubmitBooking: () => Promise<boolean>;
  isSubmitting: boolean;
}

const ProgramBookingDialog: React.FC<ProgramBookingDialogProps> = ({
  isOpen,
  onClose,
  programData,
  bookingData,
  onBookingDataUpdate,
  onSubmitBooking,
  isSubmitting
}) => {
  const handleSubmit = async () => {
    const success = await onSubmitBooking();
    if (success) {
      onClose();
    }
  };

  const isFormValid = bookingData.selectedDate && bookingData.selectedTime;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-ifind-teal" />
              Book Individual Session
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">{programData.title}</p>
        </DialogHeader>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Expert Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <img 
                src={programData.expert.photo} 
                alt={programData.expert.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{programData.expert.name}</p>
                <p className="text-sm text-gray-600">{programData.expert.experience} experience</p>
                <p className="text-sm text-gray-500">
                  Session Duration: {programData.courseStructure.sessionDuration}
                </p>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <BookingCalendar
            selectedDate={bookingData.selectedDate}
            onDateSelect={(date) => onBookingDataUpdate({ selectedDate: date })}
          />

          {/* Time Selection */}
          <TimeSlotSelector
            selectedTime={bookingData.selectedTime}
            onTimeSelect={(time) => onBookingDataUpdate({ selectedTime: time })}
            selectedDate={bookingData.selectedDate}
          />

          {/* Notes */}
          <BookingNotes
            notes={bookingData.notes || ''}
            onNotesChange={(notes) => onBookingDataUpdate({ notes })}
          />

          {/* Pricing Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Session Price:</span>
              <span className="text-lg font-bold text-green-700">
                ₹{programData.pricing.individual.perSession}
              </span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              One-time payment • No recurring charges
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6 flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="flex-1 bg-ifind-teal hover:bg-ifind-teal/90"
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramBookingDialog;

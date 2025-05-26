
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, X, User, AlertCircle } from 'lucide-react';
import { ProgramDetail } from '@/types/programDetail';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BookingCalendar from './BookingCalendar';
import TimeSlotSelector from './TimeSlotSelector';
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
  
  // Validation warnings
  const getValidationWarnings = () => {
    const warnings = [];
    
    if (!bookingData.selectedDate) {
      warnings.push("Please select a date");
    }
    
    if (!bookingData.selectedTime) {
      warnings.push("Please select a time slot");
    }
    
    if (bookingData.selectedDate && bookingData.selectedTime) {
      const selectedDateTime = new Date(`${bookingData.selectedDate}T${bookingData.selectedTime}`);
      const now = new Date();
      if (selectedDateTime <= now) {
        warnings.push("Selected time must be in the future");
      }
    }
    
    return warnings;
  };

  const validationWarnings = getValidationWarnings();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-4 pb-0 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-ifind-teal" />
              Book Individual Session
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">{programData.title}</p>
        </DialogHeader>
        
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)]">
          {/* Left Column - Expert Info & Pricing */}
          <div className="lg:w-1/3 p-4 border-r border-gray-200 space-y-4">
            {/* Expert Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <img 
                  src={programData.expert.photo} 
                  alt={programData.expert.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-sm">{programData.expert.name}</p>
                  <p className="text-xs text-gray-600">{programData.expert.experience}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Duration: {programData.courseStructure.sessionDuration}
              </p>
            </div>

            {/* Pricing Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">Session Price:</span>
                <span className="text-lg font-bold text-green-700">
                  ₹{programData.pricing.individual.perSession}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                One-time payment • No recurring charges
              </p>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-1">
                <User className="h-3 w-3" />
                Session Notes (Optional)
              </label>
              <textarea
                value={bookingData.notes || ''}
                onChange={(e) => onBookingDataUpdate({ notes: e.target.value })}
                placeholder="Brief notes about your goals or concerns..."
                className="w-full text-xs border rounded p-2 h-16 resize-none"
                maxLength={500}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">{(bookingData.notes || '').length}/500</p>
            </div>
          </div>

          {/* Right Column - Date & Time Selection */}
          <div className="lg:w-2/3 p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Validation Warnings */}
              {validationWarnings.length > 0 && (
                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {validationWarnings.map((warning, index) => (
                        <li key={index} className="text-sm">{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Date Selection */}
              <div>
                <h3 className="text-sm font-medium mb-2">Select Date</h3>
                <div className="border rounded-lg p-2">
                  <BookingCalendar
                    selectedDate={bookingData.selectedDate}
                    onDateSelect={(date) => onBookingDataUpdate({ selectedDate: date })}
                  />
                </div>
              </div>

              {/* Time Selection */}
              <TimeSlotSelector
                selectedTime={bookingData.selectedTime}
                onTimeSelect={(time) => onBookingDataUpdate({ selectedTime: time })}
                selectedDate={bookingData.selectedDate}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-4 flex gap-3">
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

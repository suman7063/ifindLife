
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';
import { ProgramDetail } from '@/types/programDetail';
import { useToast } from '@/hooks/use-toast';

interface ProgramBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  programData: ProgramDetail;
  onBookingComplete: () => void;
}

const ProgramBookingDialog: React.FC<ProgramBookingDialogProps> = ({
  isOpen,
  onClose,
  programData,
  onBookingComplete
}) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);

  const availableDates = [
    '2024-12-01',
    '2024-12-02',
    '2024-12-03',
    '2024-12-04',
    '2024-12-05'
  ];

  const availableTimes = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00'
  ];

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for your session.",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);
    try {
      // TODO: Implement actual booking API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Booking Confirmed",
        description: `Your session is booked for ${selectedDate} at ${selectedTime}`,
      });
      
      onBookingComplete();
      onClose();
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Failed to book your session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Session - {programData.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Program Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <img 
                src={programData.expert.photo} 
                alt={programData.expert.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{programData.expert.name}</p>
                <p className="text-sm text-gray-600">{programData.expert.experience} experience</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-2">
              Session Duration: {programData.courseStructure.sessionDuration}
            </p>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <div className="grid grid-cols-3 gap-2">
              {availableDates.map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? "default" : "outline"}
                  className="text-sm"
                  onClick={() => setSelectedDate(date)}
                >
                  {new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Time</label>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className="text-sm"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Booking Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleBooking} 
              disabled={isBooking || !selectedDate || !selectedTime}
              className="flex-1 bg-ifind-teal hover:bg-ifind-teal/90"
            >
              {isBooking ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramBookingDialog;

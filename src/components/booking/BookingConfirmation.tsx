
import React from 'react';
import { format } from 'date-fns';
import { Check, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTimeSlot } from '@/utils/bookingValidation';

interface BookingConfirmationProps {
  appointmentId: string;
  expertName: string;
  date: Date;
  startTime: string;
  endTime: string;
  onClose: () => void;
  onViewAppointments: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  appointmentId,
  expertName,
  date,
  startTime,
  endTime,
  onClose,
  onViewAppointments
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600 dark:text-green-300" />
          </div>
        </div>
        <CardTitle className="text-center text-xl">Booking Confirmed!</CardTitle>
        <CardDescription className="text-center">
          Your appointment has been successfully booked
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Appointment Details</h3>
          <div className="bg-muted/50 p-4 rounded-md space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expert:</span>
              <span className="font-medium">{expertName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{formatTimeSlot(startTime, endTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Confirmation ID:</span>
              <span className="font-medium">{appointmentId.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
          <div className="flex gap-2">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              A confirmation has been sent to your email. You can join the session by visiting your appointments page.
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-3 flex-col sm:flex-row">
        <Button 
          variant="outline" 
          className="w-full sm:w-1/2" 
          onClick={onClose}
        >
          Close
        </Button>
        <Button 
          className="w-full sm:w-1/2" 
          onClick={onViewAppointments}
        >
          View My Appointments
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingConfirmation;

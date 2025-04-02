
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import ExpertBookingCalendar from '@/components/booking/ExpertBookingCalendar';

interface Expert {
  id: string;
  name: string;
  specialization?: string;
}

interface BookingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  serviceName: string;
  matchingExperts: Expert[];
  selectedExpert: Expert | null;
  setSelectedExpert: (expert: Expert) => void;
  onBookingComplete: () => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  isOpen,
  onOpenChange,
  serviceName,
  matchingExperts,
  selectedExpert,
  setSelectedExpert,
  onBookingComplete
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Book a {serviceName} Session</DialogTitle>
          <DialogDescription>
            Select an expert and schedule your appointment.
          </DialogDescription>
        </DialogHeader>
        
        {matchingExperts.length > 0 ? (
          <div className="space-y-4">
            {matchingExperts.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Choose an Expert:</h3>
                <div className="flex flex-wrap gap-2">
                  {matchingExperts.map(expert => (
                    <Button 
                      key={expert.id} 
                      variant={selectedExpert?.id === expert.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedExpert(expert)}
                    >
                      {expert.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {selectedExpert && (
              <ExpertBookingCalendar 
                expertId={selectedExpert.id.toString()} 
                expertName={selectedExpert.name}
                onBookingComplete={onBookingComplete}
              />
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No experts are currently available for this service.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;

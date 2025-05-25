
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {serviceTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <p className="text-muted-foreground mb-6">
            Ready to book your {serviceTitle.toLowerCase()} session? Choose how you'd like to proceed.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/experts">Find an Expert</Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/contact">Contact Us</Link>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;

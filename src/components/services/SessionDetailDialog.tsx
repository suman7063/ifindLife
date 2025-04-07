
import React from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SessionDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color?: string;
  } | null;
}

const SessionDetailDialog: React.FC<SessionDetailDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  selectedCategory 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {selectedCategory?.icon && React.cloneElement(selectedCategory.icon as React.ReactElement, { className: 'h-6 w-6 mr-2' })}
            {selectedCategory?.title}
          </DialogTitle>
          <DialogDescription>
            {selectedCategory?.description}
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <p className="mb-4 text-gray-700">
            Our experienced professionals provide personalized guidance and support to help you navigate through your challenges.
          </p>
          <div className="flex justify-between mt-4">
            <Button asChild variant="outline">
              <Link to="/experts">Find an Expert</Link>
            </Button>
            <Button asChild>
              <Link to="/services">Book a Session</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailDialog;

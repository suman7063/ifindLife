import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CreditCard } from 'lucide-react';

export const BookingFlow: React.FC = () => {
  return (
    <div className="flex flex-col bg-background p-6">
      <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-6">Book Session</h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 border border-border/50">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-6 w-6 text-ifind-aqua" />
            <h2 className="text-lg font-poppins font-semibold">Select Date & Time</h2>
          </div>
          <p className="text-muted-foreground">Choose your preferred session time</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-border/50">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-6 w-6 text-ifind-teal" />
            <h2 className="text-lg font-poppins font-semibold">Duration</h2>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">30 minutes - $25</Button>
            <Button variant="outline" className="w-full justify-start">60 minutes - $50</Button>
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-ifind-aqua to-ifind-teal text-white py-6">
          <CreditCard className="h-5 w-5 mr-2" />
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};
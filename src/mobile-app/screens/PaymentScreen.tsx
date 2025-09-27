import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock } from 'lucide-react';

export const PaymentScreen: React.FC = () => {
  return (
    <div className="flex flex-col bg-background p-6">
      <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-6">Payment</h1>
      
      <div className="bg-white rounded-xl p-6 border border-border/50 mb-6">
        <h2 className="text-lg font-poppins font-semibold mb-4">Session Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>60-minute session</span>
            <span>$50.00</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>$50.00</span>
          </div>
        </div>
      </div>

      <Button className="w-full bg-gradient-to-r from-ifind-aqua to-ifind-teal text-white py-6">
        <Lock className="h-5 w-5 mr-2" />
        Pay Securely
      </Button>
    </div>
  );
};
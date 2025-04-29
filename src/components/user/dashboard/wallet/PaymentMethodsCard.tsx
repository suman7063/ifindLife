
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Plus } from 'lucide-react';
import { toast } from 'sonner';

const PaymentMethodsCard: React.FC = () => {
  const handleAddPaymentMethod = () => {
    // In a real app, this would show a form to add a new payment method
    toast.info('Add payment method functionality will be implemented in a future update');
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your saved payment options</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-md border p-4">
            <CreditCard className="h-5 w-5" />
            <div className="flex-1 space-y-1">
              <p className="font-medium">Visa ending in 4242</p>
              <p className="text-xs text-muted-foreground">Expires 04/2025</p>
            </div>
            <Button variant="outline" size="sm">Set as Default</Button>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={handleAddPaymentMethod}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsCard;

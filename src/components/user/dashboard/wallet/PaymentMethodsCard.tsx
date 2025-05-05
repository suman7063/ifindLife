
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Plus } from 'lucide-react';
import { toast } from 'sonner';

const PaymentMethodsCard: React.FC = () => {
  const handleAddPaymentMethod = () => {
    // This would open a dialog to add a new payment method in a real implementation
    toast.info("Add payment method functionality will be implemented in a future update");
  };

  return (
    <Card className="col-span-2">
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold mb-2">Payment Methods</h3>
        <p className="text-muted-foreground text-sm mb-4">Manage your saved payment options</p>
        
        <div className="space-y-4">
          {/* Example saved payment method */}
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-xs text-muted-foreground">Expires 04/2025</p>
              </div>
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

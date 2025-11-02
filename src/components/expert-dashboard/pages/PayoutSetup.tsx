import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Check, CreditCard, Building2, Wallet, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
// TODO: Re-implement currency hook
// import { useUserCurrency } from '@/hooks/call/useUserCurrency';
import { toast } from 'sonner';

interface PayoutSetupProps {
  onBack: () => void;
}

interface PayoutMethod {
  id: string;
  type: 'bank' | 'card' | 'digital_wallet';
  label: string;
  icon: React.ReactNode;
  fields: string[];
}

const PayoutSetup: React.FC<PayoutSetupProps> = ({ onBack }) => {
  // TODO: Re-implement currency logic
  const currency = 'INR'; // Default currency
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const payoutMethods: PayoutMethod[] = [
    {
      id: 'bank_transfer',
      type: 'bank',
      label: 'Bank Transfer',
      icon: <Building2 className="h-5 w-5" />,
      fields: ['accountHolderName', 'bankName', 'accountNumber', 'routingNumber', 'swiftCode']
    }
  ];

  const fieldLabels: Record<string, string> = {
    accountHolderName: 'Account Holder Name',
    bankName: 'Bank Name',
    accountNumber: 'Account Number',
    routingNumber: 'Routing Number',
    swiftCode: 'SWIFT Code (for international)',
    cardHolderName: 'Card Holder Name',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date (MM/YY)',
    cvv: 'CVV',
    walletProvider: 'Wallet Provider',
    walletId: 'Wallet ID/Phone',
    walletEmail: 'Email Address'
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - will be replaced with actual PG integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store payout method locally for now
      const payoutData = {
        method: selectedMethod,
        currency,
        details: formData,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('expertPayoutMethod', JSON.stringify(payoutData));
      
      toast.success('Payout method configured successfully!');
      onBack();
    } catch (error) {
      toast.error('Failed to configure payout method. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMethodData = payoutMethods.find(m => m.id === selectedMethod);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Earnings
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Payout Setup</h2>
          <p className="text-muted-foreground">Configure how you want to receive your earnings</p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your payout details will be securely stored and used for future payment processing. 
          All transactions will be processed in {currency}.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Select Payout Method</CardTitle>
          <CardDescription>Choose how you'd like to receive your earnings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {payoutMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedMethod === method.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  {method.icon}
                  <div className="flex-1">
                    <h3 className="font-medium">{method.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      Direct transfer to your bank account
                    </p>
                  </div>
                  {selectedMethod === method.id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedMethodData && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Enter your {selectedMethodData.label.toLowerCase()} details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                {selectedMethodData.fields.map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{fieldLabels[field]}</Label>
                    {field === 'walletProvider' ? (
                      <Select 
                        value={formData[field] || ''} 
                        onValueChange={(value) => handleInputChange(field, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select wallet provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="google_pay">Google Pay</SelectItem>
                          <SelectItem value="apple_pay">Apple Pay</SelectItem>
                          <SelectItem value="paytm">Paytm</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field}
                        type={field.includes('card') && field !== 'cardHolderName' ? 'password' : 'text'}
                        placeholder={`Enter ${fieldLabels[field].toLowerCase()}`}
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <p>Processing fees: 2-3% per transaction</p>
                  <p>Processing time: 1-3 business days</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={onBack}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Setting up...' : 'Save Payout Method'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PayoutSetup;
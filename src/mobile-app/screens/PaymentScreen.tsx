import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Lock, 
  Wallet, 
  Building2, 
  Smartphone, 
  CheckCircle2,
  Shield,
  Clock,
  User,
  Calendar
} from 'lucide-react';

// Mock data for demonstration
const MOCK_SESSION_DATA = {
  expertName: 'Dr. Ananya Sharma',
  expertImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&crop=face',
  service: 'Mental Wellness Consultation',
  duration: 30,
  date: 'Dec 24, 2024',
  time: '10:00 AM',
  sessionFee: 799,
  platformFee: 50,
  discount: 0,
  walletBalance: 2500
};

type PaymentMethod = 'wallet' | 'card' | 'upi' | 'netbanking';

export const PaymentScreen: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');

  const totalAmount = MOCK_SESSION_DATA.sessionFee + MOCK_SESSION_DATA.platformFee - MOCK_SESSION_DATA.discount;
  const walletSufficient = MOCK_SESSION_DATA.walletBalance >= totalAmount;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      console.log('Payment processed with method:', selectedMethod);
    }, 2000);
  };

  const paymentMethods = [
    {
      id: 'wallet' as PaymentMethod,
      name: 'Wallet',
      description: walletSufficient 
        ? `Balance: ₹${MOCK_SESSION_DATA.walletBalance.toLocaleString()}` 
        : 'Insufficient balance',
      icon: Wallet,
      disabled: !walletSufficient
    },
    {
      id: 'upi' as PaymentMethod,
      name: 'UPI',
      description: 'GPay, PhonePe, Paytm, etc.',
      icon: Smartphone,
      disabled: false
    },
    {
      id: 'card' as PaymentMethod,
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, RuPay',
      icon: CreditCard,
      disabled: false
    },
    {
      id: 'netbanking' as PaymentMethod,
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: Building2,
      disabled: false
    }
  ];

  return (
    <div className="flex flex-col bg-background min-h-full">
      {/* Session Summary Header */}
      <div className="bg-gradient-to-br from-ifind-aqua to-ifind-teal p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={MOCK_SESSION_DATA.expertImage} 
            alt={MOCK_SESSION_DATA.expertName}
            className="w-14 h-14 rounded-full border-2 border-white/30 object-cover"
          />
          <div>
            <h2 className="font-semibold text-lg">{MOCK_SESSION_DATA.expertName}</h2>
            <p className="text-sm opacity-90">{MOCK_SESSION_DATA.service}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm opacity-90">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{MOCK_SESSION_DATA.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{MOCK_SESSION_DATA.time}</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {MOCK_SESSION_DATA.duration} min
          </Badge>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Price Breakdown */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Price Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Session Fee</span>
              <span className="text-foreground">₹{MOCK_SESSION_DATA.sessionFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform Fee</span>
              <span className="text-foreground">₹{MOCK_SESSION_DATA.platformFee}</span>
            </div>
            {MOCK_SESSION_DATA.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="text-green-600">-₹{MOCK_SESSION_DATA.discount}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span className="text-foreground">Total Amount</span>
              <span className="text-ifind-aqua text-lg">₹{totalAmount}</span>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Select Payment Method</h3>
          
          <RadioGroup 
            value={selectedMethod} 
            onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
            className="space-y-3"
          >
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              
              return (
                <Card
                  key={method.id}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-ifind-aqua bg-ifind-aqua/5 ring-1 ring-ifind-aqua' 
                      : 'hover:border-ifind-aqua/50'
                  } ${method.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !method.disabled && setSelectedMethod(method.id)}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem 
                      value={method.id} 
                      id={method.id}
                      disabled={method.disabled}
                      className="data-[state=checked]:border-ifind-aqua data-[state=checked]:text-ifind-aqua"
                    />
                    <div className={`p-2.5 rounded-full ${
                      isSelected ? 'bg-ifind-aqua/10 text-ifind-aqua' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Label 
                      htmlFor={method.id} 
                      className="flex-1 cursor-pointer"
                    >
                      <p className="font-medium text-foreground">{method.name}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </Label>
                    {method.id === 'wallet' && walletSufficient && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </Card>
              );
            })}
          </RadioGroup>
        </div>

        {/* UPI ID Input - Show only when UPI is selected */}
        {selectedMethod === 'upi' && (
          <div className="space-y-2">
            <Label htmlFor="upi-id" className="text-sm font-medium">Enter UPI ID</Label>
            <Input
              id="upi-id"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="h-12"
            />
            <div className="flex gap-2 mt-3">
              {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                <Button
                  key={app}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs hover:border-ifind-aqua hover:text-ifind-aqua"
                  onClick={() => setUpiId(`user@${app.toLowerCase()}`)}
                >
                  {app}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 py-3 text-muted-foreground">
          <Shield className="h-4 w-4 text-green-500" />
          <span className="text-xs">Secured by Razorpay • 256-bit encryption</span>
        </div>
      </div>

      {/* Fixed Bottom Payment Button */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4 pb-6">
        <Button
          onClick={handlePayment}
          disabled={isProcessing || (selectedMethod === 'upi' && !upiId)}
          className="w-full h-14 bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:from-ifind-teal hover:to-ifind-aqua text-white font-semibold text-base shadow-lg"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span>Pay ₹{totalAmount} Securely</span>
            </div>
          )}
        </Button>
        
        <p className="text-center text-xs text-muted-foreground mt-3">
          By proceeding, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Star } from 'lucide-react';
import { CallPricing } from '@/hooks/call/useCallPricing';

interface CallDurationSelectorProps {
  pricingOptions: CallPricing[];
  selectedDuration: number | null;
  onSelectDuration: (duration: number, price: number) => void;
  formatPrice: (price: number) => string;
  userCurrency: 'INR' | 'USD';
  className?: string;
}

export const CallDurationSelector: React.FC<CallDurationSelectorProps> = ({
  pricingOptions,
  selectedDuration,
  onSelectDuration,
  formatPrice,
  userCurrency,
  className = ''
}) => {
  const getPrice = (option: CallPricing) => {
    return userCurrency === 'INR' ? option.price_inr : option.price_usd;
  };

  const getPopularBadge = (durationMinutes: number) => {
    // Mark 60 minutes as popular
    return durationMinutes === 60;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Select Call Duration</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {pricingOptions.map((option) => {
            const price = getPrice(option);
            const isSelected = selectedDuration === option.duration_minutes;
            const isPopular = getPopularBadge(option.duration_minutes);
            
            return (
              <div key={option.id} className="relative">
                {isPopular && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>Popular</span>
                    </div>
                  </div>
                )}
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full h-auto p-4 flex justify-between items-center ${
                    isPopular ? 'ring-2 ring-blue-200' : ''
                  }`}
                  onClick={() => onSelectDuration(option.duration_minutes, price)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {option.duration_minutes} minutes
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Perfect for {option.duration_minutes === 30 ? 'quick consultations' : 'detailed sessions'}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-lg">
                      {formatPrice(price)}
                    </span>
                    {option.duration_minutes === 60 && (
                      <span className="text-xs text-green-600">
                        Best Value
                      </span>
                    )}
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Note:</strong> Your session will automatically end when the selected duration is reached. 
            You can extend the call if needed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallDurationSelector;
